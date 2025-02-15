import { createRouter, createWebHistory } from 'vue-router';
import NoticeList from '@/components/Notice/NoticeList.vue';
import MainLogin from "@/components/Login/MainLogin.vue";
import MemberLogin from "@/components/Login/MemberLogin.vue";
import AdminLogin from "@/components/Login/AdminLogin.vue";
import AdminMainPage from "@/components/Admin/AdminMainPage.vue";
import MemberMainPage from "@/components/Member/MemberMainPage.vue";
import MemberSignUpPage from "@/components/Login/MemberSignUpPage.vue";
import Profile from "@/components/Common/Profile.vue";
import ModifyProfile from "@/components/Common/ModifyProfile.vue"; // MemberSignUpPage 임포트 추가

const routes = [
    {
        path: '/',
        name: 'CommonLogin',
        component: MainLogin,
    },
    {
        path: '/notice/list',
        name: 'NoticeList',
        component: NoticeList,
    },
    {
        path: '/user-login',
        name: 'MemberLogin',
        component: MemberLogin,
    },
    {
        path: '/admin-login',
        name: 'AdminLogin',
        component: AdminLogin,
    },
    {
        path: '/admin-main',
        name: 'AdminMainPage',
        component: AdminMainPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/member-main',
        name: 'MemberMainPage',
        component: MemberMainPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/member-signup', // 회원가입 페이지 라우트 추가
        name: 'SignUp',
        component: MemberSignUpPage,
    },
    {
        path: '/profile/:memberId',
        name: 'profileMember',
        component: Profile,
        props: true,  // 이 옵션으로 파라미터를 props로 전달
        meta: { requiresAuth: true },
    },
    {
        path: '/profile/:adminId',
        name: 'profileAdmin',
        component: Profile,
        props: true,  // 이 옵션으로 파라미터를 props로 전달
        meta: { requiresAuth: true },
    },
    {
        path: '/modify-profile/member/:memberId',
        name: 'modifyProfileMember',
        component: ModifyProfile,
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: '/modify-profile/admin/:adminId',
        name: 'modifyProfileAdmin',
        component: ModifyProfile,
        props: true,
        meta: { requiresAuth: true },
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
        // admin-token 검증 로직 추가
        if (to.path === '/admin-main' && !isAuthenticated) {
            next('/admin-login'); // 인증되지 않은 경우 관리자 페이지로 리다이렉트
        } else {
            next();
        }
    }
});

export default router;