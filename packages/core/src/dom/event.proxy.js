/**
 * 
 * @param {*} event 
 * @param {*} target 
 * @returns 
 */
export function ProxyEvent(event, target) {
    var eventProps = ['pageX', 'pageY', 'screenX', 'screenY', 'x', 'y', 'clientX', 'clientY', 'type', 'width', 'height', 'offsetX', 'offsetY'];
    return eventProps.reduce((accum, name) => (accum[name] = event[name], accum), {
        target,
        preventDefault: event.preventDefault
    });
}