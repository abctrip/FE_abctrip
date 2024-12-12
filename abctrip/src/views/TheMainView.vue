<script setup>
import tripMainImg from '@/assets/trip_main.jpeg';
import travelImg from '@/assets/travel.jpg';
import foodImg from '@/assets/food.jpg';
import relaxImg from '@/assets/relax.jpg';
import { defineAsyncComponent } from 'vue';
import TheStatisticsView from './TheStatisticsView.vue';

const TheAiSearchView = defineAsyncComponent(() => 
  import("@/views/TheAiSearchView.vue")
);


</script>

<template>
  <div class="w-100 mx-auto">
    <!-- Hero Section -->
    <div class="position-relative d-flex align-items-center justify-content-center text-center text-white custom-height" 
         :style="{
           backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0)), url(${tripMainImg})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }">
      <div class="z-1 w-100 container">
        <div class="fs-5 mb-2">ABC Trip</div>
        <h1 class="display-3 fw-bold mb-2">The Journey Untold</h1>
        <div class="fs-4">Unforgettable moments, unexpected places</div>
      </div>
    </div>

    <!-- Main Content Section -->
    <div class="container py-5 text-center">
      <div class="mx-auto" style="max-width: 950px;">
        <p class="fs-5 text-secondary mb-5">
          ABC Trip은 여행을 알파벳 순서에 비유합니다. 우리의 여행은 a에서 b, 다시 c로 가는 일직선이 아닙니다. 가끔은 d로 뛰어넘기도 하고, 다시 b로 돌아오기도 하죠. 계획대로 흘러가지 않는 것이 진짜 여행의 묘미입니다.
        </p>
        <p class="fs-5 text-secondary mb-5">
          즉흥적인 모험, 자유로운 발걸음, 그리고 배낭 하나로 떠나는 길. ABC Trip은 여러분의 특별한 여정을 응원합니다. 정해진 루트를 벗어나 가슴이 이끄는 대로 새로운 경험을 만들어보세요.
        </p>
        <p class="fs-5 text-secondary mb-0">
          ABC Trip과 함께 알파벳 순서에 얽매이지 않는 자유로운 여행을 시작해보세요. 여러분의 여정이 a부터 z까지, 그리고 그 너머까지 이어지기를 바랍니다.
        </p>
      </div>
    </div>

    <!-- ai 검색창 !!!!!!!!!!!!!!!! -->
    <div>
      <component :is="TheAiSearchView" />
    </div>

    <div class="container mb-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 shadow-sm rounded-3 overflow-hidden transition-transform hover-lift">
            <div class="position-relative d-flex align-items-center justify-content-center h-300" 
                 :style="{
                   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${travelImg})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }">
              <div class="text-white fs-3 fw-bold text-shadow">Travel</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm rounded-3 overflow-hidden transition-transform hover-lift">
            <div class="position-relative d-flex align-items-center justify-content-center h-300"
                 :style="{
                   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${foodImg})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }">
              <div class="text-white fs-3 fw-bold text-shadow">Eat</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 shadow-sm rounded-3 overflow-hidden transition-transform hover-lift">
            <div class="position-relative d-flex align-items-center justify-content-center h-300"
                 :style="{
                   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${relaxImg})`,
                   backgroundSize: 'cover',
                   backgroundPosition: 'center'
                 }">
              <div class="text-white fs-3 fw-bold text-shadow">Relax</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mx-auto max-w-[1200px] px-5 py-16 md:px-6 lg:px-8">
      <div class="space-y-8">
        <!-- Category Tag -->
        <div class="text-sm text-blue-600">여행의 새로운 방식</div>

        <!-- Main Title -->
        <div class="space-y-4 mb-3">
          <h1 class="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Discover with ABC Trip:
          </h1>
          <h2 class="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            당신의 여행, 그 이상의 경험 
          </h2>
        </div>

         <!-- Description -->
         <div class="fs-5 lh-lg text-secondary">  <!-- mb-4 제거 -->
          <p class="mb-2">  <!-- 각 문단에 마진 추가 -->
            ABC Trip은 여행 애호가들을 위한 궁극의 온라인 플랫폼입니다. 우리는 여행의 모든 단계에서 여러분에게 최상의 경험을 제공하고자 합니다.  
          </p>
          <p class="mb-2">
            먼저, 자유로운 게시판에서 여행 노하우와 숨겨진 명소를 공유하세요. 익명으로 자유롭게 의견을 나누고, 실시간으로 최신 정보를 업데이트할 수 있습니다.
          </p>
          <p class="mb-2">  
            또한, 전국 관광지 데이터베이스를 통해 인기 있는 여행지를 손쉽게 찾아보세요. 수많은 사용자들의 좋아요를 기준으로 정렬된 리스트는 여러분의 선택을 돕습니다.
          </p>
          <p class="mb-5 pb-4">  <!-- 마지막 문단은 좀 더 큰 마진 -->
            ABC Trip과 함께라면 특별한 추억이 가득한 여행이 될 것입니다. 지금 바로 ABC Trip에서 여러분의 잊지 못할 여정을 시작하세요.  
          </p>
        </div>
      </div>
    </div>

    <div>
      <component :is="TheStatisticsView" />
    </div>

  </div>
</template>

<style scoped>

/* 최소한의 필수 CSS만 유지 */
.custom-height {
  height: 55vh;
}

.h-300 {
  height: 300px;
}

.transition-transform {
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

</style>