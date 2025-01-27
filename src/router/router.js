import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/store.js';
import Swal from 'sweetalert2';

// const routes = [
//     {
//         path: '/',
//         name: '통합화면',
//         component: 통합창
//     }
// ]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;