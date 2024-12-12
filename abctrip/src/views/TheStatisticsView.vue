<script setup>
import { ref, onMounted } from 'vue';
import { getHotplaceRank } from '@/api/statistics';

// 핫플레이스 데이터를 저장할 반응형 변수
const hotplaces = ref([]);

// 컴포넌트가 마운트되었을 때 데이터 가져오기
onMounted(() => {
    getHotplaces();
});

// 핫플레이스 데이터를 서버에서 가져오는 함수
const getHotplaces = () => {
    console.log("in getHopplaces");
    getHotplaceRank(
        ({ data }) => {
            hotplaces.value = data; // 서버에서 받아온 데이터 저장
        },
        (error) => {
            console.error("Failed to fetch hotplaces:", error); // 에러 처리
        }
    );
};
</script>

<template>
  <div class="container mt-5 mb-5">
    <!-- 그래프 타이틀 -->
    <h3 class="text-center mb-4">Top 5 Hot Places</h3>
    
    <!-- 막대그래프 -->
    <div v-if="hotplaces.length > 0">
      <div v-for="(place, index) in hotplaces" :key="index" class="mb-3">
        <div class="d-flex justify-content-between">
          <span class="fw-bold">{{ place.attractionTitle }}</span>
          <span>{{ place.attractionLikeCount }} likes</span>
        </div>
        <div class="progress" style="height: 30px;">
          <div 
            class="progress-bar" 
            role="progressbar" 
            :style="{ width: (place.attractionLikeCount / hotplaces[0].attractionLikeCount) * 100 + '%' }"
            aria-valuenow="place.attractionLikeCount" 
            aria-valuemin="0" 
            :aria-valuemax="hotplaces[0].attractionLikeCount"
          >
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="text-center">Loading hot places...</p>
    </div>
  </div>
</template>

<style scoped>
.progress-bar {
  background-color: #6e7073; /* 막대 색상 */
  transition: width 0.3s ease;
}
</style>