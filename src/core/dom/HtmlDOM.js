function HtmlDOM() {

    this.createTextNode = function(text) {
        return document.createTextNode(text);
    };

    this.appendChild = function(parent, child) {
        parent.appendChild(child);
    };
}

HtmlDOM.prototype.insertBefore = function(target, newNode) {
    target.parent.insertBefore(newNode, target);
};

HtmlDOM.prototype.asElementRef = function(ele) {
    return new ElementRef(ele);
};

HtmlDOM.prototype.querySelector = function(element, query) {
    return (element.nativeElement || element).querySelector(query);
};

HtmlDOM.prototype.querySelectorAll = function(element, query) {
    return (element.nativeElement || element).querySelectorAll(query);
};

HtmlDOM.prototype.createElement = function(elementName, config) {
    var ele = null,
        hasCondition = config.hasOwnProperty('condition');
    if (!hasCondition || (hasCondition && config.condition)) {
        ele = document.createElement(elementName),
            _this = this;
        if ($isObject(config)) {
            // write attributes
            if (config.attributes) {
                for (var prop in config.attributes) {
                    ele.setAttribute(prop, config.attributes[prop]);
                }
            }

            if (config.styles) {
                for (var style in config.styles) {
                    ele.style[style] = config.styles[style];
                }
            }

            if (config.textContent) {
                ele.appendChild(_this.createTextNode(config.textContent));
            } else if (config.innerHTML) {
                ele.innerHTML = config.innerHTML;
            }

            // append Children
            if (config.children) {
                config.children.forEach(function(child) {
                    var childEle = _this.createElement(child.element, child);
                    if (childEle) {
                        ele.appendChild(childEle);
                    }
                });
            }
        }
    }

    return ele;
};

HtmlDOM.createElementByType = function(tag, text, fromDOM) {
    if (fromDOM) {
        return document.querySelector(tag);
    }

    switch (tag) {
        case ('#comment'):
            return document.createComment(text);
        case ('#fragment'):
            return document.createDocumentFragment();
        default:
            return document.createElement(tag);
    }
};