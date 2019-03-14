window.onhashchange = () => {
    const pageName = window.location.hash.substr(1);
    loadPage(pageName);
};

loadPage(window.location.hash.substr(1) || 'edit');

function loadPage(pageName) {
    fetch(`views/${pageName}.html`, {cache: "no-cache"})
        .then(res => res.text())
        .then(res => {
            document.getElementById('inner-page').innerHTML = res;
            apply(document.getElementById('app'), state);
        })
}
