const path = require("path")

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = function override(config, env) {
    //增加别名 方便引用
    config.resolve.alias = {
        '@': resolve('src')
    }
    return config
}