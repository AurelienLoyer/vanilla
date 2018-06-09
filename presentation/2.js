const bindPattern = 'z-bind:';
const bindSugarPattern = ':';
const attributeRegex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);
const attributesByState = {};

const templatingRegex = /{{2}(.*?)\}{2}/gi;   // TODO : ADD
const templatesByState = {};                  // TODO : ADD

function bindData(element, state) {
    this._state = state;
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
        return this._state[key];
    },
    set: (target, key, value) => {
        this._state[key] = value;
        updateAttributes(key);
        updateTemplates(key);                  // TODO : ADD
    }
};

/**
 * template // TODO : ADD
 */

function forEachTextNode(element, doStuffOnTextNode) {
    element.childNodes.forEach(child => {
        if (child instanceof Text) {
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
        template = template.replace(el.fullMatch, eval('this._state.' + el.stateKey))
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
    let matches = [];

    do {
        m = templatingRegex.exec(string);
        if (m) {
            matches.push({
                fullMatch: m[0],
                stateKey: m[1]
            });
        }
    } while (m);

    return matches;
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

function bindAttribute(element, attributeEl) {
    let attributeName = extractAttribute(element, attributeEl.localName);

    if (!Array.isArray(attributesByState[attributeEl.value])) {
        attributesByState[attributeEl.value] = [];
    }
    attributesByState[attributeEl.value].push({ element, attributeName })

    updateAttribute(element, attributeName, attributeEl.value);
}

function extractAttribute(element, localName) {
    element.removeAttribute(localName)
    return localName.replace(bindPattern, '');
}

function updateAttributes(stateProperty) {
    const attributes = attributesByState[stateProperty];

    if (attributes) {
        attributes.forEach((attribute) => {
            updateAttribute(attribute.element, attribute.attributeName, stateProperty);
        })
    }
}

function updateAttribute(element, attributeName, dataProperty) {
    element.setAttribute(attributeName, this._state[dataProperty]);
}