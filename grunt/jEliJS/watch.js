module.exports = {
    jEliJS: {
        files: [
            '.src/**/*.js'
        ],
        tasks: ['clean:jDist',
            'concat:jEliJSOnly',
            'uglify:jEliJSOnly',
            'clean:jAfterBuild'
        ]
    }
};