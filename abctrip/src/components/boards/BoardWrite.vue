<script setup>
import BoardFormItem from "./item/BoardFormItem.vue";
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="border-bottom col-lg-10 mb-4 text-start">
        <h3 class="my-3 py-3">
          <span style="color:#6E7073">글쓰기</span>
        </h3>
      </div>
      <div class="col-lg-10 text-start">
        <BoardFormItem type="regist" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>