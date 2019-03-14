function apply(app, state) {
    
    const flatChildren = app.querySelectorAll('*');
    const bindPattern = 'z-bind:';
    const bindSugarPattern = ':';
    const attributeRegex = new RegExp(`${bindPattern}|${bindSugarPattern}`);

    flatChildren.forEach(element => {
        
        Object.values(element.attributes).forEach((attribute) => {
            if(attributeRegex.test(attribute.localName)) {
                const attributeName = attribute.localName.replace(attributeRegex, '')
                element.setAttribute(attributeName, state[attribute.value]);
            }
        });

    });

}