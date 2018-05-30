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
    stateElements[key].forEach(toto => {
      updateNode(toto.node, toto.initialValue);
    });
  }
};

function bind(data, app) {
  this._data = data;
  initObserver(app, data);
  return new Proxy(data, handler);
}

function updateNode(node, template) {
  const toRename = extractMatchFromString(template);
  toRename.forEach(el => {
    template = template.replace(el.fullMatch, this._data[el.stateKey])
    node.nodeValue = template;
  });
}

function extractMatchFromString(string) {
  let m;
  let matchs = [];
  while ((m = regex.exec(string)) !== null) {

    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
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

function addToStateElements(match, childnode) {
  if (!Array.isArray(stateElements[match.stateKey]))
        stateElements[match.stateKey] = [];

  stateElements[match.stateKey].push({
    node: childnode,
    initialValue: childnode.nodeValue,
  });
}

function initObserver(app, state) {
  const flatChildren = app.querySelectorAll("*");

  flatChildren.forEach(element => {

    element.childNodes.forEach(childnode => {

      const toRename = extractMatchFromString(childnode.nodeValue);
      
      toRename.forEach(el => addToStateElements(el, childnode))
      toRename.forEach(el => updateNode(childnode, childnode.nodeValue))
        
    });
  });
}
