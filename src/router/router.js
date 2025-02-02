import { createRouter, createWebHistory } from 'vue-router';
import NoticeList from '@/components/Notice/NoticeList.vue';
import MainLogin from "@/components/Login/MainLogin.vue";
import MemberLogin from "@/components/Login/MemberLogin.vue"; // 일반 회원 로그인
import AdminLogin from "@/components/Login/AdminLogin.vue";
import AdminMainPage from "@/components/Admin/AdminMainPage.vue"; // 관리자 메인 페이지
import MemberMainPage from "@/components/Member/MemberMainPage.vue"; // 일반 회원 메인 페이지

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
        component: MemberLogin, // 회원 로그인 페이지
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
        meta: { requiresAuth: true },
    },
    {
        path: '/member-main',
        name: '회원 메인 페이지',
        component: MemberMainPage, // 회원 메인 페이지 추가
        meta: { requiresAuth: true }, // 인증이 필요한 페이지
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 라우터 가드: 인증이 필요한 페이지는 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('jwtToken'); // JWT 토큰 확인

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/user-login'); // 인증되지 않은 사용자 로그인 페이지로 리다이렉트
    } else {
        next();
    }
});

export default router;
