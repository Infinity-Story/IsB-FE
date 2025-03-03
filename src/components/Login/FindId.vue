<template>
  <div class="find-id-container">
    <div class="find-id-card">
      <h2>아이디 찾기</h2>
      <form @submit.prevent="handleFindId">
        <div class="input-group">
          <label for="email">이메일</label>
          <input
              type="email"
              id="memberEmail"
              v-model="memberEmail"
              placeholder="이메일을 입력하세요"
              required
          />
          <button type="button" @click="sendVerificationCode">인증번호 전송</button>
        </div>
        <div class="input-group">
          <label for="verificationCode">인증번호</label>
          <input
              type="text"
              id="verificationCode"
              v-model="verificationCode"
              placeholder="인증번호를 입력하세요"
              required
          />
        </div>
        <button type="submit" class="find-id-btn">아이디 찾기</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const memberEmail = ref('');
const verificationCode = ref('');
const router = useRouter();

// 인증번호 전송 함수
const sendVerificationCode = async () => {
  try {
    const params = new URLSearchParams();
    params.append('memberEmail', memberEmail.value);  // email 파라미터 이름을 정확히 맞추기

    const response = await fetch('http://localhost:5000/member/request-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('인증번호 전송 실패');
    }

    alert('인증번호가 이메일로 전송되었습니다.');
  } catch (error) {
    alert('인증번호 전송 실패: ' + error.message);
    console.error(error);
  }
};

const handleFindId = async () => {
  console.log(memberEmail.value, verificationCode.value);  // 값 확인

  // 인증번호에서 공백을 제거하고 숫자만 남기기
  const cleanedVerificationCode = verificationCode.value.replace(/\s+/g, '').replace(/\D/g, '');

  try {
    const params = new URLSearchParams();
    params.append('memberEmail', memberEmail.value);
    params.append('verificationCode', cleanedVerificationCode);  // 수정된 값 전송

    const response = await fetch('http://localhost:5000/member/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      throw new Error('아이디 찾기 실패');
    }

    const data = await response.text();  // 응답을 텍스트로 처리
    alert('아이디: ' + data); // 아이디를 화면에 표시

    router.push('/user-login'); // 로그인 페이지로 리다이렉트
  } catch (error) {
    alert('아이디 찾기 실패: ' + error.message);
    console.error(error);
  }
};


</script>

<style scoped>
/* 스타일을 간단하게 추가해서 확인 */
.find-id-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.find-id-card {
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
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
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.find-id-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>