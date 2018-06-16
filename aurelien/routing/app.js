function bind(app, state) {
    const bindPattern = 'z-bind:';
    const bindSugarPattern = ':';
    const attributeRegex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);
    const flatChildren = app.querySelectorAll('*');
    flatChildren.forEach((element) => {
        Object.values(element.attributes).forEach((attribute) => {
            if (attributeRegex.test(attribute.localName) && attribute.specified) {
                const attributeName = attribute.localName.replace(attributeRegex, '')
                element.setAttribute(attributeName, state[attribute.value]);
            }
        })

        element.childNodes.forEach(child => {
            if (child instanceof Text) {
                if(!child.initialValue) {
                    child.initialValue = child.nodeValue;
                }
                let text = child.initialValue;
                const brackets = extractBrackets(text);
                brackets.forEach(bracket => {
                    text = text.replace(bracket.fullMatch, state[bracket.stateKey]);
                });
                child.nodeValue = text;
            }
        })
    });
}


function extractBrackets(text) {
    const bracketRegex = /{{2}(.*?)\}{2}/gi;

    let template;
    const templates = [];

    do {
        template = bracketRegex.exec(text);
        if (template) {
            templates.push({
                fullMatch: template[0],
                stateKey: template[1].trim()
            });
        }
    } while (template);

    return templates;
}
