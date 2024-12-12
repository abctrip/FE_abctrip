<script setup>
import { ref } from 'vue';
import { sendChatMessage } from '@/api/perplexity';

const userInput = ref('');
const messages = ref([]);
const isLoading = ref(false);
const isOpen = ref(false);

const handleMessage = () => {
  if (!userInput.value.trim()) return;

  messages.value.push({
    role: 'user',
    content: userInput.value
  });

  isLoading.value = true;

  sendChatMessage(messages.value,
    (response) => {
      messages.value.push({
        role: 'assistant',
        content: response.data.choices[0].message.content
      });
      userInput.value = '';
      isLoading.value = false;
    },
    (error) => {
      console.error('API 요청 실패:', error);
      isLoading.value = false;
    }
  );
};

</script>

<template>
  <div class="container-fluid py-0 mb-3">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- 토글 버튼 -->
          <div class="d-flex justify-content-center mb-4">
            <button 
              class="btn d-flex align-items-center gap-3 rounded-pill px-5 py-2 fs-5"
              style="background-color: rgba(62, 84, 172, 0.08); color: #344767; box-shadow: 0 2px 6px rgba(0,0,0,0.03);"
              @click="isOpen = !isOpen"
              type="button"
              :aria-expanded="isOpen"
              aria-controls="aiSearchCollapse"
            >
              <i class="bi bi-robot"></i>
              AI로 관광지 검색하기
              <i class="bi" :class="isOpen ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </button>
          </div>

          <!-- AI 채팅 컨테이너 -->
          <div class="collapse mb-5" :class="{ 'show': isOpen }" id="aiSearchCollapse">
            <div class="card border-2 shadow-sm">
              <!-- 메시지 영역 -->
              <div class="card-body overflow-auto p-4" style="height: 250px;" ref="messageContainer">
                <div v-for="(message, index) in messages" :key="index" class="mb-4">
                  <div 
                    class="d-flex"
                    :class="message.role === 'user' ? 'justify-content-end' : 'justify-content-start'"
                  >
                    <div 
                      class="rounded-3 p-3"
                      :class="message.role === 'user' ? 'bg-primary bg-opacity-10 text-dark' : 'bg-secondary bg-opacity-10'"
                      style="max-width: 80%;"
                    >
                      <div class="small mb-1">
                        <span class="badge" :class="message.role === 'user' ? 'bg-primary bg-opacity-25' : 'bg-secondary bg-opacity-25'">
                          {{ message.role === 'user' ? 'MY QUESTION' : 'ABC TRIP' }}
                        </span>
                      </div>
                      <div class="text-break">{{ message.content }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 입력 영역 -->
              <div class="card-footer border-0 bg-white p-3">
                <div class="input-group">
                  <textarea
                    v-model="userInput"
                    @keyup.enter="handleMessage"
                    class="form-control border-end-0"
                    rows="2"
                    placeholder="여행에 대해 무엇이든 물어보세요..."
                  ></textarea>
                  <button
                    @click="handleMessage"
                    :disabled="isLoading"
                    class="btn btn-primary d-flex align-items-center"
                    type="button"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="bi bi-send">검색하기</i>
                  </button>
                </div>

                <!-- 에러 메시지 -->
                <div 
                  v-if="error" 
                  class="alert alert-danger alert-dismissible fade show mt-3 mb-0 py-2 px-3"
                  role="alert"
                >
                  <small>{{ error }}</small>
                  <button type="button" class="btn-close p-2" @click="error = ''"></button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 최소한의 커스텀 스타일만 유지 */
.form-control:focus {
  box-shadow: none;
  border-color: #dee2e6;
}

.btn-close {
  font-size: 0.75rem;
}

/* collapse 애니메이션 */
.collapse {
  transition: all 0.3s ease;
}
</style>
