class Page {
    constructor(url) {
      this.url = 'views/' + url;
    }
  
    load() {
      return fetch(this.url)
        .then(res => res.text())
        .then(res => this.html = res);
    }  
  
    show(el) {
      el.innerHTML = this.html;
    }
  }
  