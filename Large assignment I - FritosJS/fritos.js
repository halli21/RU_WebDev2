


class FritosElement {
    constructor(nodes) {
        this.nodes = nodes;
    }


    setBackgroundColor(color) {
        this.nodes.forEach(node => node.style.backgroundColor = color);
        return this;
    }

    setColor(color) {
        this.nodes.forEach(node => node.style.color = color);
        return this;
    }

 

    parent(selector) {
        let parents = [];
        this.nodes.forEach(node => {
            if (node.parentElement && node.parentElement.matches(selector)) {
                parents.push(node.parentElement);
            }
        });
        return new FritosElement(parents);
    }

}

function fritos(selector) {
    return new FritosElement(document.querySelectorAll(selector));
}


