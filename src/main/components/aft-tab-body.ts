import {aftBuilder} from "../aft-builder";
import {appendDom, AppendDomType, loadDom} from "../plugin/aft-dom-loader";
import {formInit, listener} from "../plugin/aft-dom-event";

export interface AftTabBodyProps<T>{
    param?:T
}
export interface AftTabProps<T>{
    list : AftTabBodyReturns[],
    body : HTMLElement,
    builder : aftBuilder,
}
export interface AftTabBodyReturns{
    id : string,
    path : string,
    binder? : {[key:string]:any},
    onload : Function,
    event? : {},
    listener?:{}
}

export class AftTabBody<T>{
    form : {[key:string]:any};
    props  : AftTabProps<T>
    constructor(props : AftTabProps<T>) {
        this.props = props;
    }
    push(tabBody : AftTabBodyReturns){
        this.props.list.push(tabBody);
    }
    async open(id : string,param?:any){

        let filtered  = this.props.list.filter(p=>p.id == id);
        if(filtered && filtered.length>0){
            await this._load(filtered[0],param);
        }
    }
    async _load(tab : AftTabBodyReturns,param?:any){
        this.props.body.innerHTML = ``;
        const viewPath = `${this.props.builder.getViewPath()}${tab.path}.html`
        await loadDom(viewPath).then(async (dom : HTMLElement)=>{
            if(typeof tab.onload ==='function'){
                await tab.onload(dom,param);
            }

            appendDom(
                dom,
                this.props.body
            ).then((async (_obj:AppendDomType)=>{

                this.form = formInit(
                    this.form,
                    this.props.body,
                    tab.binder
                );
                listener(
                    {
                        listener:tab.listener||{},
                        event : tab.event||{}
                    },
                    this.props.body
                );
            }));
        });
    }

}
