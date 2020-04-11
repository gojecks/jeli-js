module.exports = {
    core: {
        files: [
            'packages/**/*.js',
        ],
        tasks: ['clean',
            'jeli-template-loader:jeli',
            // 'uglify',
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