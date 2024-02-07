/**
 * url 관련유틸
 */
export const NetUtils = {
    queryString: (key) => {
        if (location.href.indexOf('?') < 0)
            return '';
        let query = location.href.split("?")[1];
        return query
            .split("&")
            .filter(str => str.indexOf("=") > -1)
            .filter(str => str.split("=")[0] === key)
            .map(str => str.split("=")[1]).join("");
    },
    hasQueryString: (key) => {
        if (!key)
            return false;
        if (NetUtils.queryString(key))
            return true;
        return false;
    }
};
/**
 * 날짜 관련 유틸리티
 */
export const DateUtils = {
    format: (date, format) => {
        const weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let hours = 0;
        if (!date.valueOf())
            return "";
        return format.replace(/(yyyy|yy|MM|dd|W|hh|mi|ss|ms|a\/p)/gi, function ($1) {
            switch ($1) {
                case "yyyy": return date.getFullYear().toString();
                case "yy": return (date.getFullYear().toString().substr(2, 4));
                case "MM": return StringUtils.lpad((date.getMonth() + 1).toString(), "0", 2);
                case "mm": return StringUtils.lpad((date.getMonth() + 1).toString(), "0", 2);
                case "dd": return StringUtils.lpad(date.getDate().toString(), "0", 2);
                case "W": return weekName[date.getDay()];
                case "HH": return StringUtils.lpad(date.getHours().toString(), "0", 2);
                case "hh": return StringUtils.lpad(((hours = date.getHours() % 12) ? hours : 12).toString(), "0", 2);
                case "mi": return StringUtils.lpad(date.getMinutes().toString(), "0", 2);
                case "ss": return StringUtils.lpad(date.getSeconds().toString(), "0", 2);
                case "ms": return date.getMilliseconds() + '';
                case "a/p": return date.getHours() < 12 ? "오전" : "오후";
                default: return $1;
            }
        });
    },
    diffDay: (endDt, stDt) => {
        var diff = endDt.getTime() - stDt.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
    addDay: (date, day) => {
        date.setDate(date.getDate() + day);
        return date;
    }
};
/**
 * 문자관련 유틸
 */
export const StringUtils = {
    lpad: (str, appendStr, size) => {
        let s = '';
        for (let i = 0; i < size - str.length; i++) {
            s += appendStr;
        }
        return s + "" + str;
    },
    rpad: (str, appendStr, size) => {
        let s = '';
        for (let i = 0; i < size - str.length; i++) {
            s += appendStr;
        }
        return str + '' + s;
    }
};
/**
 * 숫자관련 유틸
 */
export const NumberUtils = {
    /**
     * n이 Nan 대체 r
     * @param n
     * @param r
     */
    ifNaN(n, r) {
        n = Number.isNaN(n) ? r : n;
    }
};
/**
 * 돔생성
 * @param node
 * @constructor
 */
export const MakeFor = (node = 'div') => {
    const ele = document.createElement(node);
    return {
        html: function (html) { return ele.innerHTML = html, this; },
        text: function (text) { return ele.innerText = text, this; },
        attr: function (key, value) { return ele.setAttribute(key, `${value || ''}`), this; },
        value: function (value) {
            return ele.value = `${value || ''}`, this;
        },
        cls: function (...cls) { return cls.filter(item => item && item != '').forEach(item => ele.classList.add(item)), this; },
        event: function (type, listener) {
            return ele.addEventListener(type, function (e) {
                return listener(e, ele);
            }), this;
        },
        element: ele
    };
};
/**
 * 돔 간편생성
 * @param props
 */
export const html = (...props) => {
    let _html = '';
    let _clickId = '';
    let _inputId = '';
    let _clickQue = window['_eventQue'] || {};
    let _inputQue = window['_inputQue'] || {};
    let _clickSeq = Object.keys(_clickQue).length;
    let _inputSeq = Object.keys(_inputQue).length;
    if (props.length > 1) {
        let main = props[0];
        props.forEach((p, idx) => {
            if (idx > 0) {
                let appendStr = main[idx - 1];
                _clickId = '';
                //if there's click event;
                if (appendStr.indexOf("onClick") > -1 || appendStr.indexOf("onclick") > -1) {
                    _clickId = `ck_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_clickSeq}`;
                    appendStr = appendStr.replace('onClick', 'event-id').replace('onclick', 'event-id');
                    appendStr += _clickId;
                    _clickSeq++;
                }
                if (appendStr.indexOf("onInput") > -1 || appendStr.indexOf("oninput") > -1) {
                    _inputId = `ip_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_inputSeq}`;
                    appendStr = appendStr.replace('onInput', 'event-id').replace('oninput', 'event-id');
                    appendStr += _inputId;
                    _inputSeq++;
                }
                if (Array.isArray(props[idx])) {
                    _html += appendStr;
                    props[idx].forEach((node) => {
                        if (typeof node === 'object' && typeof node['outerHTML'] !== 'undefined') {
                            _html += node.outerHTML;
                        }
                        else if (_clickId.length > 0 && typeof node === 'function') {
                            _clickQue[_clickId] = node;
                        }
                        else if (_inputId.length > 0 && typeof node === 'function') {
                            _inputQue[_inputId] = node;
                        }
                        else {
                            _html += node;
                        }
                    });
                }
                else {
                    if (props[idx] == null) {
                        _html += appendStr + '';
                    }
                    else if (typeof props[idx] === 'object' && typeof props[idx]['outerHTML'] !== 'undefined') {
                        _html += appendStr + props[idx].outerHTML;
                    }
                    else if (_clickId.length > 0 && typeof props[idx] === 'function') {
                        _html += appendStr;
                        _clickQue[_clickId] = props[idx];
                    }
                    else if (_inputId.length > 0 && typeof props[idx] === 'function') {
                        _html += appendStr;
                        _inputQue[_inputId] = props[idx];
                    }
                    else {
                        _html += appendStr + props[idx];
                    }
                }
            }
        });
        _html += main[main.length - 1];
    }
    else if (props.length == 1) {
        if (Array.isArray(props[0]) && props[0].length > 0) {
            _html = props[0][0];
        }
        else {
            _html = props[0];
        }
    }
    if (Object.keys(_clickQue).length > 0) {
        window['_eventQue'] = _clickQue;
    }
    if (Object.keys(_inputQue).length > 0) {
        window['_inputQue'] = _inputQue;
    }
    return MakeFor('div').html(_html).element.firstChild;
};
/**
 * 돔 간편생성
 * @param props
 */
export const htmls = (...props) => {
    let _html = '';
    let _clickId = '';
    let _inputId = '';
    let _clickQue = window['_eventQue'] || {};
    let _inputQue = window['_inputQue'] || {};
    let _clickSeq = Object.keys(_clickQue).length;
    let _inputSeq = Object.keys(_inputQue).length;
    if (props.length > 1) {
        let main = props[0];
        props.forEach((p, idx) => {
            if (idx > 0) {
                let appendStr = main[idx - 1];
                _clickId = '';
                //if there's click event;
                if (appendStr.indexOf("onClick") > -1 || appendStr.indexOf("onclick") > -1) {
                    _clickId = `ck_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_clickSeq}`;
                    appendStr = appendStr.replace('onClick', 'event-id').replace('onclick', 'event-id');
                    appendStr += _clickId;
                    _clickSeq++;
                }
                if (appendStr.indexOf("onInput") > -1 || appendStr.indexOf("oninput") > -1) {
                    _inputId = `ck_${DateUtils.format(new Date(), 'yyyyMMddHHmiss')}_${_inputSeq}`;
                    appendStr = appendStr.replace('onInput', 'event-id').replace('oninput', 'event-id');
                    appendStr += _inputId;
                    _inputSeq++;
                }
                if (Array.isArray(props[idx])) {
                    _html += appendStr;
                    props[idx].forEach((node) => {
                        if (typeof node === 'object' && typeof node['outerHTML'] !== 'undefined') {
                            _html += node.outerHTML;
                        }
                        else if (_clickId.length > 0 && typeof node === 'function') {
                            _clickQue[_clickId] = node;
                        }
                        else if (_inputId.length > 0 && typeof node === 'function') {
                            _inputQue[_inputId] = node;
                        }
                        else {
                            _html += node;
                        }
                    });
                }
                else {
                    if (props[idx] == null) {
                        _html += appendStr + '';
                    }
                    else if (typeof props[idx] === 'object' && typeof props[idx]['outerHTML'] !== 'undefined') {
                        _html += appendStr + props[idx].outerHTML;
                    }
                    else if (_clickId.length > 0 && typeof props[idx] === 'function') {
                        _html += appendStr;
                        _clickQue[_clickId] = props[idx];
                    }
                    else if (_inputId.length > 0 && typeof props[idx] === 'function') {
                        _html += appendStr;
                        _inputQue[_inputId] = props[idx];
                    }
                    else {
                        _html += appendStr + props[idx];
                    }
                }
            }
        });
        _html += main[main.length - 1];
    }
    else if (props.length == 1) {
        if (Array.isArray(props[0]) && props[0].length > 0) {
            _html = props[0][0];
        }
        else {
            _html = props[0];
        }
    }
    if (Object.keys(_clickQue).length > 0) {
        window['_eventQue'] = _clickQue;
    }
    if (Object.keys(_inputQue).length > 0) {
        //@ts-ignore
        window['_inputQue'] = _inputQue;
    }
    let parent = MakeFor('div').html(_html).element;
    for (let i = 0; i < parent.children.length; i++) {
        parent.children;
    }
    return parent.children;
};
/**
 * 벨리데이션 검사
 */
export const Validator = {
    email: (text) => {
        let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return regex.test(text);
    },
    password: (text = '') => {
        return /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/.test(text) && !(/\s/g.test(text));
    },
    isNull: (test = '') => {
        return (test || '').length == 0 || typeof test === 'undefined' || test == null;
    },
    hasNullData: (...values) => {
        return (values.filter(Validator.isNull).length > 0);
    }
};
/**
 * 버튼 사용체크
 */
export const Buttons = {
    activeToggle: (btn, active = false) => {
        if (btn) {
            if (active) {
                btn.removeAttribute('disabled');
                btn.classList.add('active');
            }
            else {
                btn.setAttribute('disabled', 'disabled');
                btn.classList.remove('active');
            }
        }
    }
};
/**
 * 인풋 엘리먼트 유틸
 */
export const InputBox = {
    pattern: (input, pattern) => {
        let regexp = new RegExp('[' + pattern + ']', 'ig');
        input.addEventListener('input', (e) => {
            input.value = input.value.replace(regexp, '');
        });
    },
    value: (input, value) => {
        if (input) {
            input.value = value;
        }
    }
};
/**
 * 텍스트 에어리어 유틸
 */
export const TextAreaBox = {
    value: (area, value) => {
        if (area) {
            area.value = value || '';
        }
    }
};
/**
 * 체크박스 엘리먼트 유틸
 */
export const CheckBox = {
    check(box, value) {
        if (typeof box !== 'undefined') {
            let inp = box;
            inp.checked = inp.value === value;
        }
    },
    list(boxes, values) {
        boxes.forEach(box => {
            if (typeof box !== 'undefined') {
                let inp = box;
                inp.checked = values.indexOf(inp.value) > -1;
            }
        });
    }
};
/**
 * 기본 엘리먼트 텍스트 설정
 */
export const ElementBox = {
    value: (box, value) => {
        if (box) {
            box.innerText = value || '';
        }
    }
};
//# sourceMappingURL=aft-utils.js.map