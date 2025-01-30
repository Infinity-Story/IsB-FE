<template>
  <div class="home-container">
    <div class="title-section">
      <h1 class="main-title">환영합니다!</h1>
      <p class="sub-title">원하는 로그인 유형을 선택하세요</p>
    </div>

    <div class="button-container">
      <router-link to="/admin-login">
        <button class="login-button admin-btn">관리자 로그인</button>
      </router-link>

      <router-link to="/user-login">
        <button class="login-button user-btn">일반 회원 로그인</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #FFFFFF;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.title-section {
  text-align: center;
  margin-bottom: 30px;
}

.main-title {
  font-size: 3rem;
  font-weight: 600;
  color: #007bff;
  margin: 0;
}

.sub-title {
  font-size: 1.25rem;
  color: #6c757d;
}

.button-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.login-button {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 200px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.login-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.admin-btn {
  background-color: #adb5bd;
  color: white;
}

.admin-btn:hover {
  background-color: #868e96;
}

.user-btn {
  background-color: #f0a500;
  color: #fff;
}

.user-btn:hover {
  background-color: #e59400;
}

</style>
