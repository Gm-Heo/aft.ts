const PotKey={
    NOW : '_now.path',
    PAST : '_past.path'
}
export const AftPot = {
    change(path:string){
        let real: string = path.split('#')[0];
        let past : string = (sessionStorage.getItem(PotKey.NOW) ||'').split('#')[0];
        if(real!=past){
            sessionStorage.setItem(PotKey.PAST,past)
            sessionStorage.setItem(PotKey.NOW,real);
        }
    },
    past():string{
        return sessionStorage.getItem(PotKey.PAST)||''
    }
}
