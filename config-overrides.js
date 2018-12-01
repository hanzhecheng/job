const path = require("path")

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = function override(config, env) {
    //增加别名 方便文件引用写路径
    config.resolve.alias = {
        '@': resolve('src')
    }
    return config
}