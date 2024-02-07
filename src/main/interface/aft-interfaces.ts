import {RouteType} from "../types/aft-types";

export interface OAuthService{
    connect(token : string) : Promise<any>;
    oauth(token : string) : Promise<any>;
    reSignIn(token:string) :void;
}

export interface AftOauth{
    oAuth(): Promise<any>;
    connect()  : Promise<any>;
    hasToken() : boolean;
    reSignIn() : void;
}

export interface Route{
    call(): RouteType[];
    update(key :string| {[key:string]:any} ,param? : {[key:string]:any}):void;
}
