<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">관리자 로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="adminUsername">아이디</label>
          <input
              type="text"
              id="adminUsername"
              v-model="adminUsername"
              placeholder="아이디를 입력하세요"
              required
          />
        </div>
        <div class="input-group">
          <label for="adminPassword">비밀번호</label>
          <input
              type="password"
              id="adminPassword"
              v-model="adminPassword"
              placeholder="비밀번호를 입력하세요"
              required
          />
        </div>
        <button type="submit" class="login-btn">로그인</button>
      </form>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const adminUsername = ref('');
const adminPassword = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: adminUsername.value,
        password: adminPassword.value,
      }),
    });

    if (!response.ok) {
      throw new Error('로그인 실패');
    }

    const data = await response.json();
    const token = data.token;
    localStorage.setItem('jwtToken', token); // JWT 토큰 저장

    // 로그인 성공 시 AdminMainPage로 이동
    router.push('/admin-main');
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f5;
}

.login-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1.2rem;
}

.input-group label {
  display: block;
  font-size: 14px;
  margin-bottom: 0.5rem;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  border-color: #5c6bc0;
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #868e96; /* 관리자 로그인 버튼은 초록색 계열 */
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:active {
  background-color: #868e96;
}
</style>
