
class FritosObject {
    constructor(items) {
        this.items = Array.from(items);
    }

    parent(selector) {
        const parents = [];
        this.items.forEach(item => {
            let parent = item.parentElement;
            if (parent && (selector == null || parent.matches(selector))) {
                if (!parents.includes(parent)) {
                    parents.push(parent);
                }
            }
        });
        return new FritosObject(parents);
    }


    ancestor(selector) {
        const ancestors = [];
        this.items.forEach(item => {
            let element = item.parentElement;
            while (element) {
                if (!selector || element.matches(selector)) {
                    if (!ancestors.includes(element)) {
                        ancestors.push(element);
                    }
                }
                element = element.parentElement;
            }
        });
        return ancestors;
    }


    animate(cssProperties, options) {
        const kebabProperties = {};
        for (const property in cssProperties) {
            const kebabProperty = property.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(); // https://stackoverflow.com/questions/63116039/camelcase-to-kebab-case
            kebabProperties[kebabProperty] = cssProperties[property];
        } 

        const animationOptions = {
            duration: options.duration,
            delay: options.delay,
            easing: options.easing,
            iterations: options.iterationCount,
            fill: options.fillMode
        };

        this.items.forEach(item => {
            item.animate(kebabProperties, animationOptions);
        });

        return this;
    }


    find(selector) {
        if (!selector) return new FritosObject([]);

        const foundItems = [];
        this.items.forEach(item => {
            const children = item.querySelectorAll(selector);
            foundItems.push(...children);  //...
        });

        return new FritosObject(foundItems);
    }


    onEvent(eventType, eventFunction) {
        this.items.forEach(item => {
            item.addEventListener(eventType, eventFunction);
        });

        return this;
    }


    validation(validationProperties) {
        if (this.items.length === 0 || !(this.items[0] instanceof HTMLFormElement)) {
            console.error('Validation can only be used on HTMLFormElement with at least one item.');
            return null;
        }

        const form = this.items[0];
        let validationResult = {};

        for (const fieldName in validationProperties) {
            const formField = form.querySelector(`[name="${fieldName}"]`);

            if (formField) {
                validationProperties[fieldName].forEach(rule => {
                    const isValid = rule.valid(formField.value, form);
                    if (!isValid) {
                        validationResult[fieldName] = rule.message;
                    }
                });
            }
        }

        return validationResult;
    }


    hide() {
        this.items.forEach(item => {
            item.style.display = 'none';
        });

        return this; 
    }

    prune() {
        this.items.forEach(item => {
            const parent = item.parentNode;
            if (parent) {
                parent.parentNode.insertBefore(item, parent);
                parent.remove();
            }
        });
        return this;
    }

    raise(level = 1) {
        this.items.forEach(item => {
            for (let i = 0; i < level; i++) {
                const parent = item.parentNode;
                if (!parent || parent === document.body) {
                    break;
                }
                parent.parentNode.insertBefore(item, parent);
            }
        });
        return this;
    }

    attrs(attributeName, attributeValue) {
        this.items.forEach(item => {
            item.setAttribute(attributeName, attributeValue);
        });
        return this;
    }


    val(value) {
        if (value == null) {
            if (this.items.length > 0) {
                return this.items[0].value;
            }
            return null;
        } else {
            this.items.forEach(item => {
                item.value = value;
            });
            return this;
        }
    }
}


window.fritos = function(selectors) {
    const items = document.querySelectorAll(selectors);
    return new FritosObject(items);
};




fritos.remoteCall = function(url, options) {
    const { method, timeout = 45, headers, body, onSuccess, onError } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout * 1000); //https://dmitripavlutin.com/timeout-fetch-request/#:~:text=Timeout%20a%20fetch()%20request,-fetch()%20API&text=To%20stop%20a%20request%20at,also%20need%20an%20abort%20controller.&text=First%2C%20const%20%7B%20timeout%20%3D%208000,instance%20of%20the%20abort%20controller.
 
    fetch(url, {
        method: method,
        headers: headers,
        body: method !== 'GET' ? body : null,
        signal: controller.signal 
    })
    .then(response => {
        clearTimeout(id);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text(); 
        }
    })
    .then(data => {
        clearTimeout(id); 
        onSuccess(data);
    })
    .catch(error => {
        clearTimeout(id);
        onError(error);
    });
};


   