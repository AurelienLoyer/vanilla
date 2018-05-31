const handler = {
    apply: (target, that, args) => {
        console.log("apply: ", target, that, args);
    },
    get: (target, attribute, proxy) => {
        console.log("get: ", target, attribute, proxy);
        return this._data[attribute];
    },
    set: (target, attribute, value, proxy) => {
        // console.log("set: ", target, attribute, value, proxy);
        console.log("set: ", target);
        console.log("set: ", attribute);
        console.log("set: ", value);
        console.log("set: ", proxy);
        this._data[attribute] = value;
        updateComponent(attribute, value);
    }
};

function bind(data, app) {
    this._data = data
    // this.updateComponent = updateComponent;
    initObserver(app, data)
    return new Proxy(data, handler)
}

function updateComponent(attribute, value) {
    const observers = attributesObservers[attribute];
    if (observers) {
        observers.forEach((observer) => {
            observer.element.setAttribute(observer.attribute, value);
        })
    }
}

let attributesObservers = {}

function initObserver(app, state) {
    let flatChildren = app.querySelectorAll('*');
    const regex = /^\z-bind:/;

    flatChildren.forEach((child) => {
        Object.values(child.attributes).forEach((fullAttribute) => {
            if (regex.test(fullAttribute.localName) && fullAttribute.specified) {
                let attribute = extractAttribute(child, fullAttribute.localName);
                if (state[fullAttribute.value]) {
                    let observers = attributesObservers[fullAttribute.value]
                    if (!observers) {
                        observers = [];
                    }

                    observers.push({ element: child, attribute })
                    attributesObservers[fullAttribute.value] = observers;
                    child.setAttribute(attribute, state[fullAttribute.value]);
                } else {
                    console.log(`Attribute ${fullAttribute.value} not existing in state`);
                }
            }
        })
    })
}

function extractAttribute(element, attributeName) {
    const bindPattern = "z-bind:";
    element.removeAttribute(attributeName);
    return attributeName.replace(bindPattern, "");
}
