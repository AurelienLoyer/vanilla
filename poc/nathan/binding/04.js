function init(root, data) {
    const flatChildren = getFlatChildren(root);

    flatChildren.forEach((el) => {
            initBinding(el, data)
        }
    );
}


function getFlatChildren(root) {
    return root.querySelectorAll("*");
}


function initBinding(el, data) {
    const attributes = getBindAttributesValues(el);

    // NodeList collection
    attributes.forEach((attribute) => {
        const localName = attribute.localName;                      // z-bind:title
        let attributeName = extractAttribute(el, localName);        // title
        let stateKey = attribute.value;                             // firstname
        const stateValue = state[stateKey];                         // "aurelien"

        // firstname => update el => title = "aurelien"
        /*
        - create observer
        - notify listeners (elements)
            - create "Element()" ??
        - update el on a dedicated attribute
         */
    })

}

function getBindAttributesValues(element) {
    const retval = [];
    const regex = /^\z-bind:/;

    Object.values(element.attributes).forEach((attribute) => {
        if (regex.test(attribute.localName) && attribute.specified) {
            retval.push(attribute);
        }
    })

    return retval;
}


function extractAttribute(element, attributeName) {
    const bindPattern = "z-bind:";

    element.removeAttribute(attributeName);
    return attributeName.replace(bindPattern, "");
};