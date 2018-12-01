//接口地址 开发和生产环境区分
const apiUrls = process.env.NODE_ENV === 'production' ? {
    origin: 'xx.xx.xx.xx',
    port: 'xx'
} : {
    origin: 'xx.xx.xx.xx',
    port: 'xx'
}
export default apiUrls