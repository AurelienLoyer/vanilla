window.onhashchange = () => {
    const pageName = window.location.hash.substr(1);
    loadPage(pageName);
};

function loadPage(pageName) {
    fetch(`views/${pageName}.html`, {cache: "no-cache"})
        .then(res => res.text())
        .then(res => {
            console.log(res);
            document.getElementById('inner-page').innerHTML = res;
            bind(document.getElementById('app'), state);
        })
}
