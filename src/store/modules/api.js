// 适配 Nginx 反向代理
const baseUrl = process.env.VUE_APP_BASE_API === '' ? '' : process.env.VUE_APP_BASE_API;
const api = {
  state: {
    // Deployment package upload
    deployUploadApi: baseUrl + '/api/deploy/upload',
    // SQL script upload
    databaseUploadApi: baseUrl + '/api/database/upload',
    // Real-time console
    socketApi: baseUrl + '/websocket?token=kl',
    // upload picture
    imagesUploadApi: baseUrl + '/api/localStorage/pictures',
    // Modify avatar
    updateAvatarApi: baseUrl + '/api/users/updateAvatar',
    // Upload files to Qiniu Cloud
    qiNiuUploadApi: baseUrl + '/api/qiNiuContent',
    // Sql Monitor
    sqlApi: baseUrl + '/druid/index.html',
    // swagger
    swaggerApi: baseUrl + '/swagger-ui.html',
    // File Upload
    fileUploadApi: baseUrl + '/api/localStorage',
    // baseUrl，
    baseApi: baseUrl
  }
};

export default api;
