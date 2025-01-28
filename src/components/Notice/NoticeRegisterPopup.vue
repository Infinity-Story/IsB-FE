<template>
  <div class="notice-form">
    <div class="title">
      공지사항 등록
    </div>
    <div style="padding: 20px">
      <form @submit.prevent="submitForm">
        <div >
          <label class="noticeTitle" for="noticeTitle">제목</label><br><br>
          <input class="input-title" type="text" style="border: 1px solid" placeholder="공지사항 제목을 입력해주세요." v-model="noticeTitle" required/>
        </div>
        <br>
        <div>
          <label class="noticeContent" for="noticeContent">내용</label><br><br>
          <textarea class="text-area" style="resize: none; border: 1px solid" v-model="noticeContent" placeholder="공지사항 내용을 입력해주세요." required></textarea>
        </div>
        <br>
        <div style="float: right;" >
          <button class="regist-btn" type="submit">등록</button>
          <button class="close-btn" @click="closeForm">취소</button>
        </div>
      </form>
      <br><br>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import Swal from 'sweetalert2';

const emit = defineEmits(['close', 'submit']);

const noticeTitle = ref('');
const noticeContent = ref('');

const submitForm = () => {
  const notice = {
    noticeTitle: noticeTitle.value.trim(),
    noticeContent: noticeContent.value.trim(),
  };

  if (!notice.noticeTitle || !notice.noticeContent) {
    Swal.fire({
      icon: 'warning',
      title: '입력 오류',
      text: '모든 필드를 입력해주세요.',
    });
    return;
  }

  console.log('등록 데이터:', notice);
  emit('submit', notice);
};

const closeForm = () => {
  noticeTitle.value = '';
  noticeContent.value = '';
  emit('close');
};
</script>


<style scoped>
.input-title{
  width: 100%;
  border: 2px solid black;
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
  border: 1px solid #d9d9d9;
  max-width: 500px;
  width: 100%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
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
  background: #9a9a9a;
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
  border: 2px solid black;
}
.noticeTitle ,
.noticeContent {
  font-weight: bold;
}
</style>
