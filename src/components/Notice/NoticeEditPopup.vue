<template>
  <div class="notice-form" v-if="notice">
    <div class="title">
      공지사항 수정
    </div>
    <div style="padding: 20px">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="noticeTitle" style="font-weight: bold">제목</label><br><br>
          <input class="input-title" type="text" id="noticeTitle" v-model="notice.noticeTitle" required>
        </div>
        <br>
        <div class="form-group">
          <label for="noticeContent" style="font-weight: bold">내용</label><br><br>
          <textarea class="text-area" id="noticeContent" v-model="notice.noticeContent" required></textarea>
        </div>
        <div style="  float: right;" >
          <button class="regist-btn" type="submit">저장</button>
          <button type="submit" @click="closeForm" class="close-btn">취소</button>
        </div>
      </form>
      <br> <br>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

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

const emit = defineEmits(['close', 'submit']);

// v-model로 양방향 바인딩되는 noticeTitle과 noticeContent를 props.notice로 변경합니다.
// submitForm 함수도 변경하여 notice 객체를 이용합니다.
const submitForm = () => {
  emit('submit', props.notice);
};

// closeForm 함수는 변경하지 않습니다.
const closeForm = () => {
  emit('close');
};
</script>

<style scoped>
.edit-form {
  background: #444444;
  padding: 20px;
  border-radius: 10px;
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
  background: #d9d9d9;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.input-title{
  width: 100%;
  border: 1px solid #444444;
}

.title {
  background-color: #d9d9d9;
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  padding-left: 20px;
  border-radius: 10px;
}

.notice-form {
  background: #ffffff;
  border-radius: 10px;
  border-color: #d9d9d9;
  border: 1px solid;
  max-width: 500px;
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.close-btn {
  background: #9a9a9a;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}
.regist-btn {
  background: #FC6F86;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}
.text-area{
  width: 100%;
  height: 200px;
  border: 1px solid #444444;
  resize: none;
}

</style>
