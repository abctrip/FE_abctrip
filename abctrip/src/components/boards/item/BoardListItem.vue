<script setup>
defineProps({ article: Object });

</script>

<template>
  <tr class="text-center">
    <th scope="row">{{ article.freePostId }}</th>
    <td class="text-start">
      <router-link
        :to="{ name: 'freeboard-view', params: { articleno: article.freePostId } }"
        class="article-title link-dark"
      >
        {{ article.freeTitle }}
      </router-link>
    </td>
    <td>{{ article.nickName }}</td>
    <td>{{ article.freeViews }}</td>
    <td>{{ article.createdAt }}</td>
  </tr>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>
