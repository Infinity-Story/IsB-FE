<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">관리자 로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="adminUsername">아이디</label>
          <input type="text" id="adminUsername" v-model="adminUsername" placeholder="아이디를 입력하세요" required />
        </div>
        <div class="input-group">
          <label for="adminPassword">비밀번호</label>
          <input type="password" id="adminPassword" v-model="adminPassword" placeholder="비밀번호를 입력하세요" required />
        </div>
        <button type="submit" class="login-btn">로그인</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      adminUsername: '',
      adminPassword: '',
    };
  },
  methods: {
    handleLogin() {
      // 관리자 로그인 로직 처리
      console.log('아이디:', this.adminUsername);
      console.log('비밀번호:', this.adminPassword);
      // 이후 API 요청이나 로직 추가
    },
  },
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
