import axios from 'axios';

const apiAxios = axios.create({
    baseURL: import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080',  // 환경 변수로 URL 관리
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiAxios;