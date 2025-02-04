<template>
  <div class="signup-container">
    <div class="title-section">
      <h1 class="main-title">회원가입</h1>
      <p class="sub-title">회원 정보를 입력하세요</p>
    </div>

    <form @submit.prevent="handleSubmit" class="signup-form">
      <div class="input-group">
        <label for="memberId">아이디</label>
        <input type="text" id="memberId" v-model="memberId" required />
      </div>

      <div class="input-group">
        <label for="memberPw">비밀번호</label>
        <input type="password" id="memberPw" v-model="memberPw" required />
      </div>

      <div class="input-group">
        <label for="memberName">이름</label>
        <input type="text" id="memberName" v-model="memberName" required />
      </div>

      <div class="input-group">
        <label for="memberEmail">이메일</label>
        <input type="email" id="memberEmail" v-model="memberEmail" required />
      </div>

      <div class="input-group">
        <label for="memberPhone">전화번호</label>
        <input type="text" id="memberPhone" v-model="memberPhone" required />
      </div>

      <button type="submit" class="submit-btn">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // vue-router 사용

const router = useRouter(); // useRouter 훅을 사용하여 라우터 인스턴스 가져오기

const memberId = ref('');
const memberPw = ref('');
const memberName = ref('');
const memberEmail = ref('');
const memberPhone = ref('');

const handleSubmit = async () => {
  const member = {
    memberId: memberId.value,
    memberPw: memberPw.value,
    memberName: memberName.value,
    memberEmail: memberEmail.value,
    memberPhone: memberPhone.value,
  };

  try {
    const response = await fetch('http://localhost:5000/member/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });

    if (!response.ok) {
      throw new Error('회원 가입 실패');
    }

    // JSON이 아닌 경우 대비해서 text로 받아서 처리
    const responseText = await response.text();
    try {
      // JSON 형식이라면 파싱
      const data = JSON.parse(responseText);
      alert(data.message);
    } catch {
      // JSON이 아니라면 그대로 출력
      alert(responseText);
    }

    // 회원가입 후 페이지 이동
    router.push('/member-main');
  } catch (error) {
    console.error(error);
    alert('회원가입 중 오류가 발생했습니다.');
  }
};


</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #ffffff;
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  font-size: 2rem;
  font-weight: 600;
  color: #007bff;
}

.sub-title {
  font-size: 1rem;
  color: #6c757d;
}

.signup-form {
  width: 100%;
  max-width: 350px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  max-width: 300px; /* 입력 필드 길이 조정 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: block;
  margin: 0 auto; /* 중앙 정렬 */
}

.submit-btn {
  width: 30%;
  max-width: 300px; /* 버튼 길이 조정 */
  padding: 12px;
  font-size: 1rem; /* 버튼 크기 조정 */
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: block;
  margin: 10px auto 0; /* 중앙 정렬 */
}

.submit-btn:hover {
  background-color: #218838;
}
</style>