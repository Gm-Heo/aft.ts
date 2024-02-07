export declare const $at: (ele: HTMLElement) => {
    s: (selector: string) => HTMLElement | undefined;
    sa: <E extends Element = Element>(selectors: string) => any[] | NodeListOf<E>;
    ca: (str: string) => void;
    cr: (cls: string) => void;
    ac: (ele: HTMLElement) => HTMLElement;
    id: () => string;
    sid: (id: string) => HTMLElement | null;
    value: () => any;
    data: (attr: string) => string;
    aria: (attr: string) => string;
    hasClass: (cls: string) => boolean;
};
