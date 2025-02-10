<template>
  <header class="header">
    <div class="logo">ISB</div>
    <div v-if="isAuthenticated" class="profile-section">
      <img :src="userProfileImage" class="profile-img" />
      <span class="username">{{ username }}</span>
      <button @click="goToProfile" class="profile-btn">프로필 설정</button>
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
const userProfileImage = ref('');
const memberId = ref('');

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get('http://localhost:5000/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('User info from /me:', response.data);

    // username 설정
    username.value = response.data.username || '사용자';
    localStorage.setItem('username', username.value);

    // 회원 정보를 통해 profileImage 값 설정
    const memberInfoResponse = await axios.get(`http://localhost:5000/user/member/${username.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    console.log('User info from /me:', memberInfoResponse.data);

    const profileImage = memberInfoResponse.data.profileImage;
    if (profileImage) {
      userProfileImage.value = `http://localhost:5000/profile/image/${profileImage}`;  // 서버에서 이미지 경로를 받아서 표시
    } else {
      userProfileImage.value = '/default-profile.png';  // 기본 이미지
    }

    console.log('profileImage:', profileImage);

    memberId.value = memberInfoResponse.data.memberId;  // memberId를 가져옴
    localStorage.setItem('profileImage', userProfileImage.value);  // 프로필 이미지도 로컬스토리지에 저장
  } catch (error) {
    console.error('사용자 정보 로드 실패:', error);
    logout();
  }
};

const goToProfile = () => {
  router.push(`/profile/${memberId.value}`);
};

const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  localStorage.removeItem('profileImage');
  isAuthenticated.value = false;
  router.push('/user-login');
};

// 페이지 로드 시, 사용자 정보를 가져옴
onMounted(() => {
  if (isAuthenticated.value) {
    fetchUserInfo();
  }
});
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
