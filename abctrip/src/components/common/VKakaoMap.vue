<script setup>
import { ref, watch, onMounted } from "vue";

// 초기 변수 설정
let map;
const positions = ref([]); // 위치 데이터 저장
const markers = ref([]); // 마커들 저장
const infowindows = ref([]); // 인포윈도우들 저장
const props = defineProps({ attractions: Array, selectedAttraction: Object });

// 지도 초기화
const initMap = () => {
  const container = document.getElementById("map");
  const options = {
    center: new kakao.maps.LatLng(37.5666805, 126.9784147), // 서울 중심
    level: 4, // 줌 레벨
  };
  map = new kakao.maps.Map(container, options);
};

// 마커 및 인포윈도우 로드
const loadMarkers = () => {
  deleteMarkers(); // 기존 마커 삭제
  markers.value = [];
  infowindows.value = [];

  positions.value.forEach((position) => {
    const marker = new kakao.maps.Marker({
      map: map,
      position: position.latlng,
      title: position.title,
      clickable: true,
    });

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px;width:150px;text-align:center;">${position.title}</div>`,
      removable: true,
    });

    // 마커 클릭 시 인포윈도우 열기
    kakao.maps.event.addListener(marker, "click", () => {
      infowindows.value.forEach((info) => info.close()); // 다른 인포윈도우 닫기
      infowindow.open(map, marker);
    });

    infowindows.value.push(infowindow);
    markers.value.push(marker);
  });

  // 지도 크기에 맞춰 마커 범위 조정
  const bounds = positions.value.reduce(
    (bounds, position) => bounds.extend(position.latlng),
    new kakao.maps.LatLngBounds()
  );
  map.setBounds(bounds);
};

// 마커 삭제
const deleteMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
};

// 선택된 관광지로 지도 이동
watch(
  () => props.selectedAttraction,
  (attraction) => {
    if (!attraction) return;
    // 이전 인포윈도우들 닫기
    infowindows.value.forEach((info) => info.close());

    const moveLatLon = new kakao.maps.LatLng(attraction.mapy, attraction.mapx);
    map.panTo(moveLatLon);
  },
  { deep: true }
);

// 관광지 리스트 변경 시 마커 업데이트
watch(
  () => props.attractions,
  () => {
    positions.value = props.attractions.map((attraction) => ({
      latlng: new kakao.maps.LatLng(attraction.mapy, attraction.mapx),
      title: attraction.title,
    }));
    loadMarkers(); // 마커 로드
  },
  { deep: true }
);

// 카카오 맵 스크립트 로딩 및 초기화
onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    initMap(); // 카카오 맵 이미 로드된 경우
  } else {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${
      import.meta.env.VITE_KAKAO_MAP_SERVICE_KEY
    }&libraries=services,clusterer`;
    /* global kakao */
    script.onload = () => kakao.maps.load(initMap); // 스크립트 로드 후 지도 초기화
    document.head.appendChild(script);
  }
});
</script>

<template>
  <!-- 카카오 맵을 표시할 div -->
  <div id="map" class="mb-4"></div>
</template>

<style>
/* 지도 스타일 */
#map {
  width: 100%;
  height: 700px;
}
</style>
