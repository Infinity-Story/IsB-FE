import { createRouter, createWebHistory } from 'vue-router';
import NoticeList from '@/components/Notice/NoticeList.vue';
import MainLogin from "@/components/Login/MainLogin.vue";
import UserLogin from "@/components/Login/UserLogin.vue";
import AdminLogin from "@/components/Login/AdminLogin.vue";
import AdminMainPage from "@/components/Admin/AdminMainPage.vue";  // 관리자 페이지

const routes = [
    {
        path: '/',
        name: 'CommonLogin',
        component: MainLogin,
    },
    {
        path: '/notice/list',
        name: '공지사항 전체 조회창',
        component: NoticeList,
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
    },
    {
        path: '/admin-main',
        name: '관리자 메인 페이지',
        component: AdminMainPage,
        meta: { requiresAuth: true }, // 인증이 필요한 페이지
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 라우터 가드: 인증이 필요한 페이지는 로그인되어 있지 않으면 /admin-login으로 리다이렉트
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('jwtToken'); // JWT 토큰 확인

    if (to.meta.requiresAuth && !isAuthenticated) {
        // 인증이 필요한 페이지에 접근하려면 로그인 되어야 함
        next('/admin-login');
    } else {
        next();
    }
});

export default router;
