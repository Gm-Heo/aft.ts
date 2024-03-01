import {aftRouter} from './plugin/aft-router';
import {appendDom, AppendDomType, loadDom} from "./plugin/aft-dom-loader";
import {formInit, listener} from "./plugin/aft-dom-event";
import {CodePack, RouteType} from "./types/aft-types";
import {AftPot} from "./plugin/aft-navigator";


declare global{
    interface Window{
        aftBuilder : aftBuilder,
        _eventQue : {[key:string]:any},
        _inputQue : {[key:string]:any}
    }
}

/**
 * @class aftBuilder
 */
export class aftBuilder{

    private _argument: {[key:string]:any};
    private _isJsLoaded: boolean;
    private _isPluginLoaded: boolean;
    private _globalEvent: any[];
    private _globalThread: any[];
    private _params: {[key:string]:any};
    private _form : {[key:string]:any};
    private _history : any[];
    private _pathVariable:{[key:string]:any};
    private _router : aftRouter;
    private _pageEvent : Function;
    private _viewPath : string;
    private _container : HTMLElement;
    private _interceptorHandler : Function = ()=>{};
    private _locationHandler : Function = ()=>{};
    private _codePack :CodePack;
    private _error : {[key:string]:string}

    _apiKey : string;
    _apiPreFix : string;

    constructor(key : string,apiPreFix : string ){
        this._isJsLoaded=true;
        this._isPluginLoaded=true;
        this._globalEvent = [];
        this._globalThread = [];
        this._argument = {};
        this._router = new aftRouter();
        this._params = {};
        this._form={};
        this._history = [];
        this._pathVariable={};
        this._apiKey = key;
        this._apiPreFix = apiPreFix;
        return this;
    }


    /**
     * get argument data
     * @param data
     */
    public argument(data:object|string|undefined){
        if(typeof data ==='object') this._argument = data;
        else if(typeof data ==='string')return (this._argument[data]?this._argument[data]:undefined);
        else if(typeof data==='undefined') return this._argument;
    }

    /**
     * 폼 데이터
     * @param key
     */
    public getForm(key? : string){
        if(typeof key ==='undefined')return this._form;
        return this._form[key];
    }

    /**
     * get router list
     */
    public getRouter(){
        return this._router;
    }

    /**
     * set page event
     * @param evt
     */
    public setPageEvent(evt:Function) : aftBuilder{
        this._pageEvent = evt;
        return this;
    }

    /**
     * 코드팩 설정
     * @param codePack
     */
    public codePack(codePack : CodePack) : aftBuilder{
        this._codePack = codePack;
        return this;
    }

    /**
     *
     * @param key
     * @param value
     */
    pathVariable(key:string,value :string|undefined = undefined){
        if(typeof key ==='undefined') throw new Error('key must be defined!');
        if(typeof value ==='undefined'){
            return this._pathVariable[key];
        }else{
            this._pathVariable[key]=value;
        }
    }

    /**
     * 쿼리스트링
     * @param key
     */
    querystring(key:string){
        if(this._params && this._params[key]){
            return this._params[key];
        }
        return '';
    }

    /**
     * add event listener
     * @param target
     * @param event
     * @param listener
     */
    addEventListener(target:any,event:string,listener:EventListenerOrEventListenerObject) : aftBuilder{
        this._globalEvent.push({target : target,event : event,listener:listener});
        target.addEventListener(event,listener);
        return this;
    }

    /**
     * remove all event listener
     */
    public removeEventListenerAll() : aftBuilder{
        this._globalEvent.forEach((evt)=>{
            evt.target.removeEventListener(evt.event,evt.listener);
        });
        return this;
    }

    /**
     *set view path
     * @param viewPath
     */
    public viewPath(viewPath : string) : aftBuilder{
        this._viewPath = viewPath;
        return this;
    }

    /**
     * 뷰페스 조회
     */
    public getViewPath():string{
        return this._viewPath;
    }

    /**
     * set container element
     * @param ele
     */
    public container(ele : HTMLElement){
        this._container = ele;
        return this;
    }

    /**
     * set page interceptor handler
     * @param fn
     */
    public interceptor(fn : Function) : aftBuilder{
        this._interceptorHandler = fn;
        return this;
    }

    /**
     * error page
     * @param pages
     */
    public errorPages(pages : {[key:string]:string}) : aftBuilder{
        this._error= pages;
        return this;
    }

    /**
     * 이동 이벤트
     * @param handler
     */
    public locationHandler(handler : Function) : aftBuilder{
        this._locationHandler = handler;
        return this;
    }

    public redraw(routeType : RouteType , cb : Function){
        this._router.redraw(routeType)
        this.draw(cb);
    }
    public redraws(routeType : RouteType[] , cb : Function){
        routeType.forEach(item=>this._router.redraw(item));
        this.draw(cb);
    }

    /**
     * build aft module
     * @param cb
     */
    public async build(cb : Function){
        const root = this;
        const preload : Function = window.onload || (()=>{});
        let isCallLoadFunction = false;
        window.onload = ()=>{
            if(!isCallLoadFunction){
                isCallLoadFunction = true;
                if(typeof preload ==='function') preload();
                this.initParams(location.search);
                root.draw(cb);
            }
        };
        this._history.push(location.pathname);
        return this;
    }

    /**
     * 페이지 이동
     * @param path
     * @private
     */
    private movePage(path : string){
        console.log(`move page : ${path}`);
        this._locationHandler(path);
    }

    /**
     * init parameter
     * @param path
     * @private
     */
    private initParams(path : string){
        this._params = {};
        if(typeof path!=='undefined'){
            path
                .replace('?','')
                .split("&")
                .filter(str=>str.indexOf("=")>-1)
                .forEach(str=>{
                    this._params[str.split("=")[0]] = str.split("=")[1];
                });
        }

    }

    /**
     * html로 부터 돔생성
     * @param {Function} callback
     * @private
     */
    private async draw(cb : Function){
        const root = this;
        this._pathVariable = {};
        try{

            //remove event added
            this.removeEventListenerAll();
            //remove class in base
            this._container.setAttribute('class','');
            document.body.setAttribute('class','');

            let target = Object
                .keys(this._router._list)
                .filter(path=>{
                    return path.split("/").length == location.pathname.split('/').length
                })
                .filter(path=>{
                    return new RegExp(path+'$').test(location.pathname);
                });
            if(target.length>1 && target.indexOf(location.pathname)>-1){
                target = [target[target.indexOf(location.pathname)]];
            }
            //excuse route event
            if(target && target.length>0) {
                //interceptor before loading page;
                if(typeof this._interceptorHandler ==='function'){
                    this._interceptorHandler(target[0]);
                }

                const routeEvent = root._router._list[target[0]];
                const pathVar = root._router._pathVar[target[0]];
                Object.keys(pathVar)
                    .forEach(key=>{
                        if(Number(key)>-1){
                            root._pathVariable[pathVar[key]] = location.pathname.split("/")[Number(key)];
                        }
                    });

                if(typeof routeEvent==='function'){
                    AftPot.change(location.pathname);
                    const rtnObj = await routeEvent();
                    if(typeof rtnObj!=='undefined'){
                        let viewPath = root._viewPath+rtnObj.path;
                        //To do load page;
                        if(rtnObj.path && rtnObj.path.length>0){
                            //hide body
                            document.body.classList.add('loading');
                            await loadDom(viewPath+'.html').then(async (dom:HTMLElement)=>{
                                //customer element delete;
                                document.querySelectorAll('head [custom=custom]')
                                    .forEach((cs)=>{cs.remove();});
                                //delete style on container body
                                root._container.removeAttribute('style');

                                //call onload
                                if(typeof rtnObj.onload ==='function'){
                                    dom = await rtnObj.onload(dom);
                                }
                                appendDom(
                                    dom,
                                    root._container
                                ).then(async (_obj:AppendDomType)=>{
                                    //set the form object.
                                    root._form = formInit(
                                        root._form,
                                        root._container,
                                        rtnObj.binder,
                                        root._codePack
                                    );
                                    //set listener event;
                                    listener(
                                        rtnObj,
                                        root._container
                                    );
                                    //append scripts if
                                    if(_obj.scripts){
                                        _obj.scripts.forEach((_sc)=>{
                                            root._container.appendChild(_sc);
                                        });
                                    }
                                    //show body
                                    document.body.classList.remove('loading');
                                    //load common page event
                                    if(typeof root._pageEvent ==='function'){
                                        root._pageEvent();
                                    }
                                    //load build event;
                                    if(typeof cb==='function') {
                                        cb();
                                    }
                                });
                            });
                        }else{
                            rtnObj.onload(root._container);
                            //show body
                            document.body.classList.remove('loading');

                            //load build event;
                            if(typeof cb==='function') {
                                cb();
                            }
                        }
                    }
                }
            }else{
                if(root._error['404']!==location.pathname){
                    console.log('not found page : '+location.pathname);
                    location.href=root._error['404'];
                    //move to 404 page
                }
            }
        }catch(e){
            console.error(e);
            // location.href=root._error['500'];
            //move to 500 page
        }
    }

    /**
     * 이벤트 바인딩
     * 해당 html element 에 속한 추가한 이벤트가 있을경우 추가한다.
     * @param {HTMLElement} body
     */
    patchEvent(body:HTMLElement){
        if(window._eventQue){
            console.log('has click queue')
            Object.keys(window._eventQue).forEach((key:string)=>{
                if(body.querySelector(`[event-id=${key}]`) && typeof window._eventQue[key] ==='function'){
                    body.querySelector(`[event-id=${key}]`)!.addEventListener('click',window._eventQue[key]);
                }
            });
            window._eventQue = {};
        }
        if(window._inputQue){
            Object.keys(window._inputQue).forEach((key:string)=>{
                if(body.querySelector(`[event-id=${key}]`) && typeof window._inputQue[key] ==='function'){
                    body.querySelector(`[event-id=${key}]`)!.addEventListener('input',window._inputQue[key]);
                }
            });
            window._inputQue = {};
        }

    }

}
