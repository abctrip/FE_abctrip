<script setup>
import { ref, onMounted, computed, watch } from "vue";
import defaultImage from "@/assets/img_prepare.jpg";
import { useTouristStore } from "@/stores/tourist";
import { useMemberStore } from "@/stores/member";
import VKakaoMap from "@/components/common/VKakaoMap.vue";
import VSelect from "@/components/common/VSelect.vue";

// store 초기화
const touristStore = useTouristStore();
const userStore = useMemberStore();

// 정렬 관련
const sortOption = ref('name');
const sortOptions = [
  { text: "이름순", value: "name" },
  { text: "좋아요순", value: "likes" }
];

// 페이지네이션을 위한 계산된 속성
const totalPages = computed(() => 
  Math.ceil(touristStore.attractionList.length / touristStore.itemsPerPage)
);

// 정렬과 페이지네이션이 적용된 관광지 목록
const paginatedAttractions = computed(() => {
  let sorted = [...touristStore.attractionList];
  
  if (sortOption.value === 'likes') {
    sorted.sort((a, b) => {
      const likesA = a.likeCount || 0;
      const likesB = b.likeCount || 0;
      if (likesB === likesA) {
        return a.title.localeCompare(b.title);
      }
      return likesB - likesA;
    });
  } else {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  const start = (touristStore.currentPage - 1) * touristStore.itemsPerPage;
  return sorted.slice(start, start + touristStore.itemsPerPage);
});

// 이벤트 핸들러
const onChangeSido = (val) => {
  touristStore.updateSidoCode(val);
};

const onChangeGugun = (val) => {
  touristStore.updateGugunCode(val);
};

const onChangeAttraction = (val) => {
  touristStore.updateAttractionType(val);
};

const viewAttraction = (attraction) => {
  touristStore.updateSelectedAttraction(attraction);
};

const toggleLike = async (attraction) => {
  const userId = userStore.userInfo?.userId;
  
  if (!userId) {
    alert("로그인이 필요한 서비스입니다.");
    return;
  }

  await touristStore.toggleLike(attraction, userId);
};

// 인기 관광지(좋아요 상위 3개) 확인
const isTopThreeLikes = (attraction) => {
  const sorted = [...touristStore.attractionList]
    .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  
  const topThree = sorted
    .filter(a => (a.likeCount || 0) > 0)
    .slice(0, 3)
    .map(a => a.contentid);
  
  return topThree.includes(attraction.contentid);
};

// 관광지 목록 변경 감지
watch(
  () => touristStore.attractionList,
  (newAttractions) => {
    if (newAttractions && newAttractions.length > 0) {
      touristStore.updateLikeInfo(userStore.userInfo?.userId);
    }
  }
);

// 초기 데이터 로드
onMounted(() => {
  console.log('#################')
  touristStore.getSidoList();
  touristStore.getAttractionTypes();
});
</script>

<template>
  <div class="page-wrapper">
    <div class="container text-center mt-3 main-content">
      <!-- 심플한 검색 헤더 -->
      <header class="text-center mb-8">
        <h2 class="text-center" style="color: #6e7073">관광지검색</h2>
        <p class="text-gray-600">지역별 관광지를 쉽게 찾아보세요.</p>
      </header>

      <!-- 지역 선택 -->
      <div class="d-flex flex-row mb-3 gap-5">
        <VSelect :selectOption="touristStore.sidoList" @onKeySelect="onChangeSido" />
        <VSelect :selectOption="touristStore.gugunList" @onKeySelect="onChangeGugun" />
        <VSelect :selectOption="touristStore.attractionTypeList" @onKeySelect="onChangeAttraction" />
      </div>

      <!-- 카카오 맵 -->
      <VKakaoMap :attractions="touristStore.attractionList" v-model:selectedAttraction="touristStore.selectedAttraction"/>

      <!-- 정렬 옵션 추가 -->
      <div class="d-flex justify-content-end mb-3">
        <select class="form-select w-auto" v-model="sortOption">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      
      <!-- 관광지 카드 목록 -->
      <div class="container">
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div class="col" v-for="attraction in paginatedAttractions" :key="attraction.contentId">
            <div class="card h-100">
              <img :src="attraction.firstimage || defaultImage" class="card-img-top" style="height: 250px; object-fit: cover" alt="관광지 이미지" />
              <div class="card-body">
                <h5 class="card-title" @click="viewAttraction(attraction)" style="cursor: pointer; color: #0d6efd">
                  {{ attraction.title }}
                  <span v-if="isTopThreeLikes(attraction)" class="hot-place">🔥</span>
                </h5>
                <p class="card-text">{{ attraction.addr1 }}</p>
                <div class="d-flex justify-content-between align-items-center mt-2">
                  <span class="like-count">❤️ {{ attraction.likeCount || 0 }}</span>
                  <button class="btn btn-sm" :class="{'btn-danger': attraction.isLiked, 'btn-outline-danger': !attraction.isLiked}" @click="toggleLike(attraction)">
                    좋아요
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 페이지 네비게이션 -->
      <nav aria-label="Page navigation" class="mt-4 mb-5">
        <ul class="pagination pagination justify-content-center">
          <li class="page-item" :class="{ disabled: touristStore.currentPage === 1 }">
            <a class="page-link custom-page-link" @click="touristStore.updatePage(touristStore.currentPage - 1)" style="cursor: pointer">이전</a>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: touristStore.currentPage === page }">
            <a class="page-link custom-page-link" @click="touristStore.updatePage(page)" style="cursor: pointer">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: touristStore.currentPage === totalPages }">
            <a class="page-link custom-page-link" @click="touristStore.updatePage(touristStore.currentPage + 1)" style="cursor: pointer">다음</a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: 10px; /* 풋터와의 여백 축소 */
}

.custom-page-link {
  color: #666;
  background-color: #fff;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
}

.custom-page-link:hover {
  color: #333;
  background-color: #f8f9fa;
}

.page-item.active .custom-page-link {
  color: #fff;
  background-color: #4a5568;
  border-color: #4a5568;
}

.like-count {
  font-size: 0.9rem;
}

.hot-place {
  margin-left: 8px;
  font-size: 0.9em;
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .main-content {
    padding-bottom: 80px;
  }
}
</style>