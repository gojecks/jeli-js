module.exports = {
    jEliJS: {
        files: [
            'src/**/*.js'
        ],
        tasks: ['clean',
            'jeli-template-loader',
            'uglify',
            'clean:jAfterBuild'
        ]
    }
};