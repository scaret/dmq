const path = require('path')

module.exports = {
    mode: "development",
    entry: {
        DMQ: "./lib/dmq.ts"
    },
    output: {
        path: path.join(__dirname, 'dist'),
            library: '[name]',
            libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js' ],
    },
    plugins: [
    ],
}