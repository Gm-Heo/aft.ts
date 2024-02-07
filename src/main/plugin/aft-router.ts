/**
 * router module
 */
import {RouteType} from "../types/aft-types";
import {Route} from "../interface/aft-interfaces";

export class aftRouter{
    _list : {[key:string]:Function};
    _routes : Route[];
    _pathVar : {[key:string]:any};
    _jsonList : {[key:string]:any};

    constructor() {
        this._list = {};
        this._pathVar = {};
        this._jsonList = {};
    }
    public addAll(...routes : Route[]){
        if(Array.isArray(routes) && routes.length>0){
            routes.forEach(r=>{
                r.call().forEach(rt=>this.get(rt.path,rt.event));
            })
        }
    }
    public redraw(routeType : RouteType){
        if(this._list && Object.keys(this._list).length>0){
            if(this._list[routeType.path]){
                delete this._list[routeType.path];
            }
            if(this._jsonList[routeType.path]){
                delete this._jsonList[routeType.path];
            }
            this.get(routeType.path,routeType.event);
        }
    }
    /**
     * method get
     * @param path
     * @param event
     */
    public get(path : string,event : Function) : aftRouter{
        let pathVar : any = {};
        let idx=0;
        if(Array.isArray(path)){
            if( path.filter(p=> typeof this._list[p]!=='undefined').length >0){
                throw new Error('Duplicate url paths ');
            }
            path.map((path : string)=>{
                return path.split('/')
                    .map(p => {
                        if(p.indexOf('{')>-1 && p.indexOf('}')>-1) {
                            const key = path.substring(path.indexOf('{') + 1, path.lastIndexOf('}'))
                            pathVar[idx] = key;
                            path  = '[a-zA-Z0-9_]*';
                        }
                        idx++;
                        return path;
                    }).join("/");
            }).forEach((path:string)=>{
                this._list[path] = event;
                this._pathVar[path] = pathVar;
                // this._list[path].pathVar = pathVar;
            });
        }else{
            if(typeof this._list[path]!=='undefined'){
                throw new Error('Duplicate url path : '+path);
            }
            path = path.split('/')
                .map(path=>{
                    if(path.indexOf('{')>-1 && path.indexOf('}')>-1) {
                        const key = path.substring(path.indexOf('{') + 1, path.lastIndexOf('}'))
                        pathVar[idx] = key;
                        path  = '[a-zA-Z0-9_]*';
                    }
                    idx++;
                    return path;
                }).join("/");
            this._list[path] = event;
            // this._list[path].pathVar = pathVar;
            this._pathVar[path] = pathVar
        }

        return this;
    }

    /**
     * json
     * @param path
     * @param event
     */
    public json(path : string,event : Event ) : aftRouter{
        this._jsonList[path] = event;
        return this;
    }

    /**
     * remove path
     * @param path
     */
    public remove(path : string){
        this._list[path] = (()=>{});
    }

}

