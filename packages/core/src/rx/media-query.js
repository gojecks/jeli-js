/**
 * 
 * @param {*} breakPoints 
 * @param {*} callback 
 * @returns 
 */
export function MediaQueryEvent(breakPoints, callback) {
    if (!Array.isArray(breakPoints) || (typeof callback != 'function')) 
        return errorBuilder('MediaQueryEvent requires list of breakPoints to observe and also a callback function');

    var attachQuery = (screenSize, idx) => {
        // eventHandler
        var handleChange = (event) =>  callback(event, screenSize);

        var query = `(min-width: ${screenSize}px)`;
        // add max width if next index is defined
        var nextPoint = breakPoints[idx + 1];
        if (nextPoint)
            query += ` and (max-width: ${(nextPoint - .02)}px)`;

        var media = matchMedia(`${query}`);
        media.addEventListener('change', handleChange);
        // initial changes
        if (media.matches)
            handleChange(media);

        return () => media.removeEventListener('change', handleChange);
    };

    var breakPointHandlers = breakPoints.map(attachQuery);
    return () => breakPointHandlers.forEach(listener => listener());
}