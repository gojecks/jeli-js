module.exports = {
    options: {
        separator: '\n\n',
        process: true
    },
    jEliJSOnly: {
        dest: './dist/jeli.js',
        src: [
            './src/jeli-core/jeli-header/*.js',
            './src/jeli-core/jeli-header-nodb/*.js',
            './src/jeli-core/jeli-common/*.js',
            './src/jeli-core/jeli-model-functionality/*.js',
            './src/jeli-core/jeli-miscellaneous/*.js',
            './src/jeli-core/jeli-model/*.js',
            './src/jeli-core/jeli-providers/**/*.js',
            './src/jeli-core/jeli-observer/*.js',
            '../Project-jEliDB/src/core/query-taskperformer.js',
            './src/jeli-core/jeli-dom/**/*.js',
            './src/jeli-core/jeli-xhr/*.js',
            './src/jeli-core/jeli-dom-transversal/*.js',
            './src/jeli-core/jeli-customApi/*.js',
            './src/jeli-core/jeli-custom-directive/**/*.js',
            './src/jeli-core/jeli-directive-compiler/*.js',
            './src/jeli-core/jeli-promise/*.js',
            './src/jeli-core/jeli-dependency-injector/*.js',
            './src/jeli-core/jeli-module-instance/*.js',
            './src/jeli-core/jeli-registry/**/*.js',
            './src/jeli-core/jeli-bootstrap/*.js',
            './src/jeli-core/jeli-footer/*.js',

        ]
    }
};