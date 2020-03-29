module.exports = {
    core: {
        files: [
            'src/**/*.js',
            '../jeli.helpers/**/*.js',
            '../jeli.web.route/src/**/*.js',
            '../jeli.storage/src/**/*.js',
            '../jeli.date.time/src/**/*.js'
        ],
        tasks: ['clean',
            'jeli-template-loader:jeli',
            'uglify',
            'clean:jAfterBuild'
        ]
    },
    test: {
        files: [
            './docs/examples/Todo/scripts/**/*'
        ],
        tasks: ['jeli-template-loader:test', 'concat']
    }
};