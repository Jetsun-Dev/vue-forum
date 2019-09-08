<template>
  <div>
    <div class="post-list"></div>
    <PostListItem v-for="post in posts" :key="post['.key']" :post="post"/>
  </div>
</template>

<script>
import PostListItem from "@/components/PostListItem.vue";
export default {
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  components: {
    PostListItem
  }
};
</script>

<style scoped>
</style>