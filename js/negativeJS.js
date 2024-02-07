class negativeJS {

    /**
     * Initialize selectors
     * @param {any} selectors
     * @returns {any}
     */
    constructor(selectors) {
        /* 
            * Initialize an array
        */
        this.elements = [];

        if (typeof selectors === 'string') {
            /* 
                * Handle a single selector as a string
            */
            this.elements = Array.from(document.querySelectorAll(selectors));
        } else if (selectors instanceof HTMLElement) {
            /* 
                * Handle an HTML element
            */
            this.elements = [selectors];
        } else if (selectors instanceof NodeList || Array.isArray(selectors)) {
            /* 
                * Handle a NodeList or an array of elements, convert it to an array
            */
            this.elements = Array.from(selectors);
        } else if (Array.isArray(selectors)) {
            /* 
                * Handle an array of selectors
            */
            this.elements = selectors
                .filter((selector) => typeof selector === 'string')
                .flatMap((selector) => Array.from(document.querySelectorAll(selector)));
        }
    }
    
    /**
     * Get html content foreach element
     * @returns {any}
     */
    htmlContent() {
        const elementHtml = [];
        this.elements.forEach((el) => {
            elementHtml.push(el.innerHTML);
        });
        return elementHtml.join('');
    }
    
    /**
     * Find all childs
     * @param {any} selector
     * @returns {any}
     */
    find(selector) {
        const childElements = [];
        this.elements.forEach((parentElement) => {
            const foundElements = Array.from(parentElement.querySelectorAll(selector));
            childElements.push(...foundElements);
        });
        return new negativeJS(childElements);
    }
    
    /**
     * Set css property and value
     * @param {any} property
     * @param {any} value
     * @returns {any}
     */
    setCss(property, value) {
        this.elements.forEach((element) => {
            element.style[property] = value;
        });
        return this;
    }
    /* 
        * Add new class in element
    */
    addClassName(className) {
        if (!Array.isArray(className)) {
            this.elements.forEach((element) => {
                element.classList.add(className);
            });
        } else {
            this.elements.forEach((element) => {
                element.classList.add(...className);
            });
        }

        return this;
    }
    /* 
        * Remove class
    */
    removeClassName(className) {
        this.elements.forEach((element) => {
            element.classList.remove(className);
        });
        return this;
    }
    /**
     * Append element
     * @param {any} tagName
     * @param {any} attributes={}
     * @returns {any}
     */
    appendElement(tagName, attributes = {}) {
        let newElement = null;
        if (tagName.startsWith('<') && tagName.endsWith('>')) {
            /* 
                * Create in memory element
            */
            newElement = tagName.slice(1, -1);
            newElement = document.createElement(newElement);
        } else {
            newElement =  document.createElement(tagName);
        }
        

        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                newElement.setAttribute(key, attributes[key]);
            }
        }

        // Append the new element to the last element in the selected elements
        const lastIndex = this.elements.length - 1;
        if (lastIndex >= 0) {
            this.elements[lastIndex].appendChild(newElement);
        } else {
            console.error('No elements to append to.');
        }

        // Return a new negativeJS instance containing the new element
        return new negativeJS(newElement);

    }
    /* 
        * Prepend element
    */
    prependElement(tagName, attributes = {}) {
        const newElement = document.createElement(tagName);

        for (const key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                newElement.setAttribute(key, attributes[key]);
            }
        }

        this.elements.forEach((parentElement) => {
            parentElement.prepend(newElement);
        });
        return new negativeJS(newElement);
    }
    /* 
        * Remove element
    */
    removeElement() {
        this.elements.forEach((element) => {
            element.remove();
        });
        return this;
    }
    /* 
        * Remove element by selector
    */
    removeElementBySelector(selector) {
        this.elements.forEach((parentElement) => {
            const elementsToRemove = Array.from(parentElement.querySelectorAll(selector));
            elementsToRemove.forEach((element) => {
                element.remove();
            });
        });
        return this;
    }
    /* 
        * Write text
    */
    writeText(string) {
        this.elements.forEach((element) => {
            element.textContent = string;
        });
        return this;
    }
    getParent(number = 0) {
        if (number < 1) {
            /* 
                * If number is less than 1, return the current element itself
            */
            return this;
        }

        /* 
            * Initialize a variable with the current element
        */
        let currentElement = this.elements[0];

        for (let i = 0; i < number; i++) {
            if (currentElement.parentElement) {
                /* 
                    * If the current element has a parent, set the parent as the new current element
                */
                currentElement = currentElement.parentElement;

            } else {
                /* 
                    * If there are no more parent elements, break out of the loop
                */
                return null;
            }
        }

        /* 
            * Create a new negativeJS instance for the final parent element and return it
        */
        return new negativeJS(currentElement);

    }
    /* 
        * Get attributes
    */
    getAttribute(attributeName) {
        const attributeValues = [];
        this.elements.forEach((element) => {
            const value = element.getAttribute(attributeName);
            attributeValues.push(value);
        });
        return attributeValues;
    }
    /* 
        * Get class by className
    */
    getClass(className) {
        const classAttribute = this.elements[0].getAttribute('class');
        if (classAttribute) {
            const classNames = classAttribute.split(' ');
            const findClass = classNames.findIndex(element => element === className);
            if (findClass !== -1) {
                const firstMatchingElement = classNames[findClass];
                return firstMatchingElement;
            } else {
                return null;
            }
        }
        return null;
    }
    /* 
        * Element exist
    */
    elementExist() {
        const allElements = [];
        this.elements.forEach((element) => {
            const el = new negativeJS(element);
            allElements.push(el);
        });
        return allElements;

    }
}
/* 
    * New negativeJS instance
*/
function nJS(selectors) {
    if (typeof selectors === 'string') {
        if (selectors.startsWith('<') && selectors.endsWith('>')) {
            /* 
                * Create in memory element
            */
            const newSelectors = selectors.slice(1, -1);
            // const element = document.createElement('div');

            // element.innerHTML = selectors;
            return new negativeJS(newSelectors);

        } else {
            /* 
                * Treat it as a selector string
            */
            return new negativeJS(selectors);
        }
    } else if (Array.isArray(selectors)) {
        if (selectors.length === 0) {
            throw new Error('No selectors provided. Please provide at least one selector or HTML string.');
        }
        return selectors.map((selector) => {
            if (typeof selector === 'string') {
                return new negativeJS(selector);
            } else {
                throw new Error('Invalid selector. Please provide a string selector or an array of selectors.');
            }
        });
    } else if (selectors instanceof negativeJS) {
        return selectors;
    } else {
        // Append the provided DOM element to the target element
        return new negativeJS(selectors);
    }
}
/* 
    * Dom ready
*/
function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}
/* 
    * On event callbacks
*/
negativeJS.prototype.on = function (eventName, callback) {
    this.elements.forEach((element) => {
        element.addEventListener(eventName, callback);
    });
    return this;
};