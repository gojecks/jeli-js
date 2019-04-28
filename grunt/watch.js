module.exports = {
    jEliJS: {
        files: [
            '<%= dir %>src/**/*.js'
        ],
        tasks: ['clean',
            'jeli-template-loader',
            'uglify',
            'clean:jAfterBuild'
        ]
    }
};