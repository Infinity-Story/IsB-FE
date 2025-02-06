<template>
  <div class="profile-container">
    <h2>프로필 수정</h2>
    <div class="profile-img-container">
      <img :src="profileImage" alt="프로필 이미지" class="profile-img" />
    </div>
    <input type="file" ref="fileInput" @change="handleFileChange" />
    <button @click="updateProfileImage" class="update-btn">프로필 사진 변경</button>
    <button @click="deleteProfileImage" class="delete-btn">프로필 사진 삭제</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const profileImage = ref('/default-profile.png');
const fileInput = ref(null);

onMounted(() => {
  fetchUserProfile();
});

// 사용자 프로필 정보 가져오기
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.get('http://localhost:5000/user/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    profileImage.value = response.data.profileImage || '/default-profile.png';
  } catch (error) {
    console.error('프로필 정보 가져오기 실패:', error);
  }
};

// 파일 선택 후 프로필 사진 변경
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('profileImage', file);
    updateProfileImage(formData);
  }
};

// 프로필 이미지 업데이트
const updateProfileImage = async (formData) => {
  try {
    const token = localStorage.getItem('jwtToken');
    const response = await axios.put('http://localhost:5000/user/profile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    profileImage.value = response.data.profileImage;
    localStorage.setItem('profileImage', profileImage.value);
  } catch (error) {
    console.error('프로필 이미지 업데이트 실패:', error);
  }
};

// 프로필 이미지 삭제
const deleteProfileImage = async () => {
  try {
    const token = localStorage.getItem('jwtToken');
    await axios.delete('http://localhost:5000/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    profileImage.value = '/default-profile.png';  // 기본 이미지로 변경
    localStorage.setItem('profileImage', profileImage.value);
  } catch (error) {
    console.error('프로필 이미지 삭제 실패:', error);
  }
};
</script>
