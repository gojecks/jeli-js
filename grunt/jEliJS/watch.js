module.exports = {
    jEliJS: {
        files: [
            '<%= dir %>src/**/*.js'
        ],
        tasks: ['clean:jDist',
            'concat:jEliJSOnly',
            'uglify:jEliJSOnly',
            'clean:jAfterBuild'
        ]
    }
};