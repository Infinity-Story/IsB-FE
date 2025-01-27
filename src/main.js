import { createApp } from 'vue';
import App from './App.vue';
import router from './router/router.js'; // router.js
import store from './store/store.js'; // store.js

const app = createApp(App);

app.use(router); // Vue Router 사용
app.use(store);  // Vuex Store 사용

app.mount('#app'); // id가 'app'인 요소에 마운트
