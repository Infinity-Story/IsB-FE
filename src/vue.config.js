// vue.config.js

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // 백엔드 서버 주소
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': '', // /api를 제외한 실제 API 경로로 매핑
                },
            },
        },
    },
};
