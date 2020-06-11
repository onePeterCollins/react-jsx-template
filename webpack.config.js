const path = require('path')

module.exports = {
    entry: './src/$Template.jsx',

    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node-modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            }
        ]
    },

    output: {
        filename: 'Template.js',
        path: path.resolve(__dirname, 'dist')
    }
};
