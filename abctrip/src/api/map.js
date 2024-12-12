import { localAxios } from "@/util/http-commons";
import axios from "axios";

const local = localAxios();

function listSido(success, fail) {
  local.get(`/map/sido`).then((response) => {
    console.log("시도 데이터:", response.data);
    success(response);
  }).catch(fail);
}

function listGugun(sido, success, fail) {
  local.get(`/map/gugun/${sido.sido}`).then((response) => {
    console.log("구군 데이터:", response.data);
    success(response);
  }).catch(fail);
}

function listAttractionType(success, fail) {
  local.get(`/map/attraction-type`).then((response) => {
    console.log("관광지 타입 데이터:", response.data);
    success(response);
  }).catch(fail);
}

// 한국관광공사 오픈 API 요청
function listAttractions(params, success, fail) {
  console.log("#### 관광지 API 요청 파라미터:", params); // 파라미터 로깅 추가

  const tourApiUrl = import.meta.env.VITE_TOUR_API_URL;

  axios.get(tourApiUrl, { params: params })
    .then(response => {
      console.log(params);
      console.log("#### 관광지 API 응답 데이터:", response.data);
      success(response);
    })
    .catch(fail);
}

export { listSido, listGugun, listAttractionType, listAttractions };