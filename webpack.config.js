const path = require('path');

module.exports = {
    mode: 'development', // configuration needs to be explicitly state or a lot of performance warnings 
    entry: './src/app.js', // entry -> output
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    module: { //loader
        rules: [{
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
        }, {
            test: /\.s?css$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
        }]
    },
    devtool: 'cheap-module-source-map', // vs cheap-module=-eval-source-map in webpack
    devServer: {
        contentBase: path.join(__dirname, 'public')
    }
};

