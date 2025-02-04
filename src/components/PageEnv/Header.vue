<template>
  <header class="header">
    <div class="logo">ISB</div>
    <div v-if="isAuthenticated" class="profile-section">
      <img :src="userProfileImage" alt="프로필" class="profile-img" />
      <span class="username">{{ username }}</span>
      <button @click="logout" class="logout-btn">로그아웃</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(!!localStorage.getItem('jwtToken'));
const username = ref('');
const userProfileImage = ref('/default-profile.png'); // 기본 이미지

onMounted(() => {
  if (isAuthenticated.value) {
    username.value = localStorage.getItem('username') || '사용자';
    userProfileImage.value = localStorage.getItem('profileImage') || '/default-profile.png';
  }
});

const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  localStorage.removeItem('profileImage');
  isAuthenticated.value = false;
  router.push('/user-login');
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #ffffff;
  color: black;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid black;
}

.username {
  font-weight: bold;
}

.logout-btn {
  padding: 5px 10px;
  border: none;
  background: #ff4757;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #e84118;
}
</style>
