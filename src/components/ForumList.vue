<template>
  <div>
    <ForumListItem v-for="forum in forums" :key="forum['.key']" :forum="forum"/>
  </div>
</template>

<script>
import ForumListItem from "@/components/ForumListItem";
export default {
  components: {
    ForumListItem
  },
  props: {
    forums: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
</style>