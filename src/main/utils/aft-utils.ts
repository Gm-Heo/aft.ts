/**
 * url 관련유틸
 */
export const NetUtils = {
    queryString : (key : string) : string=>{
        if(location.href.indexOf('?')<0) return '';
        let query = location.href.split("?")[1];
        return query
            .split("&")
            .filter(str=>str.indexOf("=")>-1)
            .filter(str=>str.split("=")[0]===key)
            .map(str=>str.split("=")[1]).join("")
    },
    hasQueryString : (key: string) : boolean=>{
        if(!key) return false;

        if(NetUtils.queryString(key)) return true;

        return false;
    }
}
/**
 * 날짜 관련 유틸리티
 */
export const DateUtils = {
    format : (date : Date,format : string):string=>{
        const weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let hours: number = 0;
        if(!date.valueOf()) return "";
        return format.replace(/(yyyy|yy|MM|dd|W|hh|mi|ss|ms|a\/p)/gi, function($1) {
            switch ($1) {
                case "yyyy": return date.getFullYear().toString();
                case "yy": return (date.getFullYear().toString().substr(2,4));
                case "MM": return StringUtils.lpad((date.getMonth() + 1).toString(),"0",2);
                case "mm": return StringUtils.lpad((date.getMonth() + 1).toString(),"0",2);
                case "dd": return StringUtils.lpad(date.getDate().toString(),"0",2);
                case "W": return weekName[date.getDay()];
                case "HH": return StringUtils.lpad(date.getHours().toString(),"0",2);
                case "hh": return StringUtils.lpad(((hours = date.getHours() % 12) ? hours : 12).toString(),"0",2);
                case "mi": return StringUtils.lpad(date.getMinutes().toString(),"0",2);
                case "ss": return StringUtils.lpad(date.getSeconds().toString(),"0",2);
                case "ms":return date.getMilliseconds()+'';
                case "a/p": return date.getHours() < 12 ? "오전" : "오후";
                default: return $1;
            }
        });
    },
    diffDay : (endDt:Date,stDt : Date):number =>{
        var diff =endDt.getTime()- stDt.getTime();
        return Math.ceil(diff/(1000*60*60*24));
    },
    addDay : (date:Date,day:number):Date=>{
        date.setDate(date.getDate()+day);
        return date;
    }
}
/**
 * 문자관련 유틸
 */
export const StringUtils = {
    lpad : (str:string,appendStr:string,size : number) : string=>{
        let s='';
        for(let i=0;i<size-str.length;i++){
            s+=appendStr;
        }return s+""+str
    },
    rpad : (str:string,appendStr:string,size : number) : string=>{
        let s='';
        for(let i=0;i<size-str.length;i++){
            s+=appendStr;
        }return str+''+s;
    }
}
/**
 * 숫자관련 유틸
 */
export const NumberUtils={
    /**
     * n이 Nan 대체 r
     * @param n
     * @param r
     */
    ifNaN (n:number,r:number){
        n = Number.isNaN(n)?r:n;
    }
}
/**
 * 돔생성
 * @param node
 * @constructor
 */
export const MakeFor = (node:string = 'div')=> {
    const ele  = document.createElement(node);
    return {
        html : function(html:string){return ele.innerHTML = html ,this;},
        text : function(text:string){return ele.innerText = text ,this;},
        attr : function(key:string,value:string|number){return ele.setAttribute(key,`${value||''}`),this;},
        value : function(value:string|number|undefined){
            return (ele as HTMLInputElement).value = `${value||''}`,this;
        },
        cls : function(...cls:string[]){return cls.filter(item=>item && item!='').forEach(item=>ele.classList.add(item)),this;},
        event : function(type:string,listener:Function){return ele.addEventListener(type,function(e){
            return listener(e,ele);
        }),this;},
        element : ele
    }
}
/**
 * 돔 간편생성
 * @param props
 */
export const html= (...props:any[]): HTMLElement => {
    let _html :string = '';
    let _clickId: string = '';
    let _inputId : string='';
    let _clickQue: { [key: string]: Function } = window['_eventQue'] || {};
    let _inputQue : { [key: string]: Function } = window['_inputQue'] || {};
    let _clickSeq = Object.keys(_clickQue).length;
    let _inputSeq = Object.keys(_inputQue).length;
    if (props.length > 1) {
        let main = props[0];
        props.forEach((p, idx) => {
            if (idx > 0) {
                let appendStr = main[idx - 1];
                _clickId = '';
                //if there's click event;
                if (appendStr.indexOf("onClick") > -1 || appendStr.indexOf("onclick") > -1) {
                    _clickId = `ck_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_clickSeq}`;
                    appendStr = appendStr.replace('onClick', 'event-id').replace('onclick','event-id');
                    appendStr += _clickId;
                    _clickSeq++;
                }
                if(appendStr.indexOf("onInput") > -1 || appendStr.indexOf("oninput") > -1){
                    _inputId = `ip_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_inputSeq}`;
                    appendStr = appendStr.replace('onInput', 'event-id').replace('oninput','event-id');
                    appendStr += _inputId;
                    _inputSeq++;
                }
                if (Array.isArray(props[idx])) {
                    _html += appendStr;
                    props[idx].forEach((node:any) => {
                        if (typeof node === 'object' && typeof node['outerHTML'] !== 'undefined') {
                            _html += node.outerHTML;
                        } else if (_clickId.length > 0 && typeof node === 'function') {
                            _clickQue[_clickId] = node;
                        }else if(_inputId.length>0 && typeof  node ==='function'){
                            _inputQue[_inputId] = node;
                        } else {
                            _html += node;
                        }
                    });
                } else {
                        if(props[idx]== null){
                            _html += appendStr + '';
                        }else if (typeof props[idx] === 'object' && typeof props[idx]['outerHTML'] !== 'undefined') {
                            _html += appendStr + props[idx].outerHTML;
                        } else if (_clickId.length > 0 && typeof props[idx] === 'function') {
                            _html += appendStr;
                            _clickQue[_clickId] = props[idx];
                        }else if(_inputId.length>0 && typeof  props[idx] ==='function'){
                            _html += appendStr;
                            _inputQue[_inputId] = props[idx];
                        } else {
                            _html += appendStr + props[idx];
                        }

                }
            }
        });
        _html += main[main.length - 1];
    } else if (props.length == 1) {
        if(Array.isArray(props[0]) && props[0].length>0){
            _html = props[0][0];
        }else{
            _html = props[0];
        }

    }
    if (Object.keys(_clickQue).length > 0) {
        window['_eventQue'] = _clickQue;

    }
    if (Object.keys(_inputQue).length > 0) {
        window['_inputQue'] = _inputQue;
    }
    return MakeFor('div').html(_html).element.firstChild as HTMLElement;
}
/**
 * 돔 간편생성
 * @param props
 */
export const htmls= (...props:any): HTMLCollection => {
    let _html :string = '';
    let _clickId: string = '';
    let _inputId : string='';
    let _clickQue: { [key: string]: Function } = window['_eventQue'] || {};
    let _inputQue : { [key: string]: Function } = window['_inputQue'] || {};

    let _clickSeq = Object.keys(_clickQue).length;
    let _inputSeq = Object.keys(_inputQue).length;
    if (props.length > 1) {
        let main = props[0];
        props.forEach((p:any, idx:number) => {
            if (idx > 0) {
                let appendStr = main[idx - 1];
                _clickId = '';
                //if there's click event;
                if (appendStr.indexOf("onClick") > -1 || appendStr.indexOf("onclick") > -1) {
                    _clickId = `ck_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_clickSeq}`;
                    appendStr = appendStr.replace('onClick', 'event-id').replace('onclick','event-id');
                    appendStr += _clickId;
                    _clickSeq++;
                }
                if(appendStr.indexOf("onInput") > -1 || appendStr.indexOf("oninput") > -1){
                    _inputId = `ck_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_inputSeq}`;
                    appendStr = appendStr.replace('onInput', 'event-id').replace('oninput','event-id');
                    appendStr += _inputId;
                    _inputSeq++;
                }
                if (Array.isArray(props[idx])) {
                    _html += appendStr;
                    props[idx].forEach((node:HTMLElement) => {
                        if (typeof node === 'object' && typeof node['outerHTML'] !== 'undefined') {
                            _html += node.outerHTML;
                        } else if (_clickId.length > 0 && typeof node === 'function') {
                            _clickQue[_clickId] = node;
                        }else if(_inputId.length>0 && typeof  node ==='function'){
                            _inputQue[_inputId] = node;
                        } else {
                            _html += node;
                        }
                    });
                } else {
                    if(props[idx]== null){
                        _html += appendStr + '';
                    }else if (typeof props[idx] === 'object' && typeof props[idx]['outerHTML'] !== 'undefined') {
                        _html += appendStr + props[idx].outerHTML;
                    } else if (_clickId.length > 0 && typeof props[idx] === 'function') {
                        _html += appendStr;
                        _clickQue[_clickId] = props[idx];
                    }else if(_inputId.length>0 && typeof  props[idx] ==='function'){
                        _html += appendStr;
                        _inputQue[_inputId] = props[idx];
                    } else {
                        _html += appendStr + props[idx];
                    }
                }
            }
        });
        _html += main[main.length - 1];
    } else if (props.length == 1) {
        if(Array.isArray(props[0]) && props[0].length>0){
            _html = props[0][0];
        }else{
            _html = props[0];
        }
    }
    if (Object.keys(_clickQue).length > 0) {
        window['_eventQue'] = _clickQue;
    }
    if (Object.keys(_inputQue).length > 0) {
        //@ts-ignore
        window['_inputQue'] = _inputQue;
    }
    let parent = MakeFor('div').html(_html).element;
    for(let i=0;i<parent.children.length;i++){
        parent.children
    }

    return parent.children;
}
/**
 * 벨리데이션 검사
 */
export const Validator  = {
    email : (text : string) : boolean =>{
        let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return regex.test(text);
    },
    password : (text : string='') : boolean =>{
        return /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(text) && !(/\s/g.test(text));
    },
    isNull : (test:string='') : boolean=>{
        return (test||'').length ==0 || typeof test ==='undefined' || test ==null;
    },
    hasNullData : (...values :any[]) : boolean=>{
        return (values.filter(Validator.isNull).length>0)
    }
}
/**
 * 버튼 사용체크
 */
export const Buttons = {
    activeToggle : (btn? : HTMLElement,active: boolean=false)=>{
        if(btn){
            if(active){
                btn.removeAttribute('disabled');
                btn.classList.add('active')
            }else{
                btn.setAttribute('disabled','disabled')
                btn.classList.remove('active')

            }
        }

    }
}
/**
 * 인풋 엘리먼트 유틸
 */
export const InputBox = {
    pattern : (input:HTMLInputElement, pattern:string)=>{
        let regexp =  new RegExp('['+pattern+']','ig');
        input.addEventListener('input',(e)=>{
            input.value = input.value.replace(regexp,'');
        })
    },
    value : (input : HTMLElement|null,value:string)=>{
        if(input){
            (input as HTMLInputElement).value = value
        }
    }
}
/**
 * 텍스트 에어리어 유틸
 */
export const TextAreaBox = {
    value : (area : HTMLElement| null,value:string|undefined)=>{
        if(area){
            (area as HTMLTextAreaElement).value = value||''
        }
    }
}
/**
 * 체크박스 엘리먼트 유틸
 */
export const CheckBox = {
    check (box:HTMLElement|undefined,value : string){
        if(typeof box !=='undefined'){
            let inp = box as HTMLInputElement;
            inp.checked=inp.value === value;
        }

    },
    list<E extends Element = Element>(boxes : NodeListOf<E>| any[],values:string[]){
        boxes.forEach(box=>{
            if(typeof box !=='undefined'){
                let inp = box as HTMLInputElement;
                inp.checked = values.indexOf(inp.value)>-1;
            }
        })
    }
}
/**
 * 기본 엘리먼트 텍스트 설정
 */
export const ElementBox = {
    value : (box : HTMLElement|null|undefined,value:string|undefined)=>{
        if(box){
            box.innerText = value||'';
        }
    }
}
