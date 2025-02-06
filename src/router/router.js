import { createRouter, createWebHistory } from 'vue-router';
import NoticeList from '@/components/Notice/NoticeList.vue';
import MainLogin from "@/components/Login/MainLogin.vue";
import MemberLogin from "@/components/Login/MemberLogin.vue";
import AdminLogin from "@/components/Login/AdminLogin.vue";
import AdminMainPage from "@/components/Admin/AdminMainPage.vue";
import MemberMainPage from "@/components/Member/MemberMainPage.vue";
import MemberSignUpPage from "@/components/Login/MemberSignUpPage.vue";
import Profile from "@/components/Common/Profile.vue"; // MemberSignUpPage 임포트 추가

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
        component: MemberLogin,
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
        component: MemberMainPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/member-signup', // 회원가입 페이지 라우트 추가
        name: '회원가입 페이지',
        component: MemberSignUpPage,
    },
    {
        path: '/profile/:memberId',
        name: '프로필 설정 페이지',
        component: Profile,
        props: true,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('jwtToken');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/user-login');
    } else {
        next();
    }
});

export default router;