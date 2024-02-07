export class aftRouter {
    constructor() {
        this._list = {};
        this._pathVar = {};
        this._jsonList = {};
    }
    addAll(...routes) {
        if (Array.isArray(routes) && routes.length > 0) {
            routes.forEach(r => {
                r.call().forEach(rt => this.get(rt.path, rt.event));
            });
        }
    }
    redraw(routeType) {
        if (this._list && Object.keys(this._list).length > 0) {
            if (this._list[routeType.path]) {
                delete this._list[routeType.path];
            }
            if (this._jsonList[routeType.path]) {
                delete this._jsonList[routeType.path];
            }
            this.get(routeType.path, routeType.event);
        }
    }
    /**
     * method get
     * @param path
     * @param event
     */
    get(path, event) {
        let pathVar = {};
        let idx = 0;
        if (Array.isArray(path)) {
            if (path.filter(p => typeof this._list[p] !== 'undefined').length > 0) {
                throw new Error('Duplicate url paths ');
            }
            path.map((path) => {
                return path.split('/')
                    .map(p => {
                    if (p.indexOf('{') > -1 && p.indexOf('}') > -1) {
                        const key = path.substring(path.indexOf('{') + 1, path.lastIndexOf('}'));
                        pathVar[idx] = key;
                        path = '[a-zA-Z0-9_]*';
                    }
                    idx++;
                    return path;
                }).join("/");
            }).forEach((path) => {
                this._list[path] = event;
                this._pathVar[path] = pathVar;
                // this._list[path].pathVar = pathVar;
            });
        }
        else {
            if (typeof this._list[path] !== 'undefined') {
                throw new Error('Duplicate url path : ' + path);
            }
            path = path.split('/')
                .map(path => {
                if (path.indexOf('{') > -1 && path.indexOf('}') > -1) {
                    const key = path.substring(path.indexOf('{') + 1, path.lastIndexOf('}'));
                    pathVar[idx] = key;
                    path = '[a-zA-Z0-9_]*';
                }
                idx++;
                return path;
            }).join("/");
            this._list[path] = event;
            // this._list[path].pathVar = pathVar;
            this._pathVar[path] = pathVar;
        }
        return this;
    }
    /**
     * json
     * @param path
     * @param event
     */
    json(path, event) {
        this._jsonList[path] = event;
        return this;
    }
    /**
     * remove path
     * @param path
     */
    remove(path) {
        this._list[path] = (() => { });
    }
}
//# sourceMappingURL=aft-router.js.map