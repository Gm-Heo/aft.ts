export const $at = (ele) => {
    return {
        s: (selector) => ele.querySelector(selector) || undefined,
        sa: (selectors) => ele.querySelectorAll(selectors) || [],
        //@ts-ignore
        ca: (str) => ele.classList.add(str),
        cr: (cls) => ele.classList.remove(cls),
        ac: (ele) => ele.appendChild(ele),
        id: () => ele.getAttribute('aft-id') || '',
        sid: (id) => ele.querySelector(`[aft-id=${id}]`),
        value: () => ele.value,
        data: (attr) => ele.getAttribute(`data-${attr}`) || '',
        aria: (attr) => ele.getAttribute(`aria-${attr}`) || '',
        hasClass: (cls) => ele.classList.contains(cls)
    };
};
//# sourceMappingURL=aft-selector.js.map