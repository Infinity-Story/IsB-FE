<!-- NoticeList.vue -->
<template>
  <div>
    <h1>공지사항</h1>
    <ul>
      <li v-for="item in posts" :key="item.id">
        <strong>{{ item.noticeTitle }}</strong>: {{ item.noticeContent }}
      </li>
    </ul>
  </div>
</template>

<script setup>
// 필요한 라이브러리 import
import axios from 'axios';
import { ref, onMounted } from 'vue';

// 데이터 정의
const posts = ref([]);

// API 호출
onMounted(() => {
  axios.get('http://localhost:5000/notice/list')  // 백엔드 API 주소
      .then(response => {
        posts.value = response.data;  // 받은 데이터로 posts 업데이트
      })
      .catch(error => {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
      });
});
</script>

<style scoped>
/* 스타일 추가 */
</style>
