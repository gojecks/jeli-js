var jDistDirectory = './dist/';
module.exports = function(grunt) {
    return {
        options: {
            separator: '\n\n',
        },
        jEli: {
            dest: './dist/jeli.js',
            src: [
                './src/core/**/*.js',
                './src/common/module.js',
                './src/common/directives/*.js',
                './src/common/services/*.js'
            ]
        }
    };
};