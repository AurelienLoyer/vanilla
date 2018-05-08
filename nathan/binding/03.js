var App = (
  function (app, state) {
    const bindPattern = "z-bind:";
    const regex = /^\z-bind:/;
    const stateElements = {};
    const _data = {};

    function bind() {
      const elements = app.querySelectorAll("*");

      elements.forEach(function (element) {


        // NodeList collection
        Object.values(element.attributes).forEach((attribute) => {
          // if attribute match pattern and value is specified

          if (regex.test(attribute.localName) && attribute.specified) {
            let attributeToUpdate = extractAttribute(element, attribute.localName);
            let stateKey = attribute.value;
            const stateValue = state[stateKey];

            // create setter and getter on local _data state to update element
            const attributeHandler = {
              get: () => {
                return _data[stateKey]
              },
              set: (val) => {
                element.setAttribute(attributeToUpdate, val)
                _data[stateKey] = val;
              }
            };

            // add setter and getter to the state
            Object.defineProperty(state, stateKey, attributeHandler)

            // init the local _data state
            state[stateKey] = stateValue;
          }
        });
      });
    };

    function extractAttribute(element, attributeName) {
      element.removeAttribute(attributeName);
      return attributeName.replace(bindPattern, "");
    };

    return {
      bind
    }
  })
const root = document.querySelector(".app");


const state = {
  title: "Test deqsdqsd titre",
  firstname: "Auqsdrélien",
  lastname: "Loyqsder",
  job: "Miaouuqsdu",
  height: "100px",
  picture: "https://i.ytimg.com/vi/wT7xL5oq1Jg/hqdefault.jpg"
}

document.addEventListener("DOMContentLoaded", function (event) {

  const myapp = new App(root, state).bind();
})