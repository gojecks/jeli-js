var jDistDirectory = './dist/';

module.exports = {
    options: {
        separator: '\n\n',
        process: true
    },
    jeliTest: {
        options: {
            banner: '(function(){\n "use strict";\n',
            footer: '\n})();'
        },
        dest: './docs/examples/Todo/app.js',
        src: [
            './dist/jeli.js',
            './docs/examples/Todo/app.js',
        ]
    }
};