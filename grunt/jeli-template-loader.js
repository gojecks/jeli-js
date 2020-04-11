const path = require('path');
module.exports = function(grunt) {
    return {
        options: {
            separator: '\n\n',
            parseHtml: true
        },
        jeli: {
            options: {
                library: true,
                sourceRoot: 'packages/',
                output: {
                    generateMeta: true,
                    patterns: ['UMD', 'MODULE'],
                    folder: 'dist/',
                    files: {
                        '@jeli/*': './*/public.api.js'
                    }
                },
                scripts: [
                    '../jeli.helpers/eval.js',
                    '../jeli.helpers/promise/*.js',
                    '../jeli.helpers/externalScriptLoader.js'
                ]
            }
            // files: [
            //     {
            //         src: ['./src/common/module.js'],
            //         dest: './dist/modules/common/index.js'
            //     },
            //     {
            //         src: ['./src/form/module.js'],
            //         dest: './dist/modules/form/index.js'
            //     },
            //     {
            //         src: [
            //             '../jeli.helpers/serializer.js',
            //             '../jeli.helpers/xhr/*.js',
            //             './src/http/module.js'
            //         ],
            //         dest: './dist/modules/http/index.js'
            //     },
            //     {
            //         src: ['../jeli.web.route/src/module.js'],
            //         dest: './dist/modules/route/index.js'
            //     },
            //     {
            //         src: '../jeli.storage/src/module.js',
            //         dest: './dist/modules/storage/index.js'
            //     },
            //     {
            //         src: ['../jeli.date.time/src/module.js'],
            //         dest: './dist/modules/datetime/index.js'
            //     }
            // ]
        },
        examples: {
            options: {
                library: false,
                sourceRoot: 'docs/examples/Todo/src/',
                output: {
                    generateMeta: false,
                    folder: './docs/examples/Todo/',
                    files: {
                        'main': './main.js'
                    }
                }
            }
        }
    };
};