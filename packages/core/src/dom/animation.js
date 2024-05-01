var FX = ({
    easing: {
        linear: function (progress) {
            return progress;
        },
        quadratic: function (progress) {
            return Math.pow(progress, 2);
        },
        swing: function (progress) {
            return 0.5 - Math.cos(progress * Math.PI) / 2;
        },
        circ: function (progress) {
            return 1 - Math.sin(Math.acos(progress));
        },
        back: function (progress, x) {
            return Math.pow(progress, 2) * ((x + 1) * progress - x);
        },
        bounce: function (progress) {
            for (var a = 0, b = 1; 1; a += b, b /= 2) {
                if (progress >= (7 - 4 * a) / 11) {
                    return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                }
            }
        },
        elastic: function (progress, x) {
            return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
        }
    }
});

/**
 * @param {*} options 
 */
function animationInterval(options) {
    var start = new Date;
    if (typeof options.duration === 'string') {
        options.duration = options.duration == 'fast' ? 100 : 1000;
    }

    var id = setInterval(function () {
        var timePassed = new Date - start;
        var progress = timePassed / options.duration;
        if (progress > 1)
            progress = 1;

        options.progress = progress;
        var delta = options.delta(progress);
        options.step(delta);
        if (progress == 1) {
            clearInterval(id);
            options.complete();
        }
    }, options.delay || 10);
}

function triggerCallback(callback, arg) {
    if (callback && typeof callback == 'function') {
        callback.call(arg);
    }
}

function getAttrFx(element, show){
    var height = parseInt(element.style.height || element.clientHeight);
    var opacity = show ? 1: 0;
    return { height, opacity }
}

/**
 * 
 * @param {*} element 
 * @param {*} styles 
 * @param {*} speed 
 * @param {*} callback 
 */
export function animate(element, styles, speed, callback) {
    animationInterval({
        duration: speed,
        delta: function (progress) {
            return FX.easing.swing(progress);
        },
        complete: callback || function () { },
        step: function (delta) {
            for (var prop in styles) {
                element.style[prop] = Math.floor(styles[prop] * delta);
            };
        }
    });
};

/**
 * 
 * @param {*} element 
 * @param {*} speed 
 * @param {*} callback 
 */
animate.hide = function (element, speed, callback) {
    var attrFx = getAttrFx(element, false);
    animate(element, attrFx, speed || 100, function(){
        element.style.display = 'none';
        element.style.height = attrFx.height;
        triggerCallback(callback);
    });
}

/**
 * 
 * @param {*} element 
 * @param {*} speed 
 * @param {*} callback 
 */
animate.show = function (element, speed, callback) {
    element.style.display = 'block';
    animate(element, getAttrFx(element, true), speed || 100, function(){
        triggerCallback(callback);
    });
};

/**
 * 
 * @param {*} element 
 * @param {*} to 
 * @param {*} style 
 * @param {*} speed 
 */
function fadeFN(element, to, style, speed) {
    animationInterval({
        duration: speed || 1000,
        delta: function (progress) {
            return FX.easing.swing(progress);
        },
        complete: function () {
            element.style.display = style;
        },
        step: function (delta) {
            element.style.opacity =  delta;
        }
    });
}

/**
 * 
 * @param {*} element 
 * @param {*} speed 
 * @param {*} callback 
 */
animate.fadeIn = function (element, speed, callback) {
    fadeFN(element, 0, 'block', speed, callback)
    triggerCallback(callback);
};

/**
 * 
 * @param {*} element 
 * @param {*} speed 
 * @param {*} callback 
 */
animate.fadeOut = function (element, speed, callback) {
    fadeFN(element, 1, 'none', speed, callback)
    triggerCallback(callback);
};

/**
 * 
 * @param {*} element 
 * @param {*} speed 
 * @param {*} callback 
 * @returns 
 */
animate.slideUp = function (element, speed, callback) {
    speed = speed || 1000;
    var hgt = element.clientHeight;
    animationInterval({
        duration: speed,
        delta: function (progress) {
            progress = this.progress;
            return FX.easing.swing(progress);
        },
        complete: function () {
            element.style.display = 'none';
            element.style.height = hgt + 'px';
        },
        step: function (delta) {
            element.style.height = Math.floor(hgt - (hgt * delta)) + 'px';
            element.style.overflow = 'hidden';
        }
    });

    triggerCallback(callback);
};

/**
 * 
 * @param {*} element 
 * @param {*} speed 
 * @param {*} callback 
 * @returns 
 */
animate.slideDown = function (element, speed, callback) {
    speed = speed || 1000;
    var hgt = parseInt(element.style.height);
    element.style.height = '0px';
    element.style.display = '';
    animationInterval({
        duration: speed,
        delta: function (progress) {
            progress = this.progress;
            return FX.easing.swing(progress);
        },
        complete: function () {
            element.style.overflow = 'auto';
        },
        step: function (delta) {
            element.style.height = Math.floor(0 + (hgt * delta)) + 'px';
            element.style.overflow = 'hidden';
        }
    });

    triggerCallback(callback);
};

animate.toggleSlide = function (element) {
    animate[(element.style.display === 'none') ? 'slideDown' : 'slideUp'](element);
};