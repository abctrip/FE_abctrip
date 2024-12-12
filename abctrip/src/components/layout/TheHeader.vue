<script setup>
import { useMenuStore } from "@/stores/menu";
import { useMemberStore } from "@/stores/member";
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';

// 스토어 초기화
const menuStore = useMenuStore();
const memberStore = useMemberStore();

// storeToRefs : menuList, userInfo 값이 변경될 때, 자동으로 감지하여 다시 렌더링
const { menuList } = storeToRefs(menuStore);
const { userInfo } = storeToRefs(memberStore);

// 컴포넌트 마운트 시 로그인 체크 및 메뉴 상태 업데이트
onMounted(async () => {
  const token = sessionStorage.getItem("accessToken");
  
  if (!token) return;
  
  await memberStore.getUserInfo(token);  // await 응답이 올때까지 대기

  userInfo.value && menuStore.changeMenuState();    
});

// 로그아웃 처리 및 메뉴 상태 변경
const logout = async () => {
  await memberStore.userLogout();
  menuStore.changeMenuState();
};

</script>

<template>
  <nav class="navbar navbar-expand-md sticky-top" style="min-width: 500px">
    <div class="container-fluid" style="background-color: white">
      <router-link :to="{ name: 'main' }" class="navbar-brand">
        <img
          src="@/assets/abc-logo.png"
          class="rounded mx-auto d-block"
          alt="..."
        />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarScroll"
        aria-controls="navbarScroll"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" style="height: 100%" id="navbarScroll">
        <ul
          class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
          style="--bs-scroll-height: 200px"
        >
          <li class="nav-item dropdown hover-dropdown">
            <router-link :to="{ name: 'board' }" class="nav-link"
              >게시판</router-link
            >
            <div class="dropdown-content">
              <ul>
                <li>
                  <router-link :to="{ name: 'freeboard-list' }" class="nav-link"
                    >자유게시판</router-link
                  >
                </li>
                <li>
                  <router-link :to="{ name: 'anonymousboard' }" class="nav-link"
                    >익명게시판</router-link
                  >
                </li>
                <li>
                  <router-link :to="{ name: 'tipboard' }" class="nav-link"
                    >여행 꿀팁게시판</router-link
                  >
                </li>
              </ul>
            </div>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'routeview' }" class="nav-link"
              >전국 HOT 관광지</router-link
            >
          </li>
          <li class="nav-item dropdown hover-dropdown">
            <router-link :to="{ name: 'help' }" class="nav-link"
              >HELP DESK</router-link
            >
            <div class="dropdown-content">
              <ul class="noticeUl">
                <li>
                  <router-link :to="{ name: 'noticehelp' }" class="nav-link"
                    >공지사항</router-link
                  >
                </li>
                <li>
                  <router-link :to="{ name: 'qnahelp' }" class="nav-link"
                    >자주 묻는 질문</router-link
                  >
                </li>
                <li>
                  <router-link :to="{ name: 'onetoonehelp' }" class="nav-link"
                    >1대1 문의</router-link
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <ul
          class="navbar-nav ms-auto my-2 my-lg-0 navbar-nav-scroll"
          style="--bs-scroll-height: 200px"
        >
          
          <template v-for="menu in menuList" :key="menu.routeName">
            <template v-if="menu.show">
              <!-- 사용자 이름 표시 (로그인 상태일 때만) -->
              <li v-if="userInfo && menu.routeName === 'user-mypage'">
                <span class="nav-link">{{ userInfo.userName }}({{ userInfo.nickName }})님 환영합니다.</span>
              </li>
              
              <!-- 로그아웃 메뉴 -->
              <template v-if="menu.routeName === 'user-logout'">
                <li class="nav-item">
                  <router-link to="/" @click.prevent="logout" class="nav-link">{{ menu.name }}</router-link>
                </li>
              </template>

              <!-- 나머지 메뉴 링크들 -->
              <template v-else>
                <li class="nav-item">
                  <router-link :to="{ name: menu.routeName }" class="nav-link">
                    {{ menu.name }}
                  </router-link>
                </li>
              </template>
            </template>
          </template>

        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar img {
  height: 60px;
  margin: 5px 30px 5px 10px !important;
}
.navbar {
display:flex;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 10px !important;
}
.navbar .container-fluid {
  height: 90px; /* 원하는 높이로 설정 */
}
.dropdown-content {
  display: none; /* 기본적으로 숨김 */
  position: fixed; /* 화면 전체를 기준으로 위치 설정 */
  top: 90px; /* 부모 아래로 약간의 간격 추가 */
  left: 0; /* 화면의 가장 왼쪽에 위치 */
  width: 100vw; /* 화면 전체 너비로 설정 */
  background-color: white;
  padding: 1rem 0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1050;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-item {
    height: 90px; /* navbar 높이와 동일하게 설정 */
  display: flex; /* 자식 요소 정렬 */
  align-items: center; /* 자식 요소 세로 정렬 */
  position: relative; /* 드롭다운 위치 기준 */
}
.dropdown-content ul {
  display: flex; /* 가로 정렬 */
  justify-content: flex-start; /* 균등 간격 */
  padding: 0;
  margin-left: 100px;
  list-style: none;
}
.noticeUl {
  margin-left: 300px !important;
}

.dropdown-content ul li a {
  color: #333;
  font-size: 1rem;
  padding: 0.5rem 1rem;
}
.dropdown-content ul li a:hover {
  color: #c00; /* 하이라이트 색상 */
}

.nav-item:hover .dropdown-content {
  display: block; /* 마우스를 올리면 표시 */
}

.dropdown-item {
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
}

.nav-link {
  display: flex; /* Flexbox로 부모 높이를 채움 */
  align-items: center; /* 세로 중앙 정렬 */
  height: 100%; /* 부모 높이 상속 */
  padding: 0px; /* 좌우 여백 추가 */
  box-sizing: border-box; /* 패딩과 보더를 포함한 크기 계산 */
  text-decoration: none; /* 기본 링크 스타일 제거 */
}

.dropdown-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #000;
}
</style>
