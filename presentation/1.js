const bindPattern = "z-bind:";
const bindSugarPattern = ":";
const attributeRegex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);
let attributesObservers = {};


function bindData(element, data) {
    this._data = data;

    forEachChildren(app, bindElement, data)

    return new Proxy(data, handler);
}

function bindElement(element, state) {
    forEachAttribute(element, bindAttribute, state);
}

function forEachChildren(app, doStuffOnChildren, ...args) {
    let flatChildren = app.querySelectorAll('*');
    flatChildren.forEach((child) => {
        doStuffOnChildren(child, ...args);
    });
}

const handler = {
    get: (target, key) => {
        return this._data[key];
    },
    set: (target, key, value) => {
        this._data[key] = value;
        updateAttributes(key, value);
    }
};


/**
 * Attributes
 */
function forEachAttribute(element, doStuffOnAttribute, ...args) {
    Object.values(element.attributes).forEach((fullAttribute) => {
        if (attributeRegex.test(fullAttribute.localName) && fullAttribute.specified) {
            doStuffOnAttribute(element, fullAttribute, ...args);
        }
    });
}

function extractAttribute(element, attributeName) {
    element.removeAttribute(attributeName);
    return attributeName.replace(bindPattern, '');
}

function updateAttributes(attribute, value) {
    const observers = attributesObservers[attribute];
    if (observers) {
        observers.forEach((observer) => {
            observer.element.setAttribute(observer.attribute, value);
        })
    }
}

function bindAttribute(element, fullAttribute, state) {
    let attribute = extractAttribute(element, fullAttribute.localName);

        let observers = attributesObservers[fullAttribute.value]
        observers = observers ? observers : []
        observers.push({ element, attribute })
        attributesObservers[fullAttribute.value] = observers;

        element.setAttribute(attribute, state[fullAttribute.value]);
}