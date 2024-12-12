<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useMemberStore } from '@/stores/member';
import { useRouter } from "vue-router"

// store & router 초기화
const memberStore = useMemberStore();
const router = useRouter();
const { userInfo } = storeToRefs(memberStore);

// 폼 데이터
const form = ref ({
  newPwd: '',
  confirmPwd: '',
  emailId: '',
  emailDomain: '',
  nickName: ''
})
const createdAt = ref('');
const showModal = ref(false);

// 초기 데이터 로드
const loadData = async () => {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return;

  form.value = {
    userPwd: '',
    confirmPwd: '',
    emailId: userInfo.value.emailId,
    emailDomain: userInfo.value.emailDomain,
    nickName: userInfo.value.nickName
  };
  createdAt.value = userInfo.value.createdAt;
}

// 정보 수정
const update = async () => {
  if (!memberStore.validatePassword(form.value.newPwd, form.value.confirmPwd)) return;

  const data = {
    userId: userInfo.value.userId,
    userPwd: form.value.newPwd,
    nickName: form.value.nickName,
    emailId: form.value.emailId,
    emailDomain: form.value.emailDomain,
    createAt: userInfo.value.createAt
  };

  await memberStore.userModify(data);
  // 개인정보 수정 후 토큰 값을 갱신해야 한다. (변경된 정보로 업데이트)
  await memberStore.getUserInfo(sessionStorage.getItem("accessToken")); 
  router.replace("/");
};


// 이메일 도메인 옵션
const domainOptions = [
  { value: 'direct', label: '직접 입력' },
  { value: 'google.com', label: 'google.com' },
  { value: 'naver.com', label: 'naver.com' },
  { value: 'kakao.com', label: 'kakao.com' }
];

// select가 '직접 입력'일 때 domain input이 편집 가능하도록
const isDomainEditable = ref(false);

const handleDomainChange = (e) => {
  if (e.target.value === 'direct') {
    isDomainEditable.value = true;
    form.value.emailDomain = '';  // 직접 입력을 위해 초기화
  } else {
    isDomainEditable.value = false;
    form.value.emailDomain = e.target.value;
  }
};

// 회원 관리
const user = {
  remove: async () => {
    await memberStore.userRemove(userInfo.value.userId);
    router.push("/");
  },
  showModal: () => showModal.value = true,
  hideModal: () => showModal.value = false,
  cancel: () => router.replace("/")
};

onMounted(loadData);

</script>

<template>
  <div class="container mt-5">
    <div class="card p-4 mx-auto" style="max-width: 800px;">
      <h2 class="mb-4 text-start">내 정보</h2>
      <p class="text-muted mb-4 text-start">회원 정보를 확인하고 수정하세요.</p>
 
      <!-- 기본 정보 -->
      <div class="mb-3">
        <label class="form-label text-start d-block">아이디</label>
        <input type="text" class="form-control" :value="userInfo.userId" readonly disabled/>
      </div>

      <div class="mb-3">
        <label class="form-label text-start d-block">이름</label>
        <input type="text" class="form-control" :value="userInfo.userName" readonly disabled/>
      </div>

      <div class="mb-3">
        <label class="form-label text-start d-block">닉네임</label>
        <input type="text" class="form-control" v-model="form.nickName"/>
      </div>

      <!-- 비밀번호 -->
      <div class="mb-3">
        <label class="form-label text-start d-block">새 비밀번호</label>
        <input type="password" class="form-control" v-model="form.newPwd" />
      </div>
 
      <div class="mb-3">
        <label class="form-label text-start d-block">비밀번호 확인</label>
        <input type="password" class="form-control" v-model="form.confirmPwd"/>
      </div>

      <!-- 가입일 -->
      <div class="mb-3">
        <label class="form-label text-start d-block">가입일</label>
        <input type="text" class="form-control" :value="createdAt" readonly disabled/>
      </div>
 
      <!-- 이메일 -->
      <div class="mb-4">
        <label class="form-label text-start d-block">이메일</label>
        <div class="input-group">
          <input type="text" class="form-control" v-model="form.emailId" placeholder="이메일 입력" />
          <span class="input-group-text">@</span>
          <input type="text" class="form-control" v-model="form.emailDomain" :readonly="!isDomainEditable" placeholder="도메인 입력"/>
          <select class="form-select" 
            :value="domainOptions.find(opt => opt.value === form.emailDomain)?.value || 'direct'"
            @change="handleDomainChange"
          >
            <option v-for="option in domainOptions"  :key="option.value"  :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="d-flex justify-content-between align-items-center mt-1">
        <button @click="user.showModal" class="btn btn-danger btn-sm">회원탈퇴</button>
        <div class="d-flex gap-2">
          <button @click="user.cancel" class="btn btn-outline-dark">취소</button>
          <button @click="update" class="btn btn-dark">정보 수정</button>
        </div>
      </div>
    </div>
  </div>
 
  <!-- 탈퇴 모달 -->
  <div v-if="showModal" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
       style="background: rgba(0, 0, 0, 0.7); z-index: 1050;">
    <div class="card p-4" style="max-width: 400px;">
      <h4 class="text-center mb-3">정말 계정을 삭제하시겠습니까?</h4>
      <p class="text-center text-muted mb-4">삭제된 계정은 복구할 수 없습니다.</p>
      <div class="d-flex gap-2">
        <button @click="user.remove" class="btn btn-danger flex-grow-1">삭제하기</button>
        <button @click="user.hideModal" class="btn btn-outline-secondary flex-grow-1">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
