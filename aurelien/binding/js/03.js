class app {
  constructor(app, state) {
    this.app = app;
    this.state = state;
    this.bindPattern = "z-bind:";
    this.regex = /^\z-bind:/;
    this.stateElements = {};
  }

  bind() {
    const elements = this.app.querySelectorAll("*");

    elements.forEach(element => {
      // NodeList collection
      Object.values(element.attributes).map(attribute => {
        // if attribute match pattern and value is specified

        if (this.regex.test(attribute.localName) && attribute.specified) {
          let attributeToUpdate = this.extractAttribute(attribute.localName);
          let stateKey = attribute.value;

          element.removeAttribute(attribute.localName);

          if (!Array.isArray(this.stateElements[stateKey]))
            this.stateElements[stateKey] = [];

          this.stateElements[stateKey].push(element);

          this.updateElementsAttribute(
            this.stateElements[stateKey],
            attributeToUpdate,
            this.state[stateKey]
          );

          // and define set for next object update
          Object.defineProperty(this.state, stateKey, {
            set: newValue => {
              this.updateElementsAttribute(
                this.stateElements[stateKey],
                attributeToUpdate,
                newValue
              );
            }
          });
        }
      });
    });
  }

  extractAttribute(attributeName) {
    return attributeName.replace(this.bindPattern, "");
  }

  updateElementsAttribute(elements, attributeToUpdate, value) {
    elements.forEach(element => element.setAttribute(attributeToUpdate, value));
  }
}

const state = {
  title: "Test de titre",
  firstname: "Aurélien",
  lastname: "Loyer",
  job: "Miaouuu",
  height: "100px",
  picture: "https://i.ytimg.com/vi/wT7xL5oq1Jg/hqdefault.jpg"
};

const root = document.querySelector(".app");
const myapp = new app(root, state).bind();
