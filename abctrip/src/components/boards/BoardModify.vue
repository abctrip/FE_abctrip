<script setup>
import BoardFormItem from "./item/BoardFormItem.vue";
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="border-bottom col-lg-10 mb-4 text-start">
        <h3 class="my-3 py-3">
          <span style="color: #6e7073">글 수정하기</span>
        </h3>
      </div>
      <div class="col-lg-10 text-start">
        <BoardFormItem type="modify" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
