const PotKey = {
    NOW: '_now.path',
    PAST: '_past.path'
};
export const AftPot = {
    change(path) {
        let real = path.split('#')[0];
        let past = (sessionStorage.getItem(PotKey.NOW) || '').split('#')[0];
        if (real != past) {
            sessionStorage.setItem(PotKey.PAST, past);
            sessionStorage.setItem(PotKey.NOW, real);
        }
    },
    past() {
        return sessionStorage.getItem(PotKey.PAST) || '';
    }
};
//# sourceMappingURL=aft-navigator.js.map