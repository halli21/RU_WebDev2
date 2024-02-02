



class FritosObject {
    constructor(items) {
        this.items = items;
    }
}





window.fritos = function(selectors) {
    const items = document.querySelectorAll(selectors);
    return new FritosObject(items);
};