/**
 * router module
 */
import { RouteType } from "../types/aft-types";
import { Route } from "../interface/aft-interfaces";
export declare class aftRouter {
    _list: {
        [key: string]: Function;
    };
    _routes: Route[];
    _pathVar: {
        [key: string]: any;
    };
    _jsonList: {
        [key: string]: any;
    };
    constructor();
    addAll(...routes: Route[]): void;
    redraw(routeType: RouteType): void;
    /**
     * method get
     * @param path
     * @param event
     */
    get(path: string, event: Function): aftRouter;
    /**
     * json
     * @param path
     * @param event
     */
    json(path: string, event: Event): aftRouter;
    /**
     * remove path
     * @param path
     */
    remove(path: string): void;
}
