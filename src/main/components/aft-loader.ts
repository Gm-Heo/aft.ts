import {appendDom, loadDom} from "../plugin/aft-dom-loader";
import {aftBuilder} from "../aft-builder";
import {listener} from "../plugin/aft-dom-event";

export interface AftLoaderProps{
    path : string
    body : HTMLElement,
    builder : aftBuilder,
    events : {
        listener? :{},
        event?:{}
    }
}

/**
 * 돔로드 클레스
 */
export class AftLoader{
    props : AftLoaderProps
    constructor(props : AftLoaderProps) {
        this.props = props;
    }
    async load(){
        this.props.body.innerHTML = ``;
        const viewPath = `${this.props.builder.getViewPath()}${this.props.path}.html`;
        await loadDom(viewPath).then(async (dom : HTMLElement)=>{
              appendDom(
                  dom,
                  this.props.body
              ).then(()=>{
                  listener(
                      {
                          listener:this.props.events.listener||{},
                          event : this.props.events.event||{}
                      },
                      this.props.body
                  );
              })
        })
    }
}
