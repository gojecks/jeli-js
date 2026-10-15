/**
 * 
 * @param {*} event 
 * @param {*} target 
 * @returns 
 */
const eventProps = ['key', 'keyCode', 'pageX', 'pageY', 'screenX', 'screenY', 'x', 'y', 'clientX', 'clientY', 'type', 'width', 'height', 'offsetX', 'offsetY'];
export function ProxyEvent(event, target) {
    return eventProps.reduce((accum, name) => (accum[name] = event[name], accum), {
        target,
        preventDefault: () => event.preventDefault()
    });
}