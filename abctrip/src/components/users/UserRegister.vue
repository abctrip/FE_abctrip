<script setup>
import { ref } from "vue";
import { useMemberStore } from "@/stores/member";
import { useRouter } from "vue-router";

const memberStore = useMemberStore();
const router = useRouter();

const userInfo = ref({
  userName: "",
  nickName: "",
  userId: "",
  userPwd: "",
  pwdCheck: "",
  emailId: "",
  emailDomain: "",
});

// 아이디 중복 체크 상태
const isIdAvailable = ref(false);

// 이메일 도메인 관련 상태와 옵션
const isDomainEditable = ref(false);
const domainOptions = [
  { value: 'direct', label: '직접 입력' },
  { value: 'google.com', label: 'google.com' },
  { value: 'naver.com', label: 'naver.com' },
  { value: 'kakao.com', label: 'kakao.com' }
];

// 도메인 선택 핸들러
const handleDomainChange = (e) => {
  if (e.target.value === 'direct') {
    isDomainEditable.value = true;
    userInfo.value.emailDomain = '';  // 직접 입력을 위해 초기화
  } else {
    isDomainEditable.value = false;
    userInfo.value.emailDomain = e.target.value;
  }
};

// 아이디 중복 체크
const checkUserId = async () => {
  if (!userInfo.value.userId) {
    alert("아이디를 입력해주세요.");
    return;
  }

  const isDuplicate = await memberStore.checkDuplicateId(userInfo.value.userId);
  if (isDuplicate) {
    alert("이미 사용중인 아이디입니다.");
    userInfo.value.userId = "";
    isIdAvailable.value = false;
  } else {
    alert("사용 가능한 아이디입니다.");
    isIdAvailable.value = true;
  }
};

// 회원가입
const createAccount = async () => {
  if (!isIdAvailable.value) {
    alert("아이디 중복 체크를 해주세요.");
    return;
  }

  // store의 비밀번호 검증 로직 사용
  if (!memberStore.validatePassword(userInfo.value.userPwd, userInfo.value.pwdCheck)) {
    return;
  }

  if (!userInfo.value.emailId || !userInfo.value.emailDomain) {
    alert("이메일은 필수 입력항목입니다.");
    return;
  }

  await memberStore.userRegister(userInfo.value);
  router.push({ name: "user-login" });
};

// 입력값 초기화
const resetForm = () => {
  userInfo.value.userName = "";
  userInfo.value.nickName = "";
  userInfo.value.userId = "";
  userInfo.value.userPwd = "";
  userInfo.value.pwdCheck = "";
  userInfo.value.emailId = "";
  userInfo.value.emailDomain = "";
  isIdAvailable.value = false;
  
};
</script>

<template>
  <div class="container mt-5">
    <div class="card p-4 mx-auto" style="max-width: 500px">
      <h2 class="mb-4 text-start">회원가입</h2>
      <p class="text-muted mb-4 text-start">새로운 계정을 만들어보세요.</p>

      <div class="mb-3">
        <label class="form-label text-start d-block">이름</label>
        <input v-model="userInfo.userName" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label text-start d-block">닉네임</label>
        <input v-model="userInfo.nickName" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label text-start d-block">아이디</label>
        <div class="input-group">
          <input v-model="userInfo.userId" type="text" class="form-control" />
          <button @click="checkUserId" class="btn btn-outline-secondary">
            중복확인
          </button>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label text-start d-block">비밀번호</label>
        <input
          v-model="userInfo.userPwd"
          type="password"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label class="form-label text-start d-block">비밀번호확인</label>
        <input
          v-model="userInfo.pwdCheck"
          type="password"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label class="form-label text-start d-block">이메일</label>
        <div class="input-group">
          <input
            v-model="userInfo.emailId"
            type="text"
            class="form-control"
            placeholder="이메일아이디"
          />
          <span class="input-group-text">@</span>
          <select 
            v-model="userInfo.emailDomain" 
            @change="handleDomainChange"
            class="form-select"
          >
            <option value="">선택</option>
            <option v-for="option in domainOptions" 
                    :key="option.value" 
                    :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <input
            v-if="isDomainEditable"
            v-model="userInfo.emailDomain"
            type="text"
            class="form-control"
            placeholder="도메인 입력"
          />
        </div>
      </div>

      <button @click="createAccount" class="btn btn-dark w-100 mb-3">
        가입하기
      </button>
      <button @click="resetForm" class="btn btn-outline-dark w-100 mb-3">
        초기화
      </button>

      <div class="text-center">
        <span class="text-muted">이미 계정이 있으신가요? </span>
        <router-link
          :to="{ name: 'user-login' }"
          class="text-primary text-decoration-none"
          >로그인</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
