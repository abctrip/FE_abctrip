<template>
  <footer class="sticky-footer bg-dark text-white py-4 mt-auto">
    <div class="container-fluid px-3 px-md-5">
      <!-- Flexbox를 사용해 이미지와 내용을 나란히 배치 -->
      <div class="d-flex align-items-center mb-3">
        <!-- 이미지 (왼쪽) -->
        <img src="@/assets/abc-logo.png" alt="ABC TRIP" class="footer-logo" />
        <!-- 텍스트 (이미지 바로 옆) -->
        <div class="footer-text ms-3">
  <div class="footer-links">
    <a href="#" class="text-light opacity-80 hover:opacity-100 transition-opacity">이용약관</a>
    &nbsp; | &nbsp;
    <a href="#" class="text-light opacity-80 hover:opacity-100 transition-opacity">개인정보처리방침</a>
  </div>
  <p class="text-light small mt-2 mb-2">
    본 사이트의 콘텐츠는 저작권법의 보호를 받는 바 무단 전재, 복사, 배포 등을 금합니다.
  </p>
  <p class="text-light small mb-2">
    Developer: <span class="developer-names">김성민, 곽희섭  </span>
    &nbsp; | &nbsp;
    <span class="developer-names">Tel. 010-0000-0000</span>
  </p>
  <p class="text-light small mb-0">
    Copyright © ABC TRIP All Rights Reserved.
  </p>
</div>

      </div>
    </div>
  </footer>
</template>

<style scoped>
.sticky-footer {
  position: relative;
  background-color: #2b2b2b !important;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.footer-logo {
  height: 60px;
  width: auto;
  margin-right: 30px;
}

.footer-text {
  text-align: left; /* 왼쪽 정렬 */
}

.footer-links a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: #fff;
}

.text-light {
  color: rgba(255, 255, 255, 0.8) !important;
}

.ms-3 {
  margin-left: 1rem; /* 이미지와 텍스트 사이 간격 */
}

@media (max-width: 767px) {
  .sticky-footer {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .footer-logo {
    margin-bottom: 1rem;
  }
}
</style>
