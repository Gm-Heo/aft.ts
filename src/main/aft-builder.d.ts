import { aftRouter } from './plugin/aft-router';
import { RouteType } from "./types/aft-types";
declare global {
    interface Window {
        aftBuilder: aftBuilder;
        _eventQue: {
            [key: string]: any;
        };
        _inputQue: {
            [key: string]: any;
        };
    }
}
/**
 * @class aftBuilder
 */
export declare class aftBuilder {
    private _argument;
    private _isJsLoaded;
    private _isPluginLoaded;
    private _globalEvent;
    private _globalThread;
    private _params;
    private _form;
    private _history;
    private _pathVariable;
    private _router;
    private _pageEvent;
    private _viewPath;
    private _container;
    private _interceptorHandler;
    private _locationHandler;
    private _error;
    _apiKey: string;
    _apiPreFix: string;
    constructor(key: string, apiPreFix: string);
    /**
     * get argument data
     * @param data
     */
    argument(data: object | string | undefined): any;
    /**
     * 폼 데이터
     * @param key
     */
    getForm(key?: string): any;
    /**
     * get router list
     */
    getRouter(): aftRouter;
    /**
     * set page event
     * @param evt
     */
    setPageEvent(evt: Function): aftBuilder;
    /**
     *
     * @param key
     * @param value
     */
    pathVariable(key: string, value?: string | undefined): any;
    /**
     * 쿼리스트링
     * @param key
     */
    querystring(key: string): any;
    /**
     * add event listener
     * @param target
     * @param event
     * @param listener
     */
    addEventListener(target: any, event: string, listener: EventListenerOrEventListenerObject): aftBuilder;
    /**
     * remove all event listener
     */
    removeEventListenerAll(): aftBuilder;
    /**
     *set view path
     * @param viewPath
     */
    viewPath(viewPath: string): aftBuilder;
    /**
     * 뷰페스 조회
     */
    getViewPath(): string;
    /**
     * set container element
     * @param ele
     */
    container(ele: HTMLElement): this;
    /**
     * set page interceptor handler
     * @param fn
     */
    interceptor(fn: Function): aftBuilder;
    /**
     * error page
     * @param pages
     */
    errorPages(pages: {
        [key: string]: string;
    }): aftBuilder;
    /**
     * 이동 이벤트
     * @param handler
     */
    locationHandler(handler: Function): aftBuilder;
    redraw(routeType: RouteType, cb: Function): void;
    redraws(routeType: RouteType[], cb: Function): void;
    /**
     * build aft module
     * @param cb
     */
    build(cb: Function): Promise<this>;
    /**
     * 페이지 이동
     * @param path
     * @private
     */
    private movePage;
    /**
     * init parameter
     * @param path
     * @private
     */
    private initParams;
    /**
     * html로 부터 돔생성
     * @param {Function} callback
     * @private
     */
    private draw;
    /**
     * 이벤트 바인딩
     * 해당 html element 에 속한 추가한 이벤트가 있을경우 추가한다.
     * @param {HTMLElement} body
     */
    patchEvent(body: HTMLElement): void;
}
