const r = new Router(
  {
    about: new Page("about.html"),
    home: new Page("home.html"),
    contact: new Page("contact.html"),
    404: new Page("404.html"),
  },
  document.querySelector("router-view")
);
