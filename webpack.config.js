const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, './public/js/app.js'),  
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "./public/dist")
    },
    module: {
        rules: [    
        {
            test: /\.(js|ts)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }
        ]
    }
}