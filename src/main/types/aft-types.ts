/**
 * 라우트 타입
 */
export type RouteType = {
    path : string,
    event : Function
}

/**
 * 라우트 반환 타입
 */
export type RouteReturnType= {
    path : string,
    event : {[key:string]:Function},
    listener?:{[key:string]:Function}|undefined,
    onload : Function,
    binder?:{[key:string]:any}
}
/**
 * 응답 타입
 */
export type ApiReturnType<TResponse> = {
    status : string,
    data? : TResponse,
    message? : string,
    header ? :any
}

/**
 * 코드타입
 */
export interface CodeType{
    code : string,
    value:string,
}
export interface CodeGroupType{
    name : string,
    list : CodeType[]
}

export interface CodePack{
    codes : CodeGroupType[]
}
