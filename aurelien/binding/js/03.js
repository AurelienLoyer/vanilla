const handler = {
  apply: (target, that, args) => {},
  get: (target, attribute, proxy) => {
    return this._data[attribute];
  },
  set: (target, key, value, proxy) => {
    this._data[key] = value;
    stateElements[key].forEach(toto => {
        console.log(toto)
        updateNode(toto.node, toto.fullMatch, key);
    })
  }
};

function bind(data, app) {
    this._data = data;
    initObserver(app, data);
    return new Proxy(data, handler);
}

function updateNode(node, fullMatch, key) {
    console.log(this._data[key])
    node.nodeValue = node.nodeValue.replace(fullMatch, this._data[key]);
}

/*function updateNode(attribute, value) {
  const observers = attributesObservers[attribute];
  if (observers) {
    observers.forEach(observer => {
      observer.element.setAttribute(observer.attribute, value);
    });
  }
}*/

const attributesObservers = {};
const stateElements = {};

function initObserver(app, state) {
  const flatChildren = app.querySelectorAll("*");
  const regex = /{{2}(.*?)\}{2}/gis;

  flatChildren.forEach(element => {
    // NodeList collection
    element.childNodes.forEach(childnode => {
      let m;

      while ((m = regex.exec(childnode.nodeValue)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        let fullMatch;
        let stateKey;

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
          if (groupIndex === 0) {
            fullMatch = match;
          } else {
            stateKey = match.trim();
          }
        });

        if (!Array.isArray(stateElements[stateKey]))
          stateElements[stateKey] = [];

        stateElements[stateKey].push({
          node: childnode,
          initialValue: childnode.nodeValue,
          fullMatch
        });
      }

      // once all node find and regex extract i update all node by key

      Object.keys(stateElements).forEach(key => {
        stateElements[key].forEach(el => {
          updateNode(el.node, el.fullMatch, key);
        });
      });
    });
  });
}
