// batches all tasks registered before the next frame into one rAF call instead of one rAF per task (same timing, less per-task overhead)
var pending = [];
var flushScheduled = false;

function flush() {
    var tasks = pending;
    pending = [];
    flushScheduled = false;
    for (var i = 0; i < tasks.length; i++) {
        if (!tasks[i].cancelled) tasks[i].fn();
    }
}

export var scheduler = {
    schedule: function(taskFn, timer) {
        if (!window.requestAnimationFrame) {
            var taskId = setTimeout(taskFn, timer === undefined ? 15 : timer);
            return function() {
                clearTimeout(taskId);
            }
        }

        var task = { fn: taskFn, cancelled: false };
        pending.push(task);
        if (!flushScheduled) {
            flushScheduled = true;
            window.requestAnimationFrame(flush);
        }

        return function() {
            task.cancelled = true;
        };
    }
}
