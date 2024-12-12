<script setup>
const moveWrite = () => {
  alert("준비중 입니다.");
  return;
};
</script>

<template>
  <div class="container my-5">
    <!-- 헤더 -->
    <div class="row align-items-center mb-4">
      <div class="col-md-6">
        <h2 class="text-start" style="color: #6e7073">여행 꿀팁게시판</h2>
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
    <div>
       <h2 class="mt-5" style="color:#6e7073">작성된 글이 없습니다.</h2> 
    </div>

  </div>
</template>

<style scoped></style>
