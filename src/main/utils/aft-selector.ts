export const $at = (ele : HTMLElement)=>{
    return {
        s : (selector:string) : HTMLElement|undefined=>ele.querySelector(selector)as HTMLElement||undefined,
        sa : <E extends Element = Element>(selectors: string): NodeListOf<E> | any[]=>ele.querySelectorAll(selectors)||[],
        //@ts-ignore
        ca:(str: string)=>ele.classList.add(str),
        cr:(cls:string)=>ele.classList.remove(cls),
        ac:(ele:HTMLElement)=>ele.appendChild(ele),
        id : ()=>ele.getAttribute('aft-id')||'',
        sid:(id:string):HTMLElement|null=>ele.querySelector(`[aft-id=${id}]`),
        value:():any =>(ele as HTMLInputElement).value,
        data :(attr:string):string=>ele.getAttribute(`data-${attr}`)||'',
        aria : (attr:string):string=>ele.getAttribute(`aria-${attr}`)||'',
        hasClass:(cls:string) => ele.classList.contains(cls)

    }
}
