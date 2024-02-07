var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { aftRouter } from './plugin/aft-router';
import { appendDom, loadDom } from "./plugin/aft-dom-loader";
import { formInit, listener } from "./plugin/aft-dom-event";
import { AftPot } from "./plugin/aft-navigator";
/**
 * @class aftBuilder
 */
export class aftBuilder {
    constructor(key, apiPreFix) {
        this._interceptorHandler = () => { };
        this._locationHandler = () => { };
        this._isJsLoaded = true;
        this._isPluginLoaded = true;
        this._globalEvent = [];
        this._globalThread = [];
        this._argument = {};
        this._router = new aftRouter();
        this._params = {};
        this._form = {};
        this._history = [];
        this._pathVariable = {};
        this._apiKey = key;
        this._apiPreFix = apiPreFix;
        return this;
    }
    /**
     * get argument data
     * @param data
     */
    argument(data) {
        if (typeof data === 'object')
            this._argument = data;
        else if (typeof data === 'string')
            return (this._argument[data] ? this._argument[data] : undefined);
        else if (typeof data === 'undefined')
            return this._argument;
    }
    /**
     * 폼 데이터
     * @param key
     */
    getForm(key) {
        if (typeof key === 'undefined')
            return this._form;
        return this._form[key];
    }
    /**
     * get router list
     */
    getRouter() {
        return this._router;
    }
    /**
     * set page event
     * @param evt
     */
    setPageEvent(evt) {
        this._pageEvent = evt;
        return this;
    }
    /**
     *
     * @param key
     * @param value
     */
    pathVariable(key, value = undefined) {
        if (typeof key === 'undefined')
            throw new Error('key must be defined!');
        if (typeof value === 'undefined') {
            return this._pathVariable[key];
        }
        else {
            this._pathVariable[key] = value;
        }
    }
    /**
     * 쿼리스트링
     * @param key
     */
    querystring(key) {
        if (this._params && this._params[key]) {
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
    addEventListener(target, event, listener) {
        this._globalEvent.push({ target: target, event: event, listener: listener });
        target.addEventListener(event, listener);
        return this;
    }
    /**
     * remove all event listener
     */
    removeEventListenerAll() {
        this._globalEvent.forEach((evt) => {
            evt.target.removeEventListener(evt.event, evt.listener);
        });
        return this;
    }
    /**
     *set view path
     * @param viewPath
     */
    viewPath(viewPath) {
        this._viewPath = viewPath;
        return this;
    }
    /**
     * 뷰페스 조회
     */
    getViewPath() {
        return this._viewPath;
    }
    /**
     * set container element
     * @param ele
     */
    container(ele) {
        this._container = ele;
        return this;
    }
    /**
     * set page interceptor handler
     * @param fn
     */
    interceptor(fn) {
        this._interceptorHandler = fn;
        return this;
    }
    /**
     * error page
     * @param pages
     */
    errorPages(pages) {
        this._error = pages;
        return this;
    }
    /**
     * 이동 이벤트
     * @param handler
     */
    locationHandler(handler) {
        this._locationHandler = handler;
        return this;
    }
    redraw(routeType, cb) {
        this._router.redraw(routeType);
        this.draw(cb);
    }
    redraws(routeType, cb) {
        routeType.forEach(item => this._router.redraw(item));
        this.draw(cb);
    }
    /**
     * build aft module
     * @param cb
     */
    build(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const root = this;
            const preload = window.onload || (() => { });
            let isCallLoadFunction = false;
            window.onload = () => {
                if (!isCallLoadFunction) {
                    isCallLoadFunction = true;
                    if (typeof preload === 'function')
                        preload();
                    this.initParams(location.search);
                    root.draw(cb);
                }
            };
            this._history.push(location.pathname);
            return this;
        });
    }
    /**
     * 페이지 이동
     * @param path
     * @private
     */
    movePage(path) {
        console.log(`move page : ${path}`);
        this._locationHandler(path);
    }
    /**
     * init parameter
     * @param path
     * @private
     */
    initParams(path) {
        this._params = {};
        if (typeof path !== 'undefined') {
            path
                .replace('?', '')
                .split("&")
                .filter(str => str.indexOf("=") > -1)
                .forEach(str => {
                this._params[str.split("=")[0]] = str.split("=")[1];
            });
        }
    }
    /**
     * html로 부터 돔생성
     * @param {Function} callback
     * @private
     */
    draw(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            const root = this;
            this._pathVariable = {};
            try {
                //remove event added
                this.removeEventListenerAll();
                //remove class in base
                this._container.setAttribute('class', '');
                document.body.setAttribute('class', '');
                let target = Object
                    .keys(this._router._list)
                    .filter(path => {
                    return path.split("/").length == location.pathname.split('/').length;
                })
                    .filter(path => {
                    return new RegExp(path + '$').test(location.pathname);
                });
                if (target.length > 1 && target.indexOf(location.pathname) > -1) {
                    target = [target[target.indexOf(location.pathname)]];
                }
                //excuse route event
                if (target && target.length > 0) {
                    //interceptor before loading page;
                    if (typeof this._interceptorHandler === 'function') {
                        this._interceptorHandler(target[0]);
                    }
                    const routeEvent = root._router._list[target[0]];
                    const pathVar = root._router._pathVar[target[0]];
                    Object.keys(pathVar)
                        .forEach(key => {
                        if (Number(key) > -1) {
                            root._pathVariable[pathVar[key]] = location.pathname.split("/")[Number(key)];
                        }
                    });
                    if (typeof routeEvent === 'function') {
                        AftPot.change(location.pathname);
                        const rtnObj = yield routeEvent();
                        if (typeof rtnObj !== 'undefined') {
                            let viewPath = root._viewPath + rtnObj.path;
                            //To do load page;
                            if (rtnObj.path && rtnObj.path.length > 0) {
                                //hide body
                                document.body.classList.add('loading');
                                yield loadDom(viewPath + '.html').then((dom) => __awaiter(this, void 0, void 0, function* () {
                                    //customer element delete;
                                    document.querySelectorAll('head [custom=custom]')
                                        .forEach((cs) => { cs.remove(); });
                                    //delete style on container body
                                    root._container.removeAttribute('style');
                                    //call onload
                                    if (typeof rtnObj.onload === 'function') {
                                        dom = yield rtnObj.onload(dom);
                                    }
                                    appendDom(dom, root._container).then((_obj) => __awaiter(this, void 0, void 0, function* () {
                                        //set the form object.
                                        root._form = formInit(root._form, root._container, rtnObj.binder);
                                        //set listener event;
                                        listener(rtnObj, root._container);
                                        //append scripts if
                                        if (_obj.scripts) {
                                            _obj.scripts.forEach((_sc) => {
                                                root._container.appendChild(_sc);
                                            });
                                        }
                                        //show body
                                        document.body.classList.remove('loading');
                                        //load common page event
                                        if (typeof root._pageEvent === 'function') {
                                            root._pageEvent();
                                        }
                                        //load build event;
                                        if (typeof cb === 'function') {
                                            cb();
                                        }
                                    }));
                                }));
                            }
                            else {
                                rtnObj.onload(root._container);
                                //show body
                                document.body.classList.remove('loading');
                                //load build event;
                                if (typeof cb === 'function') {
                                    cb();
                                }
                            }
                        }
                    }
                }
                else {
                    if (root._error['404'] !== location.pathname) {
                        console.log('not found page : ' + location.pathname);
                        location.href = root._error['404'];
                        //move to 404 page
                    }
                }
            }
            catch (e) {
                console.error(e);
                // location.href=root._error['500'];
                //move to 500 page
            }
        });
    }
    /**
     * 이벤트 바인딩
     * 해당 html element 에 속한 추가한 이벤트가 있을경우 추가한다.
     * @param {HTMLElement} body
     */
    patchEvent(body) {
        ;
        if (window._eventQue) {
            console.log('has click queue');
            Object.keys(window._eventQue).forEach((key) => {
                if (body.querySelector(`[event-id=${key}]`) && typeof window._eventQue[key] === 'function') {
                    body.querySelector(`[event-id=${key}]`).addEventListener('click', window._eventQue[key]);
                }
            });
            window._eventQue = {};
        }
        if (window._inputQue) {
            Object.keys(window._inputQue).forEach((key) => {
                if (body.querySelector(`[event-id=${key}]`) && typeof window._inputQue[key] === 'function') {
                    body.querySelector(`[event-id=${key}]`).addEventListener('input', window._inputQue[key]);
                }
            });
            window._inputQue = {};
        }
    }
}
//# sourceMappingURL=aft-builder.js.map