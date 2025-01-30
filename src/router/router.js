import { createRouter, createWebHistory } from 'vue-router';
import NoticeList from '@/components/Notice/NoticeList.vue';
import MainLogin from "@/components/Login/MainLogin.vue";
import UserLogin from "@/components/Login/UserLogin.vue";
import AdminLogin from "@/components/Login/AdminLogin.vue";  // 공지사항 리스트 컴포넌트

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
    {
        path: '/user-login',
        name: '일반 회원 로그인창',
        component: UserLogin,
    },
    {
        path: '/admin-login',
        name: '관리자 로그인창',
        component: AdminLogin,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
