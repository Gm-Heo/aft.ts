import { aftBuilder } from "../aft-builder";
export interface AftTabBodyProps<T> {
    param?: T;
}
export interface AftTabProps<T> {
    list: AftTabBodyReturns[];
    body: HTMLElement;
    builder: aftBuilder;
}
export interface AftTabBodyReturns {
    id: string;
    path: string;
    binder?: {
        [key: string]: any;
    };
    onload: Function;
    event?: {};
    listener?: {};
}
export declare class AftTabBody<T> {
    form: {
        [key: string]: any;
    };
    props: AftTabProps<T>;
    constructor(props: AftTabProps<T>);
    push(tabBody: AftTabBodyReturns): void;
    open(id: string, param?: any): Promise<void>;
    _load(tab: AftTabBodyReturns, param?: any): Promise<void>;
}
