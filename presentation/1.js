function bind(app, state) {
    const bindPattern = 'z-bind:';
    const bindSugarPattern = ':';
    const attributeRegex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);
    const flatChildren = app.querySelectorAll('*');
    flatChildren.forEach((element) => {
        
        Object.values(element.attributes).forEach((attribute) => {
            console.log(attribute.localName, ':', attribute.specified)
            if (attributeRegex.test(attribute.localName) && attribute.specified) {
                const attributeName = attribute.localName.replace(attributeRegex, '')
                element.setAttribute(attributeName, state[attribute.value]);
            }
        })
        
    });
}
