// stores/tourist.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { listSido, listGugun, listAttractionType, listAttractions } from '@/api/map';
import { toggleAttractionLike, getAttractionLikeCount, getAttractionLikeStatus } from '@/api/attraction';

export const useTouristStore = defineStore('tourist', () => {
  // 상태 정의
  const sidoList = ref([]);
  const gugunList = ref([{ text: "구군선택", value: "" }]);
  const attractionTypeList = ref([{ text: "관광지유형선택", value: "" }]);
  const attractionList = ref([]);
  const selectedAttraction = ref(null);
  const currentPage = ref(1);
  const itemsPerPage = 9;

  // API 파라미터
  const param = ref({
    serviceKey: import.meta.env.VITE_OPEN_API_SERVICE_KEY,
    MobileOS: "ETC",
    MobileApp: "abcTripAppTest",
    _type: "json",
    areaCode: "",
    sigunguCode: "",
    contentTypeId: "",
  });

  // 메서드 정의
  const getSidoList = () => {
    listSido(
      ({ data }) => {
        sidoList.value = [
          { text: "시도선택", value: "" },
          ...data.map(sido => ({ text: sido.sidoName, value: sido.sidoCode }))
        ];
      },
      (err) => console.log('시도 목록 조회 실패:', err)
    );
  };

  const getAttractionTypes = () => {
    listAttractionType(
      ({ data }) => {
        attractionTypeList.value = [
          { text: "관광지유형선택", value: "" },
          ...data.map(type => ({ text: type.contentName, value: type.contentId }))
        ];
      },
      (err) => console.log('관광지 유형 조회 실패:', err)
    );
  };

  const updateSidoCode = (val) => {
    param.value.areaCode = val;
    listGugun(
      { sido: val },
      ({ data }) => {
        gugunList.value = [
          { text: "구군선택", value: "" },
          ...data.map(gugun => ({ text: gugun.gugunName, value: gugun.gugunCode }))
        ];
      },
      (err) => console.log('구군 목록 조회 실패:', err)
    );
  };

  const updateGugunCode = (val) => {
    param.value.sigunguCode = val;
  };

  const updateAttractionType = (val) => {
    param.value.contentTypeId = val;
    listAttractions(
      param.value,
      ({ data }) => {
        attractionList.value = data.response.body.items.item;
      },
      (error) => console.log("관광지 목록 조회 실패:", error)
    );
  };

  const updateSelectedAttraction = (attraction) => {
    selectedAttraction.value = attraction;
  };

  const updateLikeInfo = (userId) => {
    if (!attractionList.value) return;
    
    attractionList.value.forEach(attraction => {
      getAttractionLikeCount(
        attraction.contentid,
        (response) => {
          attraction.likeCount = response.data;
        },
        (error) => console.error('좋아요 수 조회 실패:', error)
      );

      if (userId) {
        getAttractionLikeStatus(
          attraction.contentid,
          userId,
          (response) => {
            attraction.isLiked = response.data;
          },
          (error) => console.error('좋아요 상태 조회 실패:', error)
        );
      }
    });
  };

  const toggleLike = async (attraction, userId) => {
    if (!attraction.likeCount) attraction.likeCount = 0;

    toggleAttractionLike(
      attraction.contentid,
      userId,
      (response) => {
        const { isLiked, likeCount } = response.data;
        attraction.isLiked = isLiked;
        attraction.likeCount = likeCount;
      },
      (error) => console.error('좋아요 처리 실패:', error)
    );
  };

  const updatePage = (page) => {
    currentPage.value = page;
  };

  return {
    // 상태
    sidoList,
    gugunList,
    attractionTypeList,
    attractionList,
    selectedAttraction,
    currentPage,
    itemsPerPage,
    param,
    // 메서드
    getSidoList,
    getAttractionTypes,
    updateSidoCode,
    updateGugunCode,
    updateAttractionType,
    updateSelectedAttraction,
    updateLikeInfo,
    toggleLike,
    updatePage
  };
});