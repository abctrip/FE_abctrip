<script setup>
import { ref } from 'vue'
import { useMemberStore } from '@/stores/member'
import { useRouter } from 'vue-router'

const memberStore = useMemberStore()
const email = ref('')
const loading = ref(false)
const router = useRouter();

const requestReset = async () => {
  loading.value = true
  await memberStore.requestPasswordReset(email.value)
  loading.value = false
}

const goToLogin = () => {
  router.push('/user/login');
};
</script>

<template>
  <div class="modal show d-flex align-items-center min-vh-100" tabindex="-1">
    <div class="modal-dialog mx-auto">
      <div class="modal-content p-4">
        <div class="modal-header border-0 pb-0 px-0">
          <h5 class="modal-title fw-bold">비밀번호 재설정</h5>
          <button type="button" class="btn-close" @click="goToLogin"></button>
        </div>
        <div class="modal-body pt-4 px-0">
          <form @submit.prevent="requestReset">
            <div class="mb-4">
              <label class="form-label">이메일 주소</label>
              <input type="email" class="form-control" v-model="email" required>
            </div>
            <div class="d-flex gap-3">
              <button type="button" class="btn btn-secondary" @click="goToLogin">취소</button>
              <button type="submit" class="btn btn-primary flex-grow-1" :disabled="loading">
                {{ loading ? '전송중...' : '재설정 링크 받기' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  width: 400px;
  margin: 0 auto;
}

.btn {
  padding: 8px 16px;
}

.btn-secondary {
 min-width: 80px;
}
</style>