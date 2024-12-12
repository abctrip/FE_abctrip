<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { listArticle } from "@/api/board.js";
// import { useMenuStore } from "@/stores/menu";
// import { storeToRefs } from "pinia";
import { useMemberStore } from "@/stores/member"; // store import 추가

import VSelect from "@/components/common/VSelect.vue";
import BoardListItem from "@/components/boards/item/BoardListItem.vue";
import VPageNavigation from "@/components/common/VPageNavigation.vue";

// const menuStore = useMenuStore();
const memberStore = useMemberStore();

// 반응형을 유지하면서 stores에서 속성을 추출하려면, storeToRefs()를 사용
// const { menuList, userName, nickName } = storeToRefs(menuStore);
// const { userName, nickName } = storeToRefs(menuStore);
const userId = memberStore.userInfo?.userId;

const router = useRouter();

console.log(userId, "###");

const articles = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const { VITE_ARTICLE_LIST_SIZE } = import.meta.env;
const param = ref({
  pgno: currentPage.value,
  spp: VITE_ARTICLE_LIST_SIZE,
  key: "",
  word: "",
});

onMounted(() => {
  getArticleList();
});

const changeKey = (val) => {
  param.value.key = val;
};

const getArticleList = () => {
  listArticle(
    param.value,
    ({ data }) => {
      articles.value = data.articles;
      currentPage.value = data.currentPage;
      totalPage.value = data.totalPageCount;

      console.log("articles 데이터:", articles.value);
    },
    (error) => {
      console.error(error);
    }
  );
};

const onPageChange = (val) => {
  currentPage.value = val;
  param.value.pgno = val;
  getArticleList();
};

const moveWrite = () => {
  if (!userId) {
    alert("로그인이 필요한 서비스입니다.");
    return;
  }
  router.push({ name: "freeboard-write" });
};
</script>

<template>
  <div class="container my-5">
    <!-- 헤더 -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6 ">
        <h2 class="text-start" style="color:#6e7073">자유게시판</h2>
      </div>
      <div class="col-md-6 text-end">
        <button
          type="button"
          class="btn btn-sm"
          style="background-color: #6e7073; color: white"
          @click="moveWrite"
        >
          글쓰기
        </button>
      </div>
    </div>

    <!-- 검색 필터 -->
    <!-- <div class="row mb-3">
        <div class="col-md-12">
          <form class="d-flex justify-content-end">
            <VSelect
              :selectOption="selectOption"
              class="me-2"
              @onKeySelect="changeKey"
            />
            <div class="input-group input-group-sm">
              <input
                type="text"
                class="form-control"
                v-model="param.word"
                placeholder="검색어를 입력하세요"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="getArticleList"
              >
                검색
              </button>
            </div>
          </form>
        </div>
      </div> -->

    <!-- 게시판 테이블 -->
    <table class="table table-hover text-center align-middle">
      <thead class="table-light">
        <tr>
          <th scope="col">No</th>
          <th scope="col" class="text-start">제목</th>
          <th scope="col">작성자</th>
          <th scope="col">조회수</th>
          <th scope="col">작성일</th>
        </tr>
      </thead>
      <tbody>
        <BoardListItem
          v-for="article in articles"
          :key="article.freePostId"
          :article="article"
        />
      </tbody>
    </table>

    <!-- 페이지 네비게이션 -->
    <div class="d-flex justify-content-center mt-4">
      <VPageNavigation
        :current-page="currentPage"
        :total-page="totalPage"
        @pageChange="onPageChange"
      />
    </div>
  </div>
</template>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
