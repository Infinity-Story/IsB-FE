<template>
  <div class="profile-container">
    <h2>프로필 정보</h2>

    <div class="profile-image">
      <img :src="`http://localhost:5000/profile/image/${user.profileImage}`" alt="Profile Image" />
    </div>

    <label>이름</label>
    <input v-model="user.name" type="text" disabled />

    <label>가입일</label>
    <input v-model="user.enrollDate" type="text" disabled />

    <label>이메일</label>
    <input v-model="user.email" type="email" disabled />

    <label>전화번호</label>
    <input v-model="user.phone" type="text" disabled />

    <button @click="goToModifyProfile">프로필 수정</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const user = ref({
  name: '',
  enrollDate: '',
  email: '',
  phone: '',
  profileImage: '',
});

const fetchUserProfile = async () => {
  try {
    let userInfoUrl = '';
    if (route.params.memberId) {
      userInfoUrl = `http://localhost:5000/user/member/${route.params.memberId}`;
    }
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

    console.log('회원 정보:', response.data);

    // 받아온 데이터에서 각 필드를 user 객체의 필드에 할당
    if (response.data) {
      // 조건에 따라 필드를 다르게 매핑
      if (route.params.memberId) {
        // member일 때
        user.value.name = response.data.memberName || '';  // memberName
        user.value.enrollDate = response.data.memberEnrollDate || '';  // memberEnrollDate
        user.value.email = response.data.memberEmail || '';  // memberEmail
        user.value.phone = response.data.memberPhone || '';  // memberPhone
        user.value.profileImage = response.data.profileImage || '/default-profile.png';  // member의 profileImage
      } else if (route.params.adminId) {
        // admin일 때
        user.value.name = response.data.adminName || '';  // adminName
        user.value.enrollDate = response.data.adminEnrollDate || '';  // adminEnrollDate
        user.value.email = response.data.adminEmail || '';  // adminEmail
        user.value.phone = response.data.adminPhone || '';  // adminPhone
        user.value.profileImage = response.data.profileImage || '/default-profile.png';  // admin의 profileImage
      }
    }

  } catch (error) {
    console.error('회원 정보 불러오기 실패:', error);
  }
};

const goToModifyProfile = () => {
  if (route.params.memberId) {
    router.push({ name: 'modifyProfileMember', params: { memberId: route.params.memberId } });
  } else if (route.params.adminId) {
    router.push({ name: 'modifyProfileAdmin', params: { adminId: route.params.adminId } });
  }
};

onMounted(() => {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error('JWT 토큰이 없습니다.');
    return;
  }

  const storedAdminId = localStorage.getItem('adminId');
  const storedMemberId = localStorage.getItem('memberId');
  const userType = localStorage.getItem('userType');

  let userInfoUrl = '';
  if (userType === 'ROLE_MEMBER' && storedMemberId) {
    userInfoUrl = `http://localhost:5000/user/member/${storedMemberId}`;
  } else if (userType === 'ROLE_ADMIN' && storedAdminId) {
    userInfoUrl = `http://localhost:5000/user/admin/${storedAdminId}`;
  }

  if (userInfoUrl) {
    axios.get(userInfoUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
        .then(response => {
          const data = response.data;
          if (userType === 'ROLE_MEMBER') {
            user.value.name = data.memberName || '';
            user.value.enrollDate = data.memberEnrollDate || '';
            user.value.email = data.memberEmail || '';
            user.value.phone = data.memberPhone || '';
            user.value.profileImage = data.profileImage || '/default-profile.png';
          } else if (userType === 'ROLE_ADMIN') {
            user.value.name = data.adminName || '';
            user.value.enrollDate = data.adminEnrollDate || '';
            user.value.email = data.adminEmail || '';
            user.value.phone = data.adminPhone || '';
            user.value.profileImage = data.profileImage || '/default-profile.png';
          }
        })
        .catch(error => {
          console.error('회원 정보 불러오기 실패:', error);
        });
  }
});
</script>

<style scoped>
.profile-container {
  width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  text-align: center;
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

.profile-image {
  margin: 20px auto; /* 이미지 여백 */
  width: 150px; /* 이미지 크기 */
  height: 150px; /* 이미지 크기 */
  border-radius: 50%; /* 원형 틀 만들기 */
  overflow: hidden; /* 넘치는 부분 잘라내기 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image img {
  width: 100%; /* 이미지가 컨테이너에 맞게 꽉 차도록 */
  height: 100%; /* 이미지가 컨테이너에 맞게 꽉 차도록 */
  object-fit: cover; /* 이미지 비율 유지하며 잘리도록 */
  border-radius: 50%; /* 이미지도 원형으로 만들기 */
}
button {
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 30%;
}

</style>
