export var scheduler = {
    schedule: function(taskFn, timer) {
        if (!window.requestAnimationFrame) {
            var taskId = setTimeout(taskFn, timer === undefined ? 15 : timer);
            return function() {
                clearTimeout(taskId);
            }
        }

        var taskId = window.requestAnimationFrame(taskFn);
        return function() {
            window.cancelAnimationFrame(taskId)
        };
    }
}