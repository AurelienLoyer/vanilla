const bindPattern = "z-bind:";
const bindSugarPattern = ":";
const attributeRegex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);
let attributesObservers = {}
const templatingRegex = /{{2}(.*?)\}{2}/gi;
const stateElements = {};


function bindData(element, data) {
    this._data = data;

    forEachChildren(app, bindElement, data)

    return new Proxy(data, handler);
}


function forEachChildren(app, doStuffOnChildren, ...args) {
    let flatChildren = app.querySelectorAll('*');
    flatChildren.forEach((child) => {
        doStuffOnChildren(child, ...args);
    });
}

function bindElement(element, state) {
    forEachAttribute(element, bindAttribute, state);
    bindTemplates(element);
}

const handler = {
    get: (target, key) => {
        return this._data[key];
    },
    set: (target, key, value) => {
        this._data[key] = value;
        updateAttributes(key, value);
        stateElements[key].forEach(el => {
            updateTemplate(el.node, el.initialValue);
        });
    }
};

/**
 * Templating
 */
function bindTemplates(parentElement) {
    parentElement.childNodes.forEach(child => {
        const extractedStrings = extractMatchFromString(child.nodeValue);
        extractedStrings.forEach(stringToInterpol => {
            addToStateElements(stringToInterpol, child)
            updateTemplate(child, child.nodeValue)
        })
    });
}

function addToStateElements(match, childnode) {
    if (!Array.isArray(stateElements[match.stateKey]))
        stateElements[match.stateKey] = [];

    stateElements[match.stateKey].push({
        node: childnode,
        initialValue: childnode.nodeValue,
    });
}

function updateTemplate(node, template) {
    const elementsToBind = extractMatchFromString(template);
    elementsToBind.forEach(el => {
        template = template.replace(el.fullMatch, this._data[el.stateKey])
        node.nodeValue = template;
    });
}


function extractMatchFromString(string) {
    let m;
    let matchs = [];
    while ((m = templatingRegex.exec(string)) !== null) {

        if (m.index === templatingRegex.lastIndex) {
            templatingRegex.lastIndex++;
        }

        let fullMatch;
        let stateKey;

        m.forEach((match, groupIndex) => {
            if (groupIndex === 0) {
                fullMatch = match;
            } else {
                stateKey = match.trim();
            }
        });

        matchs.push({
            fullMatch,
            stateKey
        })
    }

    return matchs;
}

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
    if (state[fullAttribute.value]) {

        let observers = attributesObservers[fullAttribute.value]
        observers = observers ? observers : []
        observers.push({ element, attribute })
        attributesObservers[fullAttribute.value] = observers;

        element.setAttribute(attribute, state[fullAttribute.value]);
    } else {
        console.log(`Attribute ${fullAttribute.value} not existing in state`);
    }
}