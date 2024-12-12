import { localAxios } from "@/util/http-commons";

const local = localAxios();

// 좋아요 토글
function toggleAttractionLike(contentId, userId, success, fail) {
  // console.log("toggleAttractionLike params:", contentId, userId); // 디버깅용
  
  local.post(`/map/attraction/${contentId}/like`, null, {
    params: { userId: userId }
  })
    .then(success)
    .catch(fail);
}

// 좋아요 상태 확인
function getAttractionLikeStatus(contentId, userId, success, fail) {
  // console.log("API Call - getAttractionLikeStatus");
  // console.log("params:", { contentId, userId });
  // console.log("URL:", `${import.meta.env.VITE_VUE_API_URL}/map/attraction/${contentId}/like`);
  local.get(`/map/attraction/${contentId}/like`, { params: { userId } })
    .then(success)
    .catch(fail);
}

// 좋아요 수 조회
function getAttractionLikeCount(contentId, success, fail) {
  // console.log("API Call - getAttractionLikeCount");
  // console.log("contentId:", contentId);
  // console.log("URL:", `${import.meta.env.VITE_VUE_API_URL}/map/attraction/${contentId}/count`);
  
  local.get(`/map/attraction/${contentId}/count`)
    .then(success)
    .catch(fail);
}

export { toggleAttractionLike, getAttractionLikeStatus, getAttractionLikeCount };
