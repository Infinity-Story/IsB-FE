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
const adminId = ref('');
const userType = ref('');

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.error('JWT 토큰이 없습니다.');
      logout();
      return;
    }

    // 사용자 정보 가져오기
    const userResponse = await axios.get('http://localhost:5000/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    username.value = userResponse.data.username;

    if (!username.value) {
      console.error('❌ username을 가져올 수 없습니다.');
      logout();
      return;
    }

    localStorage.setItem('username', username.value);

    // 사용자 역할 확인 (Member or Admin)
    const roleResponse = await axios.get('http://localhost:5000/user/role', {
      headers: { Authorization: `Bearer ${token}` },
    });

    userType.value = roleResponse.data.role;

    if (!userType.value) {
      console.error('❌ userType을 가져올 수 없습니다.');
      logout();
      return;
    }

    localStorage.setItem('userType', userType.value);

    // 역할에 따라 사용자 정보 API 호출
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

    const profileImage = userInfoResponse.data.profileImage;
    if (profileImage) {
      userProfileImage.value = `http://localhost:5000/profile/image/${profileImage}`;
    } else {
      userProfileImage.value = '/default-profile.png';
    }

    // memberId 또는 adminId 저장
    if (userType.value === 'ROLE_MEMBER') {
      memberId.value = userInfoResponse.data.memberId;
    } else if (userType.value === 'ROLE_ADMIN') {
      adminId.value = userInfoResponse.data.adminId;  // adminId 저장
    }

    localStorage.setItem('profileImage', userProfileImage.value);
    localStorage.setItem('memberId', memberId.value);
    localStorage.setItem('adminId', adminId.value);  // adminId 저장

  } catch (error) {
    console.error('🚨 사용자 정보 로드 실패:', error);
    logout();
  }
};

const goToProfile = () => {
  if (userType.value === 'ROLE_MEMBER' && memberId.value) {
    router.push({ name: 'profileMember', params: { memberId: memberId.value } });
  } else if (userType.value === 'ROLE_ADMIN' && adminId.value) {
    router.push({ name: 'profileAdmin', params: { adminId: adminId.value } });
  } else {
    console.error('ID가 없습니다.');
  }
};

const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  localStorage.removeItem('profileImage');
  localStorage.removeItem('userType');
  localStorage.removeItem('memberId');
  localStorage.removeItem('adminId');  // adminId도 삭제
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
