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
const userType = ref('');

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('JWT 토큰이 없습니다.');
      logout();
      return;
    }

    // 1️⃣ 현재 로그인한 사용자 정보 가져오기 (username)
    const userResponse = await axios.get('http://localhost:5000/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('🔹 /user/me 응답:', userResponse.data);
    username.value = userResponse.data.username;  // ref() 변수 사용

    if (!username.value) {
      console.error('❌ username을 가져올 수 없습니다.');
      logout();
      return;
    }

    localStorage.setItem('username', username.value);

    // 2️⃣ 사용자 역할(Role) 확인 (Member or Admin)
    const roleResponse = await axios.get('http://localhost:5000/user/role', {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('🔹 /user/role 응답:', roleResponse.data);
    userType.value = roleResponse.data.role; // ref() 변수 사용

    if (!userType.value) {
      console.error('❌ userType을 가져올 수 없습니다.');
      logout();
      return;
    }

    localStorage.setItem('userType', userType.value);

    // 3️⃣ userType에 따라 회원 정보 API 호출
    let userInfoUrl = '';
    if (userType.value === 'ROLE_MEMBER') {
      userInfoUrl = `http://localhost:5000/user/member/${username.value}`;
    } else if (userType.value === 'ROLE_ADMIN') {
      userInfoUrl = `http://localhost:5000/user/admin/${username.value}`;
    } else {
      console.error('❌ Invalid userType:', userType.value);
      return;
    }

    const userInfoResponse = await axios.get(userInfoUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('🔹 회원 상세 정보 응답:', userInfoResponse.data);

    // 4️⃣ 프로필 이미지 설정
    const profileImage = userInfoResponse.data.profileImage;
    if (profileImage) {
      userProfileImage.value = `http://localhost:5000/profile/image/${profileImage}`;
    } else {
      userProfileImage.value = '/default-profile.png';
    }

    console.log('🔹 프로필 이미지:', userProfileImage.value);

    // 5️⃣ memberId 또는 adminCode 저장 (각 역할별)
    if (userType.value === 'ROLE_MEMBER') {
      memberId.value = userInfoResponse.data.memberId;
    } else if (userType.value === 'ROLE_ADMIN') {
      memberId.value = userInfoResponse.data.adminCode;
    }

    localStorage.setItem('profileImage', userProfileImage.value);
    localStorage.setItem('memberId', memberId.value);

  } catch (error) {
    console.error('🚨 사용자 정보 로드 실패:', error);
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
  localStorage.removeItem('userType');
  localStorage.removeItem('memberId');
  isAuthenticated.value = false;
  router.push('/');
};

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
