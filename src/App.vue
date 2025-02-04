<template>
  <div id="app">
    <Header v-if="$route.meta.requiresAuth" />
    <router-view></router-view>
    <Footer v-if="$route.meta.requiresAuth" />
  </div>
</template>

<script>
import Header from "@/components/PageEnv/Header.vue";
import Footer from "@/components/PageEnv/Footer.vue";

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
};
</script>

<style>
/* 앱 전체 스타일 */
</style>
