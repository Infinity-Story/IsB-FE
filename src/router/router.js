// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';
import NoticeList from '@/components/Notice/NoticeList.vue';  // 공지사항 리스트 컴포넌트

// import store from '@/store/store.js';
const routes = [
    {
        path: '/',
        name: 'Home',
        component: App,
    },
    {
        path: '/notice/list',
        name: '공지사항 전체 조회창',
        component: NoticeList },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
