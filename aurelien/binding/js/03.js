class app {
  constructor(app, state) {
    this.app = app;
    this.state = state;
  }

  bind() {
    const elements = this.app.querySelectorAll("*");

    elements.forEach(element => {
      // NodeList collection
      element.childNodes.forEach(childnode => {});
    });
  }
}

var toto = [];

const state = {
  firstname: "Aurélien",
  lastname: "Loyer",
  job: "Zenika"
};

const root = document.querySelector(".app");
const myapp = new app(root, state).bind();
