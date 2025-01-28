<template>
  <div class="container">

    <div class="header" align="center"  style="padding-bottom: 30px;">
      <div style="  max-width: 1440px;justify-content: center;align-items: center;"  >
        <br>
        <div style="float: left" ><img src="@/assets/icon/공지사항.png" style="width: 18px"/>&nbsp;
          <span class="breadcrumb">공지사항</span>
        </div>
      </div>
    </div>

    <div class="product-sub-title"> * 조회할 상품의 조건을 선택 후
      <img src="@/assets/icon/reset.png">초기화 또는<img src="@/assets/icon/search.png">검색을 눌러주세요.
    </div>

    <div class="filter-section">
      <table class="filter-table">
        <tr>
          <td class="filter-label">공지 조회 조건</td>
          <td class="filter-input">
            <select class="filter-section" v-model="filterType"  style="width: 100px">
              <option disabled value="">선택</option>
              <option value="all" aria-checked="true">전체</option>
              <option value="content">내용</option>
              <option value="title">제목</option>
            </select>
            <input type="text" class="filter-input" placeholder="검색어를 입력해주세요." style="width: 300px" v-model="filterText" />
          </td>
        </tr>
        <tr>
          <td class="filter-label">등록일</td>
          <td colspan="3" class="filter-input">
            <input type="date" id="startDate" v-model="startDate" placeholder="시작 날짜 선택" title="시작 날짜 선택" />
            &nbsp;&nbsp;<span>~</span>&nbsp;
            <input type="date" id="endDate" v-model="endDate" placeholder="종료 날짜 선택" title="종료 날짜 선택" />
          </td>
        </tr>
      </table>

      <div class="filter-buttons">
        <button @click="resetFilters" class="reset-btn">
          <img src="@/assets/icon/reset.png" alt="Reset" />
        </button>
        <button @click="applyFilters" class="search-btn">
          <img src="@/assets/icon/search.png" alt="Search" />
        </button>
      </div>
    </div>
    <div class="filter-buttons">
      <div class="post-btn" id="app">
        <button style="float: right" class="btn-saveNotice"  @click="showRegisterForm">공지사항 등록</button>
      </div>
    </div>
    <!-- 공지사항 등록 팝업 -->
    <NoticeRegisterPopup
        v-if="isRegisterFormVisible"
        :notice="newNotice"
        @close="toggleRegisterForm"
        @submit="submitNotice"
    />

    <!-- 공지사항 수정 팝업 -->
    <NoticeEditPopup
        v-if="isEditFormVisible"
        :notice="selectedNotice"
        @close="toggleEditForm"
        @submit="submitNotice"
    />
    <!-- 오버레이 -->
    <div v-if="isRegisterFormVisible && isEditFormVisible" class="overlay"></div>
    <!-- 공지사항 목록 -->
    <div class="table-container">
      <table class="table">
        <thead>
        <tr class="header1">
          <td width="4%">No</td>
          <td width="25%">제목</td>
          <td>내용</td>
          <td width="10%">등록일</td>
          <td width="10%">관리</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in paginatedLists" :key="item.noticeCode"
            :id="'row-' + rowIndex"
            class="tr__bd"
        >
          <td class="num">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
          <td class="title" style="width: 20%" @click="showDetailNoticePopup(item)">{{ item.noticeTitle }}</td>
          <td style="width: 40%">{{ item.noticeContent }}</td>
          <td class="date">{{ item.noticeEnrollDate }}</td>
          <td style="">
            <button class="modify" @click="showEditForm(item)">수정</button>
            <button class="delete" @click="deleteNotice(item.noticeCode)">삭제</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- 공지사항 상세 정보 팝업 -->
    <NoticeDetailPopup v-if="viewPopup && selectedNotice" :notice="selectedNotice" @close="closeDetailPopup" />
    <!-- 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
    </div>
  </div>

</template>

<script setup>
import { ref, computed ,onMounted } from 'vue';
import NoticeDetailPopup from "@/components/Notice/NoticeDetailPopup.vue";
import NoticeRegisterPopup from "@/components/Notice/NoticeRegisterPopup.vue";
import NoticeEditPopup from "@/components/Notice/NoticeEditPopup.vue";
import Swal from 'sweetalert2'

const lists = ref([]);
const headers = ref([
  { label: 'No' },
  { key: 'noticeTitle', label: '공지사항 제목' },
  { key: 'noticeContent', label: '공지사항 내용' },
  { key: 'noticeEnrollDate', label: '등록일' },
]);

const filteredLists = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;
const getNotice = async () => {
  try {
    const response = await fetch('http://localhost:5000/notice/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('네트워크 오류 발생');
    }

    const data = await response.json();
    if (data.length > 0 ) {
      lists.value = data.sort((a,b) => new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate));
      filteredLists.value = lists.value;
    } else {
      lists.value = [];
      filteredLists.value = [];
    }
  } catch (error) {
    console.error('오류발생:', error);
  }
}

const filterType = ref('');
const filterText = ref('');
const startDate = ref('');
const endDate = ref('');

const applyFilters = () => {
  filteredLists.value = lists.value.filter(notice => {
    const matchesFilterType =
        filterType.value === '' ||
        (filterType.value === 'all' && notice.noticeTitle.includes(filterText.value) || notice.noticeContent.includes(filterText.value)) ||
        (filterType.value === 'title' && notice.noticeTitle.includes(filterText.value)) ||
        (filterType.value === 'content' && notice.noticeContent.includes(filterText.value));
    const matchesStartDate =
        !startDate.value || new Date(notice.noticeEnrollDate) >= new Date(startDate.value);
    const matchesEndDate =
        !endDate.value || new Date(notice.noticeEnrollDate) <= new Date(endDate.value);

    return matchesFilterType && matchesStartDate && matchesEndDate;
  });
  currentPage.value = 1; // 필터 적용 후 페이지를 첫 페이지로 설정
};
const paginatedLists = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredLists.value.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(filteredLists.value.length / itemsPerPage);
});
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
const resetFilters = () => {
  filterType.value = '';
  filterText.value = '';
  startDate.value = '';
  endDate.value = '';
  applyFilters(); // 필터 초기화 후 다시 필터 적용
};
const isRegisterFormVisible = ref(false);
const isEditFormVisible = ref(false);
const isDetailFormVisible = ref(false);

const newNotice = ref({ noticeTitle: '', noticeContent: '' });
const selectedNotice = ref(null);

const showRegisterForm = () => {
  isRegisterFormVisible.value = true;
  isEditFormVisible.value = false;
  newNotice.value = { noticeTitle: '', noticeContent: '' };
};

const showEditForm = (notice) => {
  isEditFormVisible.value = true;
  isRegisterFormVisible.value = false;
  selectedNotice.value = { ...notice };
};

const toggleRegisterForm = () => {
  isRegisterFormVisible.value = !isRegisterFormVisible.value;
};

const toggleEditForm = () => {
  isEditFormVisible.value = !isEditFormVisible.value;
};

const closeOverlay = () => {
  isRegisterFormVisible.value = false;
  isEditFormVisible.value = false;

};

// 새로운 공지사항을 등록하는 함수
const registerNotice = async (notice) => {
  try {
    console.log('전송 데이터:', notice);
    const response = await fetch('http://localhost:5000/notice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notice),
    });

    if (!response.ok) {
      throw new Error('공지사항 등록 실패');
    }

    const result = await response.json();
    console.log('서버 응답:', result);

    await Swal.fire({
      icon: 'success',
      title: '등록 성공',
      text: '공지사항이 성공적으로 등록되었습니다.',
    });

    getNotice(); // 공지사항 목록 새로고침
  } catch (error) {
    console.error('공지사항 등록 오류:', error);
    Swal.fire({
      icon: 'error',
      title: '등록 실패',
      text: error.message,
    });
  }
};


// 기존 공지사항을 수정하는 함수
const updateNotice = async (notice) => {
  try {
    const response = await fetch(`http://localhost:5000/notice/update/${notice.noticeCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notice),
    });

    if (!response.ok) {
      throw new Error('공지사항 수정 실패');
    }

    await Swal.fire({
      icon: 'success',
      title: '수정 성공',
      text: '공지사항이 성공적으로 수정되었습니다.',
    });

    // 공지사항 목록 새로고침
    getNotice();
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    await Swal.fire({
      icon: 'error',
      title: '수정 실패',
      text: error.message,
    });
  }
};

// 등록 및 수정 처리 로직을 나눈 submitNotice
const submitNotice = (notice) => {
  if (isEditFormVisible.value) {
    updateNotice(notice); // 수정 로직 호출
  } else {
    registerNotice(notice); // 등록 로직 호출
  }

  // 팝업 닫기
  toggleRegisterForm();
  toggleEditForm();
};

const showDetailNoticePopup = (item) => {
  selectedNotice.value = item;
  viewPopup.value = true;
};

const closeDetailPopup = () => {
  viewPopup.value = false;
};

const viewPopup = ref(false);

const sortedNotices = computed(() => {
  return notices.value.slice().sort((a, b) => {
    return new Date(b.noticeEnrollDate) - new Date(a.noticeEnrollDate);
  });
});

onMounted(() => {
  getNotice();
})
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
  max-width: 1440px;
  text-align: center;
  padding-bottom: 30px;
}

.header-content {
  display: flex;
  align-items: center;
}

.header-icon {
  width: 18px;
}

.breadcrumb {
  font-size: 16px;
  color: #555;
  font-weight: bold;
}

.product-sub-title {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  justify-content: flex-start;
  width: 100%;
  max-width: 1440px;
  padding-left: 10px;
}

.filter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
  max-width: 1440px;
}

.filter-table {
  border-collapse: collapse;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
}

.filter-table td {
  padding: 5px 10px;
}

.filter-label {
  border: solid 1px #747474;
}

.filter-label {
  font-weight: bold;
  text-align: center;
  border: solid 1px #747474;
  width: 120px;
  background-color: #d9d9d9;
}

.filter-input {
  text-align: left;
  border: solid 1px #747474;
  padding: 5px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 1440px;
}

.reset-btn,
.search-btn {
  background-color: #fff;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
}

.table th {
  font-weight: bold;
  color: #000;
  text-align: center;
}

.table th,
.table td {
  padding: 10px;
  text-align: center;
}

.header1 {
  background-color: #d9d9d9;
  font-weight: bold;
  height: 50px;
  font-size: 14px;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 100px;
}

.pagination button {
  background-color: #fff;
  color: black;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 14px;
  margin: 0 5px;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination span {
  margin: 0 10px;
  font-weight: bold;
}

.post-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
}

.postBtn {
  border: none;
  background-color: white;
  cursor: pointer;
}

.excelBtn {
  border: none;
  background-color: white;
  cursor: pointer;
}

.tr__bd:hover {
  background-color: #f2f2f2;
}

.tr__bd td {
  border-bottom: 1px solid #ddd;
  font-size: 12px;
}

.tr__bd:last-child td {
  border-bottom: none;
}

.table-container {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.table {
  width: 100%;
  max-width: 1440px;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-spacing: 0 10px;
  table-layout: fixed; /* 고정된 레이아웃을 사용하여 셀 너비를 고정 */
}

.table th, .table td {
  padding: 10px;
  text-align: center;
  white-space: nowrap; /* 텍스트 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 내용이 넘칠 때 "..." 표시 */
}

.product-sub-title {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  justify-content: flex-start;
}

.modify,
.delete {
  color: #ffffff;
  font-weight: bold;
  border-radius: 8px;
  border: 0;
  height: 25px;
  width: 45px;
}

.modify {
  background-color: #999999;
  margin-right: 10px;
}
.delete {
  background-color: #FC6F86;
}






.title {
  cursor: pointer;
}

/* 팝업 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

notice-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 700px; /* 팝업의 최대 너비 */
}

.notice-form h2 {
  margin-bottom: 16px;
}

.notice-form form div {
  margin-bottom: 12px;
}

.notice-form input,
.notice-form textarea {
  width: calc(100% - 20px); /* 팝업의 패딩 값 제외한 너비 */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.notice-form button {
  padding: 8px 12px;
  margin-right: 8px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.notice-form button[type="button"] {
  background: #6c757d;
}

.notice-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.button-container {
  display: flex;
  justify-content: center; /* 버튼을 왼쪽에 정렬 */
  align-items: center; /* 버튼을 수직 가운데에 정렬 */
  gap: 10px; /* 버튼 사이의 간격을 설정 */
}

.notice-btn-container{

  display: flex;
  justify-content: center; /* 버튼을 왼쪽에 정렬 */
  align-items: center; /* 버튼을 수직 가운데에 정렬 */
}

.btn-saveNotice {

  display: flex;
  position: relative;
  //left: 10px;
  height: 35px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  border-color: #344DAF;
  background-color: #344DAF;
  color: #ffffff;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0;
  margin-bottom: 10px;
  width: 115px;

}
</style>
