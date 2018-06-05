class Router {
  constructor(routes, routerView) {
    this.routes = routes;
    this.routerView = routerView;
    window.onhashchange = this.hashChanged.bind(this);
    this.hashChanged();
  }

  async hashChanged(ev) {
    if (window.location.hash.length > 0) {
      const pageName = window.location.hash.substr(1);
      this.show(pageName);
    } else if (this.routes["404"]) {
      this.show("404");
    }
  }

  async show(pageName) {
    const page = this.routes[pageName] ||  this.routes['404'];
    await page.load();
    this.routerView.innerHTML = "";
    page.show(this.routerView);
  }
}
