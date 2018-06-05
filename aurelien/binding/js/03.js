const regex = /{{2}(.*?)\}{2}/gis;
const attributesObservers = {};
const stateElements = {};

const handler = {
  apply: (target, that, args) => {},
  get: (target, attribute, proxy) => {
    return this._data[attribute];
  },
  set: (target, key, value, proxy) => {
    this._data[key] = value;
    stateElements[key].forEach(el => {
      updateNode(el.node, el.initialValue);
    });
  }
};

function bind(data, app) {
  this._data = data;
  initObserver(app, data);
  return new Proxy(data, handler);
}

function updateNode(node, template) {
  const elementsToBind = extractMatchFromString(template);
  elementsToBind.forEach(el => {
    template = template.replace(
      el.fullMatch,
      eval("this._data." + el.stateKey)
    );
    node.nodeValue = template;
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

function addToStateElements(match, childnode) {
  if (!Array.isArray(stateElements[match.stateKey]))
    stateElements[match.stateKey] = [];

  stateElements[match.stateKey].push({
    node: childnode,
    initialValue: childnode.nodeValue
  });
}

function initObserver(app, state) {
  const flatChildren = app.querySelectorAll("*");

  flatChildren.forEach(element => {
    element.childNodes.forEach(childnode => {
      const elementsToBind = extractMatchFromString(childnode.nodeValue);

      elementsToBind.forEach(el => addToStateElements(el, childnode));
      elementsToBind.forEach(el => updateNode(childnode, childnode.nodeValue));
    });
  });
}
