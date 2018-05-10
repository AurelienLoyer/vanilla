var App = function(app, state) {
  const _state = Object.assign({}, state);
  const stateElements = {};
  const bindPattern = "z-bind:";
  const bindSugarPattern = ":";
  const regex = new RegExp(`\^${bindPattern}|${bindSugarPattern}`);

  function bind() {
    const elements = app.querySelectorAll("*");

    elements.forEach(element => {
      // NodeList collection
      Object.values(element.attributes).map(attribute => {
        // if attribute match pattern and value is specified

        if (regex.test(attribute.localName) && attribute.specified) {
          const attributeToUpdate = extractAttribute(attribute.localName);
          const stateKey = attribute.value;
          const stateValue = state[stateKey];

          element.removeAttribute(attribute.localName);

          if (!Array.isArray(stateElements[stateKey]))
            stateElements[stateKey] = [];

          stateElements[stateKey].push(element);

          // create setter and getter on local _data state to update element
          const attributeHandler = {
            get: () => {
              return _state[stateKey];
            },
            set: val => {
              elements.forEach(element =>
                element.setAttribute(attributeToUpdate, val)
              );
              _state[stateKey] = val;
            }
          };

          // add setter and getter to the state
          Object.defineProperty(state, stateKey, attributeHandler);

          // init the local _data state
          state[stateKey] = stateValue;
        }
      });
    });
  }

  function extractAttribute(attributeName) {
    attributeName = attributeName.replace(bindPattern, "");
    attributeName = attributeName.replace(bindSugarPattern, "");
    return attributeName;
  }

  return {
    bind
  };
};

const state = {
  title: "Test de titre",
  firstname: "Aurélien",
  lastname: "Loyer",
  job: "Miaouuu",
  height: "100px",
  picture: "https://i.ytimg.com/vi/wT7xL5oq1Jg/hqdefault.jpg"
};

const root = document.querySelector(".app");

document.addEventListener("DOMContentLoaded", function(event) {
  const myapp = new App(root, state).bind();
});
