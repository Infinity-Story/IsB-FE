<template>
  <div class="signup-container">
    <div class="title-section">
      <h1 class="main-title">회원가입</h1>
      <p class="sub-title">회원 정보를 입력하세요</p>
    </div>

    <form @submit.prevent="handleSubmit" class="signup-form">
      <div class="input-group">
        <label for="memberId">아이디</label>
        <div class="input-with-btn">
          <input type="text" id="memberId" v-model="memberId" required />
          <button type="button" @click="checkId" class="check-id-btn">중복 검사</button>
        </div>
        <!-- 아이디 중복 결과 메시지 -->
        <p v-if="idMessage" :class="isIdValid ? 'valid-id' : 'error-msg'">{{ idMessage }}</p>
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
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const router = useRouter(); // useRouter 훅을 사용하여 라우터 인스턴스 가져오기

const memberId = ref('');
const memberPw = ref('');
const memberName = ref('');
const memberEmail = ref('');
const memberPhone = ref('');
const idMessage = ref(''); // 아이디 중복 메시지
const isIdValid = ref(false); // 아이디 유효성 여부

const checkId = async () => {
  try {
    const response = await fetch(`http://localhost:5000/member/check-id?memberId=${memberId.value}`);

    if (response.ok) {
      const message = await response.text();
      idMessage.value = message; // 사용 가능한 아이디 메시지
      isIdValid.value = true; // 아이디가 유효
    } else {
      const errorMessage = await response.text();
      idMessage.value = errorMessage; // 중복된 아이디 메시지
      isIdValid.value = false; // 아이디가 중복
    }
  } catch (error) {
    console.error(error);
    idMessage.value = '아이디 중복 확인 중 오류가 발생했습니다.'; // 오류 메시지
    isIdValid.value = false; // 오류 발생 시 유효하지 않음
  }
};

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

    const responseText = await response.text();
    let message;

    try {
      const data = JSON.parse(responseText);
      message = data.message;
    } catch {
      message = responseText;
    }

    // 성공 메시지 SweetAlert 사용
    Swal.fire({
      icon: 'success', // 성공 아이콘
      title: message || '회원가입이 완료되었습니다.',
      text: '로그인 페이지로 이동합니다.',
      confirmButtonText: '확인',
    }).then(() => {
      router.push('/user-login'); // 로그인 페이지로 이동
    });
  } catch (error) {
    console.error(error);

    // 실패 메시지 SweetAlert 사용
    Swal.fire({
      icon: 'error', // 에러 아이콘
      title: '회원가입 실패',
      text: '다시 시도해 주세요.',
      confirmButtonText: '확인',
    });
  }
};
</script>

<style scoped>
/* 전체 컨테이너 */
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9f9;
  min-height: 100vh;
}

/* 타이틀 섹션 */
.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 2.2rem;
  font-weight: 600;
  color: #007bff;
}

.sub-title {
  font-size: 1.1rem;
  color: #6c757d;
}

/* 폼 스타일 */
.signup-form {
  width: 100%;
  max-width: 350px;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 각 입력 그룹 스타일 */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 레이블 스타일 */
.input-group label {
  font-size: 0.95rem;
  color: #333;
}

/* 입력 필드 스타일 */
.input-group input {
  width: 90%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
  outline: none;
  transition: border-color 0.3s ease;
}

/* 입력 필드 포커스 스타일 */
.input-group input:focus {
  border-color: #007bff;
}

/* 아이디 중복 검사 버튼 */
.input-with-btn {
  gap: 10px; /* 버튼과 입력란 사이의 간격 */
}

.check-id-btn {
  padding: 8px 16px;
  font-size: 0.9rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  color: #555;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s, border-color 0.3s;
  width: 120px; /* 버튼의 고정된 너비 */
}

.check-id-btn:hover {
  background-color: #e6e6e6;
  border-color: #888;
}

/* 아이디 중복 검사 메시지 */
.valid-id {
  color: #4caf50;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 5px;
}

.error-msg {
  color: #d32f2f;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 5px;
}

/* 제출 버튼 스타일 */
.submit-btn {
  padding: 14px;
  font-size: 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #218838;
}

/* 폼 요소들 간의 여백 조정 */
.input-group input,
.submit-btn {
  margin-bottom: 15px;
}

</style>