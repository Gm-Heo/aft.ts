var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { appendDom, loadDom } from "../plugin/aft-dom-loader";
import { formInit, listener } from "../plugin/aft-dom-event";
export class AftTabBody {
    constructor(props) {
        this.props = props;
    }
    push(tabBody) {
        this.props.list.push(tabBody);
    }
    open(id, param) {
        return __awaiter(this, void 0, void 0, function* () {
            let filtered = this.props.list.filter(p => p.id == id);
            if (filtered && filtered.length > 0) {
                yield this._load(filtered[0], param);
            }
        });
    }
    _load(tab, param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.props.body.innerHTML = ``;
            const viewPath = `${this.props.builder.getViewPath()}${tab.path}.html`;
            yield loadDom(viewPath).then((dom) => __awaiter(this, void 0, void 0, function* () {
                if (typeof tab.onload === 'function') {
                    yield tab.onload(dom, param);
                }
                appendDom(dom, this.props.body).then(((_obj) => __awaiter(this, void 0, void 0, function* () {
                    this.form = formInit(this.form, this.props.body, tab.binder);
                    listener({
                        listener: tab.listener || {},
                        event: tab.event || {}
                    }, this.props.body);
                })));
            }));
        });
    }
}
//# sourceMappingURL=aft-tab-body.js.map