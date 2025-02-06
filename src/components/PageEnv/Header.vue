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
import axios from 'axios';

const router = useRouter();
const isAuthenticated = ref(!!localStorage.getItem('jwtToken'));
const username = ref('');
const userProfileImage = ref('/default-profile.png'); // 기본 이미지

// 페이지가 마운트될 때 실행
onMounted(() => {
  if (isAuthenticated.value) {
    fetchUserInfo();
  }
});

// 서버에서 사용자 정보 받아오는 함수
const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get('http://localhost:5000/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,  // Bearer 토큰 헤더로 전송
      }
    });
    username.value = response.data.username || '사용자';
    userProfileImage.value = '/default-profile.png'; // 프로필 이미지를 서버에서 제공하면 여기서 업데이트
    localStorage.setItem('username', username.value);
    localStorage.setItem('profileImage', userProfileImage.value);
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);
    // 사용자 정보 로드 실패 시 로그아웃 처리
    logout();
  }
};

// 로그아웃 처리 함수
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
