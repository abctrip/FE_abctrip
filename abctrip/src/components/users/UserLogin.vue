<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/member";
import { useMenuStore } from "@/stores/menu";

const router = useRouter();
const memberStore = useMemberStore();
const menuStore = useMenuStore();

// store의 state와 actions 분리
const { isLogin, isLoginError, userInfo } = storeToRefs(memberStore);
const { userLogin, getUserInfo } = memberStore;
const { changeMenuState, setUserInfo } = menuStore;

// 로그인 폼 데이터
const loginUser = ref({
  userId: "",
  userPwd: "",
});

const saveIdChecked = ref(false); // 아이디 저장 체크

// 로컬 스토리지 관련 함수들을 별도로 분리
const storageUtils = {
  getSavedId: () => localStorage.getItem("savedUserId"),
  setSavedId: (id) => localStorage.setItem("savedUserId", id),
  removeSavedId: () => localStorage.removeItem("savedUserId"),
  setLoginState: () => {
    localStorage.setItem("isLogin", "true");
    window.dispatchEvent(new Event("storage"));
  },
};

// 사용자 정보 업데이트 로직 분리
const updateUserInfo = async (token) => {
  await getUserInfo(token);
  if (userInfo.value) {
    setUserInfo(userInfo.value.userName, userInfo.value.nickName);
    changeMenuState();
  }
};

onMounted(() => {
  const savedId = localStorage.getItem("savedUserId");
  if (savedId) {
    loginUser.value.userId = savedId;
    saveIdChecked.value = true;
  }
});

const login = async () => {
  await userLogin(loginUser.value);
  const token = sessionStorage.getItem("accessToken");

  if (!isLogin.value) return;

  // 로그인 성공 처리
  storageUtils.setLoginState();

  // 아이디 저장 처리
  if (saveIdChecked.value) {
    storageUtils.setSavedId(loginUser.value.userId);
  } else {
    storageUtils.removeSavedId();
  }

  await updateUserInfo(token);
  router.replace("/");
};
</script>

<template>
  <div class="container mt-5">
    <div class="card p-4 mx-auto" style="max-width: 500px">
      <!-- 헤더 섹션 -->
      <h2 class="mb-4 text-start">로그인</h2>
      <p class="text-muted mb-4 text-start">환영합니다.</p>

      <!-- 아이디 입력 그룹 -->
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <label for="userId" class="form-label text-start">아이디</label>
          <div class="form-check">
            <input
              id="saveId"
              class="form-check-input me-2"
              type="checkbox"
              v-model="saveIdChecked"
            />
            <label for="saveId" class="form-check-label">아이디저장</label>
          </div>
        </div>
        <input
          id="userId"
          type="text"
          class="form-control"
          v-model="loginUser.userId"
          autocomplete="username"
        />
      </div>

      <!-- 비밀번호 입력 그룹 -->
      <div class="mb-3">
        <label for="userPwd" class="form-label text-start d-block"
          >비밀번호</label
        >
        <input
          id="userPwd"
          type="password"
          class="form-control"
          v-model="loginUser.userPwd"
          @keyup.enter="login"
          autocomplete="current-password"
        />
      </div>

      <!-- 에러 메시지 -->
      <div class="alert alert-danger" v-if="isLoginError" role="alert">
        아이디 또는 비밀번호를 확인해 주세요
      </div>

      <!-- 로그인 버튼 -->
      <button @click="login" class="btn btn-dark w-100 mb-3">로그인</button>

      <!-- 회원가입 링크 -->
      <div class="text-center">
        <span class="text-muted">계정이 없으신가요? </span>
        <router-link
          :to="{ name: 'user-join' }"
          class="text-primary text-decoration-none"
          >회원가입</router-link
        >
      </div>

      <!-- 비밀번호 찾기 -->
      <div class="text-center">
        <span class="text-muted">비밀번호을 잊어버렸나요? </span>
        <router-link
          :to="{ name: 'user-password-reset' }"
          class="text-primary text-decoration-none"
          >비밀번호찾기</router-link
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
