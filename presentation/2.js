const bindPattern = "z-bind:";
const bindSugarPattern = ":";
const attributeRegex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);
const attributesByState = {};

const templatingRegex = /{{2}(.*?)\}{2}/gi;   // TODO : ADD
const templatesByState = {};                  // TODO : ADD

function bindData(element, state) {
    this._data = state;
    forEachChildren(app, bindElement);
    return new Proxy(state, handler);
}

function forEachChildren(app, doStuffOnChildren) {
    let flatChildren = app.querySelectorAll('*');
    flatChildren.forEach((child) => {
        doStuffOnChildren(child);
    });
}

function bindElement(element) {
    forEachAttribute(element, bindAttribute);
    forEachTextNode(element, bindTemplates);  // TODO : ADD
}

const handler = {
    get: (target, key) => {
        return this._data[key];
    },
    set: (target, key, value) => {
        this._data[key] = value;
        updateAttributes(key, value);
        updateTemplates(key);                  // TODO : ADD
    }
};

/**
 * template // TODO : ADD
 */

function forEachTextNode(element, doStuffOnTextNode) {
    element.childNodes.forEach(child => {
        if (child.constructor.name === 'Text') {
            doStuffOnTextNode(child);
        }
    });
}

function bindTemplates(child) {
    const extractedStrings = extractMatchFromString(child.nodeValue);
    extractedStrings.forEach(stringToInterpol => {
        addToTemplatesByState(stringToInterpol, child);
    });
    updateTemplate(child, child.nodeValue);
}


function updateTemplates(key) {
    templatesByState[key].forEach(el => {
        updateTemplate(el.node, el.initialValue);
    });
}

function updateTemplate(node, template) {
    const elementsToBind = extractMatchFromString(template);
    elementsToBind.forEach(el => {
        template = template.replace(el.fullMatch, eval("this._data." + el.stateKey))
        node.nodeValue = template;
    });
}

function addToTemplatesByState(match, childNode) {
    if (!Array.isArray(templatesByState[match.stateKey]))
        templatesByState[match.stateKey] = [];

    templatesByState[match.stateKey].push({
        node: childNode,
        initialValue: childNode.nodeValue,
    });
}


function extractMatchFromString(string) {
    let m;
    let matchs = [];

    do {
        m = regex.exec(string);
        if (m) {
            matchs.push({
                fullMatch: m[0],
                stateKey: m[1]
            });
        }
    } while (m);

    return matchs;
}
  
/**
 * Attributes
 */
function forEachAttribute(element, doStuffOnAttribute) {
    Object.values(element.attributes).forEach((attribute) => {
        if (attributeRegex.test(attribute.localName) && attribute.specified) {
            doStuffOnAttribute(element, attribute)
        }
    })
}

function bindAttribute(element, attribute) {
    let attributeName = extractAttribute(element, attribute.localName);

    if (!Array.isArray(attributesByState[attribute.value])) {
        attributesByState[attribute.value] = [];
    }
    attributesByState[attribute.value].push({element, attribute: attributeName})

    element.setAttribute(attributeName, this._data[attribute.value]);
}

function extractAttribute(element, localName) {
    element.removeAttribute(localName)
    return localName.replace(bindPattern, '');
}

function updateAttributes(attribute, value) {
    const observers = attributesByState[attribute];

    if (observers) {
        observers.forEach((observer) => {
            observer.element.setAttribute(observer.attribute, value);
        })
    }
}
