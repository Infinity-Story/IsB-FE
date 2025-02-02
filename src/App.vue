<template>
  <div id="app">
    <!-- 기본 페이지는 '/' 경로일 때만 "야스"가 보이고, 다른 페이지에서는 내용이 변경됨 -->
    <h1 v-if="$route.path === '/'"></h1>
    <router-view></router-view> <!-- 라우트된 컴포넌트를 여기에 표시 -->
  </div>
</template>

<script>
import MainLogin from "@/components/Login/MainLogin.vue";

export default {
  name: 'App',
  components: {
    MainLogin,
  }
};
</script>

<style scoped>
/* 스타일을 여기에 추가할 수 있습니다. */
</style>
