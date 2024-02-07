/**
 * url 관련유틸
 */
export declare const NetUtils: {
    queryString: (key: string) => string;
    hasQueryString: (key: string) => boolean;
};
/**
 * 날짜 관련 유틸리티
 */
export declare const DateUtils: {
    format: (date: Date, format: string) => string;
    diffDay: (endDt: Date, stDt: Date) => number;
    addDay: (date: Date, day: number) => Date;
};
/**
 * 문자관련 유틸
 */
export declare const StringUtils: {
    lpad: (str: string, appendStr: string, size: number) => string;
    rpad: (str: string, appendStr: string, size: number) => string;
};
/**
 * 숫자관련 유틸
 */
export declare const NumberUtils: {
    /**
     * n이 Nan 대체 r
     * @param n
     * @param r
     */
    ifNaN(n: number, r: number): void;
};
/**
 * 돔생성
 * @param node
 * @constructor
 */
export declare const MakeFor: (node?: string) => {
    html: (html: string) => any;
    text: (text: string) => any;
    attr: (key: string, value: string | number) => any;
    value: (value: string | number | undefined) => any;
    cls: (...cls: string[]) => any;
    event: (type: string, listener: Function) => any;
    element: HTMLElement;
};
/**
 * 돔 간편생성
 * @param props
 */
export declare const html: (...props: any[]) => HTMLElement;
/**
 * 돔 간편생성
 * @param props
 */
export declare const htmls: (...props: any) => HTMLCollection;
/**
 * 벨리데이션 검사
 */
export declare const Validator: {
    email: (text: string) => boolean;
    password: (text?: string) => boolean;
    isNull: (test?: string) => boolean;
    hasNullData: (...values: any[]) => boolean;
};
/**
 * 버튼 사용체크
 */
export declare const Buttons: {
    activeToggle: (btn?: HTMLElement, active?: boolean) => void;
};
/**
 * 인풋 엘리먼트 유틸
 */
export declare const InputBox: {
    pattern: (input: HTMLInputElement, pattern: string) => void;
    value: (input: HTMLElement | null, value: string) => void;
};
/**
 * 텍스트 에어리어 유틸
 */
export declare const TextAreaBox: {
    value: (area: HTMLElement | null, value: string | undefined) => void;
};
/**
 * 체크박스 엘리먼트 유틸
 */
export declare const CheckBox: {
    check(box: HTMLElement | undefined, value: string): void;
    list<E extends Element = Element>(boxes: any[] | NodeListOf<E>, values: string[]): void;
};
/**
 * 기본 엘리먼트 텍스트 설정
 */
export declare const ElementBox: {
    value: (box: HTMLElement | null | undefined, value: string | undefined) => void;
};
