const path = require('path');
module.exports = function(grunt) {
    // const jeliJson = grunt.file.read(path.join(process.cwd(), 'jeli.json'));
    return {
        options: {
            separator: '\n\n',
            parseHtml: true
        },
        jeli: {
            options: {
                generateMap: true
            },
            files: [{
                    dest: './bundles/core.js',
                    src: [
                        '../jeli.helpers/common/*.js',
                        '../jeli.helpers/eval.js',
                        '../jeli.helpers/copy.js',
                        '../jeli.helpers/promise/*.js',
                        '../jeli.helpers/events/emitter.js',
                        '../jeli.helpers/externalScriptLoader.js',
                        './src/core/**/*.js'
                    ]
                },
                {
                    src: ['./src/common/module.js'],
                    dest: './bundles/modules/common/index.js'
                },
                {
                    src: ['./src/form/module.js'],
                    dest: './bundles/modules/form/index.js'
                },
                {
                    src: [
                        '../jeli.helpers/serializer.js',
                        '../jeli.helpers/xhr/*.js',
                        './src/http/module.js'
                    ],
                    dest: './bundles/modules/http/index.js'
                },
                {
                    src: ['../jeli.web.route/src/module.js'],
                    dest: './bundles/modules/route/index.js'
                },
                {
                    src: '../jeli.storage/src/module.js',
                    dest: './bundles/modules/storage/index.js'
                },
                {
                    src: ['../jeli.date.time/src/module.js'],
                    dest: './bundles/modules/datetime/index.js'
                }
            ]
        },
        test: {
            dest: './docs/examples/Todo/app.js',
            src: './docs/examples/Todo/scripts/main.js',
            options: {
                parseModule: true,
                generateMap: false
            }
        }
    };
};