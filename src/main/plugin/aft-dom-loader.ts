/**
 * dom loader
 */

export const loadDom : Function = (path : string):Promise<HTMLElement|DocumentFragment> =>
    new Promise((res)=>{
        fetch(path,{
            method:'GET',
            headers:{
                'Content-Type': 'text/html',
            },
        })
        .then((result)=>result.text())
        .then((text)=>{
            res(_toDomFromString(text));
        })
        .catch((e)=>{
            if(e)console.log(e);
            res(_emptyDom());
        })
    });

/**
 * append child dom to parent
 * @param child
 * @param parent
 */
export type AppendDomType={
    scripts : HTMLScriptElement[]
};

export const appendDom : Function = (child : HTMLElement,parent: HTMLElement) : Promise<AppendDomType> =>
    new Promise((res)=>{
        const _obj : AppendDomType = {scripts: []};
        let node;
        let moduleCnt = 0,loadedModuleCnt = 0;
        const cssLength = child.querySelectorAll('link').length;
        const styleLength  = child.querySelectorAll('style').length;
        const scriptLength = child.querySelectorAll('script').length;

        moduleCnt = cssLength+scriptLength;
        moduleCnt = cssLength+scriptLength;
        console.log(`css : ${cssLength},style :${styleLength} , script : ${scriptLength}`);

        //head 부분의 스크립트 스타일 시트 부터 삽입.
        child.querySelectorAll('link').forEach((ele)=>{
            ele.setAttribute('custom','custom');
            document.head.appendChild(ele);
            ele.addEventListener('load',()=>{loadedModuleCnt++;})
        });
        //style sheet
        child.querySelectorAll('style').forEach((ele)=>{
            ele.setAttribute('custom','custom');
            document.head.appendChild(ele);
        });
        child.querySelectorAll('script').forEach((ele)=>{
            let _script = document.createElement('script');
            if(ele.src && ele.src.length >0){
                _script.src = ele.src;
                _script.type='text/javascript';
                _script.setAttribute('custom','custom');
                _script.addEventListener('load',()=>{loadedModuleCnt++;})
                document.head.appendChild(_script);
            }else{
                _script.type='text/javascript';
                _script.textContent = ele.textContent;
                _script.setAttribute('custom','custom');
                _obj.scripts.push(_script);
                loadedModuleCnt++;
            }
            ele.remove();
        });
        _check();
        function _check(){
            if(loadedModuleCnt>=moduleCnt){
                _appendPage();
            }else{
                setTimeout(_check,150);
            }
        }
        function _appendPage(){
            parent.innerHTML = '';
            if(child.nodeName ==='#document-fragment'){
                while(node = child.children.item(0)){
                    if(node.nodeName==='TITLE'){
                        document.head.querySelector('title') && document.head.querySelector('title')!.remove()
                        document.head.appendChild(node);
                    }else{
                        parent.appendChild(node);
                    }
                }
            }else{
                parent.appendChild(child);
            }
            if(window._eventQue && Object.keys(window._eventQue).length>0){
                Object.keys(window._eventQue).forEach((key:string)=>{
                    if(parent.querySelector(`[event-id=${key}]`) && typeof window._eventQue[key] ==='function'){
                        parent.querySelector(`[event-id=${key}]`)!.addEventListener('click',window._eventQue[key]);
                        window._eventQue[key] = undefined;
                    }
                });

            }
            if(window._inputQue && Object.keys(window._inputQue).length>0){
                Object.keys(window._inputQue).forEach((key:string)=>{
                    if(parent.querySelector(`[event-id=${key}]`) && typeof window._inputQue[key] ==='function'){
                        parent.querySelector(`[event-id=${key}]`)!.addEventListener('input',window._inputQue[key]);
                    }
                });
                window._inputQue = {};
            }
            res(_obj);
        }

    });
/**
 *
 * @param text
 */
const _toDomFromString = (text : string):HTMLElement|DocumentFragment=>{
    try{
        const _dom = document.createElement('template');
        _dom.innerHTML = text.trim();
        const _clone = document.importNode(_dom.content,true);
        return _clone;
    }catch(e){
        return _emptyDom();
    }
}
const _emptyDom : () => HTMLElement = ()=>document.createElement('div');


