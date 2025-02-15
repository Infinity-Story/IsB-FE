<template>
  <header class="header">
    <div class="logo" @click="goToHome" style="cursor: pointer">ISB</div>
    <div v-if="isAuthenticated" class="profile-section">
      <img :src="userProfileImage" class="profile-img" />
      <span class="username">{{ username }}</span>
      <button @click="goToProfile" class="profile-btn">내 프로필</button>
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

    const userResponse = await axios.get('http://localhost:5000/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    username.value = userResponse.data.username;

    const roleResponse = await axios.get('http://localhost:5000/user/role', {
      headers: { Authorization: `Bearer ${token}` },
    });

    userType.value = roleResponse.data.role;
    localStorage.setItem('userType', userType.value);

    let userInfoUrl = '';
    if (userType.value === 'ROLE_MEMBER') {
      userInfoUrl = `http://localhost:5000/user/member/${username.value}`;
    } else if (userType.value === 'ROLE_ADMIN') {
      userInfoUrl = `http://localhost:5000/user/admin/${username.value}`;
    }

    const userInfoResponse = await axios.get(userInfoUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    userProfileImage.value = userInfoResponse.data.profileImage ? `http://localhost:5000/profile/image/${userInfoResponse.data.profileImage}` : '/default-profile.png';

    // memberId 또는 adminId 저장
    if (userType.value === 'ROLE_MEMBER') {
      memberId.value = userInfoResponse.data.memberId;
      localStorage.setItem('memberId', memberId.value);
    } else if (userType.value === 'ROLE_ADMIN') {
      adminId.value = userInfoResponse.data.adminId;
      localStorage.setItem('adminId', adminId.value);  // adminId 저장
    }

    localStorage.setItem('profileImage', userProfileImage.value);
    localStorage.setItem('username', username.value);


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
const goToHome = () => {
  if (userType.value === 'ROLE_MEMBER') {
    router.push({ name: 'MemberMainPage' });
  } else if (userType.value === 'ROLE_ADMIN') {
    router.push({ name: 'AdminMainPage' });
  } else {
    router.push('/'); // 기본적으로 로그인 페이지로 이동
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
  z-index: 10;
  margin-bottom: 40px;
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
