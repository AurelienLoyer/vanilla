var App = function(app, state) {
  const regex = /{{2}(.*?)\}{2}/gis;
  const stateElements = {};

  function bind() {
    const elements = app.querySelectorAll("*");

    elements.forEach(element => {
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
            fullMatch
          });
        }

        Object.keys(stateElements).forEach(key => {
          stateElements[key].forEach(el => {
            updateNode(el.node, el.fullMatch, key);
          });
        });
      });
    });
  }

  function updateNode(node, fullMatch, key) {
    node.nodeValue = node.nodeValue.replace(fullMatch, state[key]);
  }

  return {
    bind
  };
};

const state = {
  firstname: "Aurélien",
  lastname: "Loyer",
  job: "Zenika"
};

const root = document.querySelector(".app");
const myapp = new App(root, state).bind();
