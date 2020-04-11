module.exports = function(grunt) {
    var path = require('path'),
        appName = grunt.option('project');

    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-karma');
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        jitGrunt: true,
        configPath: path.join(process.cwd(), 'grunt/'),
        data: {
            jeliJSON: grunt.file.read(path.join(process.cwd(), 'jeli.json'))
        }
    });
};