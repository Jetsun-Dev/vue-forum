<template>
  <div class="forum-listing">
    <div class="forum-details">
      <router-link
        class="text-xlarge"
        :to="{name: 'PageForum', params: {id: forum['.key']}}"
      >{{forum.name}}</router-link>
      <p>{{forum.description}}</p>
    </div>

    <div class="threads-count">
      <p>
        <span class="count">{{threadsCount}}</span>
        {{threadsCount === 1 ? 'thread' : 'threads'}}
      </p>
    </div>

    <div class="last-thread">
      <!-- Make later -->
    </div>
  </div>
</template>

<script>
import { countObjectProperty } from "@/utils";
export default {
  props: {
    forum: {
      type: Object,
      required: true
    }
  },
  computed: {
    threadsCount() {
      return countObjectProperty(this.forum.threads);
    }
  }
};
</script>

<style scoped>
</style>