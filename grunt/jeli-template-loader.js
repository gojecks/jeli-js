var jDistDirectory = './dist/';
module.exports = function(grunt) {
    return {
        options: {
            separator: '\n\n',
        },
        slim: {
            dest: './dist/slim.js',
            src: [
                './src/core/**/*.js',
                './src/common/module.js',
                './src/common/directives/*.js',
                './src/common/services/*.js'
            ],
            options: {
                footer: "\n// write the global reference\nglobal.jeli=JModule;"
            }
        },
        jall: {
            dest: './dist/jeli.js',
            src: [
                '../jeli.helpers/common/*.js',
                '../jeli.helpers/customApi/*.js',
                '../jeli.helpers/promise/*.js',
                '../jeli.helpers/expect.js',
                '../jeli.helpers/events/stack.js',
                '../jeli.helpers/externalScriptLoader.js',
                '../jeli.helpers/snapshot_hash.js',
                '../jeli.helpers/serializer.js',
                '../jeli.helpers/xhr/*.js',
                './src/core/**/*.js',
                './src/common/module.js',
                './src/common/directives/*.js',
                './src/common/services/*.js'
            ],
            options: {
                wrap: {
                    type: 'UMD',
                    data: {
                        moduleName: 'jeli',
                        returnObj: 'JModule'
                    }
                }
            }
        }
    };
};