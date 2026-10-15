const devCli = require('../../jeli-cli/packages/dev-cli/index.js')
devCli.build('core', {
    compilerPath: require.resolve('../../jeli-cli/packages/compiler-cli/lib/index.js'),
    buildOptions: {}
})