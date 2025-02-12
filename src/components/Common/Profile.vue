<template>
  <div class="profile-container">
    <h2>프로필 정보</h2>

    <label>이름</label>
    <input v-model="user.name" type="text" disabled />

    <label>가입일</label>
    <input v-model="user.enrollDate" type="text" disabled />

    <label>이메일</label>
    <input v-model="user.email" type="email" disabled />

    <label>전화번호</label>
    <input v-model="user.phone" type="text" disabled />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const userId = route.params.memberId || route.params.adminId;  // memberId 또는 adminId를 받아옴

const user = ref({
  name: '',
  enrollDate: '',
  email: '',
  phone: '',
});

const fetchUserProfile = async () => {
  try {
    let userInfoUrl = '';

    // memberId가 있는 경우
    if (route.params.memberId) {
      userInfoUrl = `http://localhost:5000/user/member/${route.params.memberId}`;
    }
    // adminId가 있는 경우
    else if (route.params.adminId) {
      userInfoUrl = `http://localhost:5000/user/admin/${route.params.adminId}`;
    }

    // JWT 토큰을 Authorization 헤더에 포함
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get(userInfoUrl, {
      headers: {
        Authorization: `Bearer ${token}`,  // 헤더에 토큰 포함
      },
    });

    // 받아온 데이터에서 각 필드를 user 객체의 필드에 할당
    if (response.data) {
      // 조건에 따라 필드를 다르게 매핑
      if (route.params.memberId) {
        // member일 때
        user.value.name = response.data.memberName || '';  // memberName
        user.value.enrollDate = response.data.memberEnrollDate || '';  // memberEnrollDate
        user.value.email = response.data.memberEmail || '';  // memberEmail
        user.value.phone = response.data.memberPhone || '';  // memberPhone
      } else if (route.params.adminId) {
        // admin일 때
        user.value.name = response.data.adminName || '';  // adminName
        user.value.enrollDate = response.data.adminEnrollDate || '';  // adminEnrollDate
        user.value.email = response.data.adminEmail || '';  // adminEmail
        user.value.phone = response.data.adminPhone || '';  // adminPhone
      }
    }

  } catch (error) {
    console.error('회원 정보 불러오기 실패:', error);
  }
};

onMounted(fetchUserProfile);
</script>



<style scoped>
.profile-container {
  width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
}

input {
  width: 80%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
}
</style>
