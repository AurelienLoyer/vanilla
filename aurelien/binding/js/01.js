class app {
  constructor(app, state) {
    this.app = app;
    this.state = state;
  }

  bind() {
    const elements = this.app.querySelectorAll("[data-value]");
    elements.forEach(element => {
      let key = element.getAttribute("data-value");
      let value = state[key];
      this.updateElement(element, value);
      // and define set for next object update
      Object.defineProperty(this.state, key, {
        set: newValue => {
          this.updateElement(element, newValue);
        }
      });
    });
  }

  updateElement(element, value) {
    element.innerText = value;
  }
}

const state = {
  title: "Test de titre",
  firstname: "Aurélien",
  lastname: "Loyer",
  job: "Zenika",
  picture: "http://s2.dmcdn.net/O17Zy/1280x720-Hgy.jpg"
};

const root = document.querySelector(".app");
const myapp = new app(root, state).bind();
