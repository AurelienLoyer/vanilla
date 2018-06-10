const bracketRegex = /{{2}(.*?)\}{2}/gi;
const templatesByState = {};

function bindState(element, state) {
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
    forEachTextNode(element, bindTemplates);
}

const handler = {
    get: (target, key) => {
        return this._state[key];
    },
    set: (target, key, value) => {
        this._state[key] = value;
        updateTemplates(key);
    }
};

function forEachTextNode(element, doStuffOnTextNode) {
    element.childNodes.forEach(child => {
        if (child instanceof Text) {
            doStuffOnTextNode(child);
        }
    });
}

function bindTemplates(child) {
    const extractedStrings = extractTemplatesFromString(child.nodeValue);
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
    const elementsToBind = extractTemplatesFromString(template);
    elementsToBind.forEach(el => {
        template = template.replace(el.fullMatch, eval('this._state.' + el.stateKey))
        node.nodeValue = template;
    });
}

function addToTemplatesByState(match, childNode) {
    if (!Array.isArray(templatesByState[match.stateKey])) {
        templatesByState[match.stateKey] = [];
    }

    templatesByState[match.stateKey].push({
        node: childNode,
        initialValue: childNode.nodeValue,
    });
}


function extractTemplatesFromString(string) {
    let template;
    let templates = [];

    do {
        template = bracketRegex.exec(string);
        if (template) {
            templates.push({
                fullMatch: template[0],
                stateKey: template[1].trim()
            });
        }
    } while (template);

    return templates;
}
