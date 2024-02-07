/**
 * aft dom init event
 * @param dom
 */
export const formInit = (form, container, data) => {
    form = {};
    container.querySelectorAll('[aft-id]')
        .forEach((item) => {
        let obj = item;
        let id = obj.getAttribute('aft-id') || '';
        if (id) {
            form[id] = {
                element: obj,
                value: function (value) {
                    if (typeof value !== 'undefined') {
                        this.element.value = value;
                        if (this.element.parentElement.classList.contains('validated'))
                            this.element.parentElement.classList.remove('validated');
                    }
                    if (this.element.type === 'checkbox' && !this.element.checked) {
                        return undefined;
                    }
                    return this.element.hasAttribute('aft-format') ? this.element.fvalue() : this.element.value;
                },
                oldValue: '',
                isInput: true
            };
            //set old value
            if (obj.nodeName === 'INPUT') {
                let type = obj.type;
                obj.addEventListener('keydown', () => {
                    form[id].oldValue = obj.value;
                });
                //data set
                if (data && data[id]) {
                    if (type === 'text') {
                        obj.value = data[id] || '';
                    }
                    else if (type === 'checkbox' && (data[id] === 'Y' || data[id] === 'true')) {
                        obj.checked = true;
                    }
                    else if (type === 'checkbox' && Array.isArray(data[id]) && data[id].length > 0) {
                        obj.checked = true;
                    }
                }
                //bind event
                if ((type === 'text' ||
                    type === 'password') && data) {
                    obj.addEventListener('input', () => {
                        data[id] = obj.value;
                    });
                }
                _elementBindingEvent(obj);
            }
        }
    });
    form.getJSON = () => {
        let obj = {};
        Object.keys(form)
            .filter(key => typeof form[key].value === 'function')
            .forEach(key => obj[key] = form[key].value());
        return JSON.stringify(obj);
    };
    form.getObject = () => {
        let obj = {};
        Object.keys(form)
            .filter(key => typeof form[key].value === 'function')
            .forEach(key => obj[key] = form[key].value());
        return obj;
    };
    form.setData = (data) => {
        if (typeof data !== 'undefined') {
            Object.keys(data).filter((k) => typeof form[k] !== 'undefined')
                .forEach((k) => form[k].value(data[k]));
        }
    };
    return form;
};
const _elementBindingEvent = (obj) => {
    if (obj.type === 'tel') {
        obj.addEventListener('keydown', () => {
            obj.value = obj.value.replace(/[^\d]/g, '');
        });
        obj.addEventListener('focusin', () => {
            obj.value = obj.value.replace(/-/gi, '');
        });
        obj.addEventListener('focusout', () => {
            obj.value = obj.value.replace(/^([0-9]{3})([0-9]{4})([0-9]{4})$/, '$1-$2-$3');
        });
    }
    if (obj.getAttribute('aft-uppercase')) {
        if (obj.getAttribute('aft-uppercase') === 'true') {
            obj.addEventListener('input', () => {
                obj.value = obj.value.toUpperCase();
            });
        }
    }
    if (obj.getAttribute('aft-pattern')) {
        let _pattern = obj.getAttribute('aft-pattern');
        let regexp = new RegExp('[' + _pattern + ']', 'ig');
        obj.addEventListener('input', () => {
            obj.value = obj.value.replace(regexp, '');
        });
    }
    if (obj.classList.contains('number') && obj.type === 'text') {
        obj.value = obj.value || '0';
        obj.addEventListener('focusout', () => {
            obj.value = String(Number(obj.value) || 0);
        });
    }
    if (obj.type === 'number') {
        obj.value = obj.value || '0';
        obj.addEventListener('keydown', () => {
            obj.value = obj.value.replace(/[^\d]/g, '');
        });
        obj.addEventListener('focusout', () => {
            obj.value = obj.value || '0';
        });
    }
};
/**
 * event listener event
 * @param container
 */
export const listener = (returnEvent, container) => {
    { //link event
        container.querySelectorAll('[aft-listener]')
            .forEach((node) => {
            const evt = node.getAttribute('aft-listener') || '';
            if (typeof returnEvent.listener !== 'undefined' && typeof returnEvent.listener[evt] === 'function')
                node.addEventListener('keydown', function (e) { returnEvent.listener[evt](node, e); });
        });
        container.querySelectorAll('[aft-change]')
            .forEach((node) => {
            const evt = node.getAttribute('aft-change') || '';
            if (typeof returnEvent.listener !== 'undefined' && typeof returnEvent.listener[evt] === 'function')
                node.addEventListener('change', function (e) { returnEvent.listener[evt](node, e); });
        });
        container.querySelectorAll('[aft-event]')
            .forEach((node) => {
            const evt = node.getAttribute('aft-event') || '';
            if (typeof returnEvent.event !== 'undefined' && typeof returnEvent.event[evt] === 'function')
                node.addEventListener('click', function (e) { returnEvent.event[evt](node, e); });
        });
        container.querySelectorAll('[aft-input]')
            .forEach((node) => {
            const evt = node.getAttribute('aft-input') || '';
            if (typeof returnEvent.listener !== 'undefined' && typeof returnEvent.listener[evt] === 'function')
                node.addEventListener('input', function (e) { returnEvent.listener[evt](node, e); });
        });
        container.querySelectorAll('[aft-drop]')
            .forEach((node) => {
            const evt = node.getAttribute('aft-drop') || '';
            if (typeof returnEvent.listener !== 'undefined' && typeof returnEvent.listener[evt] === 'function') {
                node.addEventListener('dragover', (e) => {
                    console.log('over');
                    return e.preventDefault(), false;
                });
                node.addEventListener('drop', function (e) {
                    console.log('come');
                    e.preventDefault();
                    let files = [];
                    if (e.dataTransfer.items) {
                        // Use DataTransferItemList interface to access the file(s)
                        [...e.dataTransfer.items].forEach((item, i) => {
                            // If dropped items aren't files, reject them
                            if (item.kind === "file") {
                                files.push(item.getAsFile());
                            }
                        });
                    }
                    else {
                        // Use DataTransfer interface to access the file(s)
                        [...e.dataTransfer.files].forEach((file, i) => {
                            files.push(file);
                        });
                    }
                    returnEvent.listener[evt](files, e);
                });
            }
        });
    }
};
//# sourceMappingURL=aft-dom-event.js.map