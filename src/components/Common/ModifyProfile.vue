<template>
  <div class="profile-container">
    <h2>프로필 수정</h2>

    <div class="profile-image">
      <label for="fileInput">
        <img :src="selectedImage ? selectedImage : `http://localhost:5000/profile/image/${user.profileImage}`" alt="Profile Image" />
        <div class="overlay">클릭하여 변경</div>
      </label>
      <input type="file" id="fileInput" @change="handleImageUpload" accept="image/*" hidden />
    </div>

    <label>이름</label>
    <input v-model="user.name" type="text" />

    <label>이메일</label>
    <input v-model="user.email" type="email" />

    <label>전화번호</label>
    <input v-model="user.phone" type="text" />

    <button @click="updateProfile">저장</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const user = ref({
  name: "",
  email: "",
  phone: "",
  profileImage: "",
  memberCode: "",
  adminCode: "",
});

const selectedImage = ref(null); // 선택한 이미지 미리보기

const fetchUserProfile = async () => {
  console.log('Route Params:', route.params);
  try {
    let userInfoUrl = "";
    if (route.params.memberId) {
      userInfoUrl = `http://localhost:5000/user/member/${route.params.memberId}`;
    } else if (route.params.adminId) {
      userInfoUrl = `http://localhost:5000/user/admin/${route.params.adminId}`;
    }

    const token = localStorage.getItem("jwtToken");
    const response = await axios.get(userInfoUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ 프로필 데이터 가져오기 성공:", response.data);

    if (response.data) {
      if (route.params.memberId) {
        user.value.name = response.data.memberName;
        user.value.email = response.data.memberEmail;
        user.value.phone = response.data.memberPhone;
        user.value.profileImage = response.data.profileImage || "default-profile.png";
        user.value.memberCode = response.data.memberCode;
      } else if (route.params.adminId) {
        user.value.name = response.data.adminName;
        user.value.email = response.data.adminEmail;
        user.value.phone = response.data.adminPhone;
        user.value.profileImage = response.data.profileImage || "default-profile.png";
        user.value.adminCode = response.data.adminCode;
      }
    }
  } catch (error) {
    console.error("❌ 회원 정보 불러오기 실패:", error.response?.status, error.response?.data);
    alert(`회원 정보 조회 실패: ${error.response?.status}`);
  }
};


// 이미지 선택 핸들러
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedImage.value = URL.createObjectURL(file);
  }
};

// 프로필 업데이트 (이미지 포함)
const updateProfile = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    let updateUserUrl = "";
    if (user.value.memberCode) {
      updateUserUrl = `http://localhost:5000/member/update/${user.value.memberCode}`;
    } else if (user.value.adminCode) {
      updateUserUrl = `http://localhost:5000/admin/update/${user.value.adminCode}`;
    }

    // 프로필 정보 업데이트
    const updatedData = user.value.memberCode
        ? {
          memberName: user.value.name || null,
          memberEmail: user.value.email || null,
          memberPhone: user.value.phone || null,
        }
        : {
          adminName: user.value.name || null,
          adminEmail: user.value.email || null,
          adminPhone: user.value.phone || null,
        };

    await axios.put(updateUserUrl, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 이미지 업로드
    if (selectedImage.value) {
      const formData = new FormData();
      formData.append("image", document.getElementById("fileInput").files[0]);

      if (user.value.memberCode) {
        formData.append("memberCode", user.value.memberCode);
      } else if (user.value.adminCode) {
        formData.append("adminCode", user.value.adminCode);
      }

      await axios.post("http://localhost:5000/profile/uploadImage", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    }

    alert("프로필이 수정되었습니다.");
    await fetchUserProfile(); // 수정된 프로필 정보를 바로 가져오기
    router.push(`/profile/${route.params.memberId || route.params.adminId}`); // 뒤로가기 대신 정확한 경로로 이동
  } catch (error) {
    console.error("프로필 수정 실패:", error);
    alert(`서버 오류: ${error.response?.status || "알 수 없는 오류"}`);
  }
};


onMounted(fetchUserProfile);
</script>

<style scoped>
/* 기존 Profile.vue와 통일 */
.profile-container {
  width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  text-align: center;
}

/* 프로필 이미지 스타일 */
.profile-image {
  margin: 20px auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* 이미지 변경 오버레이 */
.profile-image .overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 12px;
  text-align: center;
  line-height: 30px;
  border-radius: 0 0 50% 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-image:hover .overlay {
  opacity: 1;
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

/* 버튼 스타일 */
button {
  padding: 10px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 20%;
}

button:hover {
  background-color: #0056b3;
}
</style>
