
let animationCounter = 0;


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
            let grandParent = item.parentElement.parentElement;
            while (grandParent) {
                if (!selector || grandParent.matches(selector)) {
                    if (!ancestors.includes(grandParent)) {
                        ancestors.push(grandParent);
                    }
                    break;
                }
                grandParent = grandParent.parentElement;
            }
        });
        return new FritosObject(ancestors);
    }

    animate(cssProperties, animationOptions) {
        let styleSheet = null;
        if (document.styleSheets[0]) {
            styleSheet = document.styleSheets[0];
        }
    
        if (!styleSheet) {
            const style = document.createElement('style');
            document.head.appendChild(style);
            styleSheet = style.sheet;
        }
        const animationName = `fritosAnimation${animationCounter}`;

        let cssPropertiesArray = [];
        Object.entries(cssProperties).forEach(([key, value]) => {
            const kebabKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            cssPropertiesArray.push(`${kebabKey}: ${value};`);
        });

        const cssString = cssPropertiesArray.join(' ');

        const keyframes = `@keyframes ${animationName} {
            from {}
            to {${cssString}}
        }`;
        styleSheet.insertRule(keyframes, animationCounter);


        const animationCSS = `${animationName} ${animationOptions.duration / 1000}s ${animationOptions.easing} ${animationOptions.delay} ${animationOptions.iterationCount} ${animationOptions.fillMode}`;       
        this.items.forEach(item => {
            item.style.animation = animationCSS;
        });

        animationCounter++;
        return this;
    }

    find(selector) {
        if (!selector) {
            return new FritosObject([]);
        }

        const foundItems = [];
        this.items.forEach(item => {
            const children = item.querySelectorAll(selector);
            Array.from(children).forEach(child => foundItems.push(child));
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
            throw new Error('Validation can only be used on HTMLFormElement with at least one item');
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
        if (!value) {
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
    options.timeout = options.timeout || 45;
    if (options.method === 'GET') {
        delete options.body;
    }

    const controller = new AbortController();
    options.signal = controller.signal;
    setTimeout(controller.abort, options.timeout * 1000)
  
    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            throw new Error('Response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text(); 
        }
    })
    .then(data => {
        options.onSuccess(data);
    })
    .catch(error => {
        options.onError(error);
    });
};



// FINISHED
// TESTING parent
// const parent = fritos('input[type="password"]').parent();
// const unknownParent = fritos('#password').parent('div');
// console.log(parent)
// console.log(unknownParent)



// TESTING ancestor
// // Returns the first ancestor <div class="items"></div>
// console.log(fritos('.item-image').ancestor())
// // Returns the ancestor <main></main>
// console.log(fritos('.item-image').ancestor('main'))

// console.log(fritos('.item-img').ancestor()) // [main, aside]



// TESTING animate
// fritos('.moveable-item').animate({
//     transform: 'translateX(100px)'
//     }, {
//         // Time in milliseconds
//         duration: 1000,
//         // time, 'initial', 'inherit'
//         delay: '2s',
//         // ease, linear, ease-in, ease-in-out, cubic-bezier(n, n, n, n)
//         easing: 'linear',
//         // number, 'infinite', 'initial', 'inherit'
//         iterationCount: 4,
//         // none, forwards, backwards, both, initial, inherit
//         fillMode: 'none'
//     });


// fritos('.moveable-item2').animate({
//     transform: 'translateX(100px)',
//     opacity: '0.1',
//     backgroundColor: 'red'
//     }, {
//         // Time in milliseconds
//         duration: 2000,
//         // time, 'initial', 'inherit'
//         delay: '2s',
//         // ease, linear, ease-in, ease-in-out, cubic-bezier(n, n, n, n)
//         easing: 'ease-in-out',
//         // number, 'infinite', 'initial', 'inherit'
//         iterationCount: 1,
//         // none, forwards, backwards, both, initial, inherit
//         fillMode: 'both'
//     });


// FINISHED
// TESTING find
// console.log(fritos('.container').find('.item'))
  
   

// FINISHED
// TESTING onEvent
// console.log('TESTING onEvent:')
// fritos('form .form-group input[type="input"]').onEvent('input', function(evt) {
//     // This will print out the
//     console.log(evt.target.value);
// });



// FINISHED
// TESTING remoteCall
// fritos.remoteCall('https://serene-island-81305.herokuapp.com/api/200', {
//     // GET, PUT, POST, PATCH, DELETE, HEAD, CONNECT, OPTIONS, TRACE, PATH
//     method: 'GET',
//     // The timeout specified in seconds (defaults to 45)
//     timeout: 45,
//     // An object representing the headers associated with the HTTP request
//     headers: {
//         'Accept-Language': 'is-IS',
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },


//     // A success function which is called if the HTTP request wassuccessful
//     onSuccess: function(data) {
//         // TODO: Use data
//         console.log(data)
//     },
//     // An error function which is called if the HTTP request encountered an error
//     onError: function(err) {
//         // TODO: Handle error
//         console.log(err)
//     }
// });


// fritos.remoteCall('https://serene-island-81305.herokuapp.com/api/201', {
//     // GET, PUT, POST, PATCH, DELETE, HEAD, CONNECT, OPTIONS, TRACE, PATH
//     method: 'POST',
//     // The timeout specified in seconds (defaults to 45)
//     timeout: 45,
//     // An object representing the headers associated with the HTTP request
//     headers: {
//         'Accept-Language': 'is-IS',
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     // A request body (in this case parsed as JSON)
//     body: JSON.stringify({
//         id: 1,
//         name: 'John Doe'
//     }),
//     // A success function which is called if the HTTP request wassuccessful
//     onSuccess: function(data) {
//         // TODO: Use data
//         console.log(data)
//     },
//     // An error function which is called if the HTTP request encountered an error
//     onError: function(err) {
//         // TODO: Handle error
//         console.log(err)
//     }
// });




// FINISHED
// TESTING validation
// const result = fritos("#user-credentials").validation({
//     "email-address": [
//         {
//             message: "The email address is required",
//             valid: (value) => value.length > 0,
//         },
//         {
//             message: "The email address must be correctly formatted",
//             // Regex to check if the email address is correctly formatted
//             valid: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g.test(value),
//         },
//     ],
//     password: [
//         {
//             message:
//                 "The password must contain at least one character, number and special character",
//             valid: (value) =>
//                 // Regex to check if string is more than 8 in length contains
//                 // at least one character, number and special character
//                 /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,}$/g.test(value),
//         },
//     ],
//     "confirm-password": [
//         {
//             message: "The confirm password must match the password",
//             valid: (value, parent) => {
//                 const password = parent.querySelector('input[name="password"]');
//                 return value === password.value;
//             },
//         },
//     ],
// });
// console.log(result);





// FINISHED
// TESTING hide
// fritos('.item').hide();




// FINISHED
// TESTING prune
// fritos('input[type="text"]').prune()



// FINISHED
// TESTING raise
// fritos('input[type="text"]').raise(2);



// FINISHED
// TESTING attrs
// fritos('form .form-group input').attrs('name', 'input');



// FINISHED
// TESTING val
// Updates all values for the matching elements
// fritos('input[type="text"]').val('Default value');
// // Returns the value of the first matching element.
// const value = fritos('input[type="text"]').val();

// console.log(value)