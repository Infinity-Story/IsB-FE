import { createRouter, createWebHistory } from 'vue-router';
import NoticeList from '@/components/Notice/NoticeList.vue';
import MainLogin from "@/components/Login/MainLogin.vue";  // 공지사항 리스트 컴포넌트

const routes = [
    {
      path: '/',
      name: 'CommonLogin',
      component: MainLogin,
    },
    {
        path: '/notice/list',
        name: '공지사항 전체 조회창',
        component: NoticeList,  // '/notice/list' 경로에서 NoticeList.vue 사용
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
