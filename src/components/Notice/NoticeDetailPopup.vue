<template>
  <div class="overlay">
    <!-- 공지사항 상세 정보 팝업 -->
    <div class="notice-form">
      <div class="title" style="display: flex; justify-content: space-between; ">
        <h2 class="h2">공지사항 상세 정보</h2>
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>

      <div class="form-group">
        <div class="noticeTitle">제목</div>
        <div class="input-title">{{ notice.noticeTitle }}</div>
      </div>
      <br>
      <div>
        <div class="noticeContent">내용</div>
        <div class="text-area">{{ notice.noticeContent }}</div>
      </div>
      <div style="display: flex; gap: 30px;">
        <div>
          <div class="label">등록일 |  {{ notice.noticeEnrollDate }}</div>
        </div>
        <div>
          <div class="label">수정일 | {{ notice.noticeUpdateDate }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  notice: {
    type: Object,
    required: true,
    default: () => ({
      noticeTitle: '',
      noticeContent: '',
      noticeEnrollDate: [],
      noticeUpdateDate: []
    })
  }
});
</script>
<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}


.close-btn {
  background: #d9d9d9;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.input-title{
  width: 470px;
  height: 30px;
  margin-left: 10px;
  background-color: #d9d9d9;
  border-radius: 5px;
  padding-left: 10px;
  align-items: center;
  display: flex;
}

.h2 {
  display: flex;
  align-items: center;
  position: relative;
  top: 5px
}

.title {
  background-color: #d9d9d9;
  font-size: 12px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-bottom: 5px;
  border-radius: 5px;
  height: 40px;
}

.notice-form {
  background: #ffffff;
  //padding: 0px 10px 10px 10px;
  border-radius: 5px;
  border-color: #d9d9d9;
  border: 5px;
  max-width: 500px;
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001; /* 팝업 창이 가장 위에 오도록 z-index 조정 */
}

.close-btn {
  background: #9a9a9a;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  width: 15px;
  height: 15px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-right: 10px;
}


.text-area {
  width: 470px;
  height: 160px;
  margin-left: 10px;
  background-color: #d9d9d9;
  border-radius: 5px;
  padding-left: 10px;
  justify-content: flex-start;
  display: flex;
  padding-top: 8px;
}

.noticeTitle,
.noticeContent,
.label {
  margin-left: 18px;
  font-weight: bold;
}

.label {
  margin-top: 10px;
  margin-bottom: 8px;
  position: relative;
  left: 65px;
  font-size: 12px;
  color: #6c757d;
}


</style>