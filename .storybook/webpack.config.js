const path = require('path');

module.exports = {
    module: {
        loaders: [{
            test: /.css$/,
            loaders: ['style-loader', 'css-loader?modules=true'],
            include: path.resolve(__dirname, '../'),
        }],
    },
}
