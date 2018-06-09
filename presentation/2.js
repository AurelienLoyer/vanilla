const bindPattern = "z-bind:";
const bindSugarPattern = ":";
const attributeRegex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);
const attributesByState = {};

const templatingRegex = /{{2}(.*?)\}{2}/gi;   // TODO : ADD
const stateElements = {};                     // TODO : ADD

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
        addToStateElements(stringToInterpol, child);
    });
    updateTemplate(child, child.nodeValue);
}


function updateTemplates(key) {
    stateElements[key].forEach(el => {
        updateTemplate(el.node, el.initialValue);
    });
}

function updateTemplate(node, template) {
    const elementsToBind = extractMatchFromString(template);
    elementsToBind.forEach(el => {
        template = template.replace(el.fullMatch, this._state[el.stateKey])
        node.nodeValue = template;
    });
}

function addToStateElements(match, childNode) {
    if (!Array.isArray(stateElements[match.stateKey]))
        stateElements[match.stateKey] = [];

    stateElements[match.stateKey].push({
        node: childNode,
        initialValue: childNode.nodeValue,
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
    attributesByState[attribute.value].push({ element, attributeName })

    updateAttribute(element, attributeName, attribute.value);
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