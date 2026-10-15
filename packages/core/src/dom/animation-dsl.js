import { animate } from './animation';

var ANIMATION_STATE_KEY = '__jeliAnimationState__';

/**
 * Declarative, named-state animation config built directly on top of
 * animate()'s existing timing/easing/stepping engine (dom/animation.js) -
 * a small config object describing style "states" and the transitions
 * between them, instead of every call site hand-writing its own delta/
 * interpolation math (the way animate.slideUp/slideDown/fadeIn/fadeOut
 * each currently do, separately, for one fixed transition apiece).
 *
 * Deliberately scoped to unitless numeric CSS properties (opacity,
 * zIndex, and similar) - the same real boundary animate()'s own generic
 * per-property path already has (`element.style[prop] = styles[prop] *
 * delta`, no unit suffix ever applied). Properties needing a unit (height,
 * width, transform, color) are out of scope for this config form, exactly
 * like they already are for animate()'s own generic path (animate.slideUp/
 * slideDown deliberately bypass it for that reason, using the styles-as-
 * function form directly with hand-appended 'px' - do the same if you need
 * that here).
 *
 * @example
 * const fade = createAnimation({
 *     states: { void: { opacity: 0 }, visible: { opacity: 1 } },
 *     transitions: {
 *         'void => visible': { duration: 200, easing: 'swing' },
 *         'visible => void': { duration: 200, easing: 'linear' }
 *     },
 *     defaults: { duration: 300, easing: 'swing' }
 * });
 * fade.trigger(element, 'visible').then(() => console.log('done'));
 *
 * @param {{
 *   states: Object<string, Object<string, number>>,
 *   transitions?: Object<string, {duration?: number, easing?: string}>,
 *   defaults?: {duration?: number, easing?: string}
 * }} config
 */
export function createAnimation(config) {
    var states = config.states || {};
    var transitions = config.transitions || {};
    var defaults = config.defaults || {};

    function resolveTransition(fromName, toName) {
        return transitions[fromName + ' => ' + toName]
            || transitions['* => ' + toName]
            || transitions[fromName + ' => *']
            || transitions['* => *']
            || {};
    }

    return {
        /**
         * Transitions `element` from `fromName` (default: whichever state
         * name was last applied via trigger() on this element, or 'void'
         * if it's never been triggered) to `toName`.
         * @param {Element} element
         * @param {string} toName
         * @param {string} [fromName]
         * @returns {Promise<void>} resolves once the transition completes
         */
        trigger: function (element, toName, fromName) {
            var to = states[toName];
            if (!to) return Promise.reject(new Error('createAnimation: unknown state "' + toName + '"'));

            fromName = fromName || element[ANIMATION_STATE_KEY] || 'void';
            var from = states[fromName] || {};
            var transition = resolveTransition(fromName, toName);
            var duration = transition.duration || defaults.duration || 1000;
            var easing = transition.easing || defaults.easing || 'swing';

            return new Promise(function (resolve) {
                animate(element, function (delta) {
                    for (var prop in to) {
                        var start = prop in from ? from[prop] : to[prop];
                        element.style[prop] = start + (to[prop] - start) * delta;
                    }
                }, duration, function () {
                    element[ANIMATION_STATE_KEY] = toName;
                    resolve();
                }, easing);
            });
        },

        /**
         * @param {Element} element
         * @returns {string} the state name last reached via trigger(), or
         *  'void' if trigger() has never run against this element
         */
        currentState: function (element) {
            return element[ANIMATION_STATE_KEY] || 'void';
        }
    };
}
