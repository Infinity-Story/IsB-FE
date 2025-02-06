<template>
  <div class="profile-container">
    <h2>프로필 정보</h2>

    <label>이름</label>
    <input v-model="member.memberName" type="text" disabled />

    <label>가입일</label>
    <input v-model="member.memberEnrollDate" type="text" disabled />

    <label>이메일</label>
    <input v-model="member.memberEmail" type="email" disabled />

    <label>전화번호</label>
    <input v-model="member.memberPhone" type="text" disabled />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  memberId: {
    type: String,
    required: true,
  },
});

const member = ref({
  memberName: '',
  memberEnrollDate: '',
  memberEmail: '',
  memberPhone: '',
});

const fetchMemberProfile = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/user/member/${props.memberId}`);
    member.value = response.data;
  } catch (error) {
    console.error('회원 정보 불러오기 실패:', error);
  }
};

onMounted(fetchMemberProfile);
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
