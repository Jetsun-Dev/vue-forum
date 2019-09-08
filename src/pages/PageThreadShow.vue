<template>
  <div class="thread-show" v-if="asyncDataStatus_ready">
    <h1>{{ thread.title }}</h1>
    <router-link
      class="btn-green btn-small"
      tag="button"
      :to="{name: 'PageThreadEdit', id: this.id}"
    >Edit Thread</router-link>
    <p>
      By
      <a href class="link-unstyled">{{user.name}}</a>
      <AppDate :timeStamp="thread.publishedAt" />
      <span
        style="float: right; margin-top: 2px;"
        class="hide-mobile text-faded text-mobile"
      >{{repliesCount}} replies by {{contributorsCount}} contributors</span>
    </p>
    <PostList :posts="posts" />
    <PostEditor v-if="authUser" :threadId="id" />
    <div class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{name: 'PageSignIn', query: {redirectTo: $route.path}}">Sign in</router-link>&nbsp; or
      <router-link :to="{name: 'PageRegister', query: {redirectTo: $route.path}}">Register</router-link>&nbsp;to post a reply
    </div>
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostEditor from "@/components/PostEditor.vue";
import { countObjectProperty } from "@/utils";
import { mapActions, mapGetters } from "vuex";
import asyncDataStatus from "@/mixins/asyncDataStatus";

export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters({ authUser: "auth/authUser" }),
    user() {
      return this.$store.state.users.items[this.thread.userId];
    },
    thread() {
      return this.$store.state.threads.items[this.id];
    },
    posts() {
      const postIds = Object.values(this.thread.posts);
      return Object.values(this.$store.state.posts.items).filter(post =>
        postIds.includes(post[".key"])
      );
    },
    repliesCount() {
      return this.$store.getters['threads/threadRepliesCount'](this.thread[".key"]);
    },
    contributorsCount() {
      return countObjectProperty(this.thread.contributors);
    }
  },
  components: {
    PostList,
    PostEditor
  },
  methods: {
    ...mapActions('threads', ["fetchThread"]),
    ...mapActions('posts', ["fetchPosts"]),
    ...mapActions('users', ["fetchUser"])
  },
  created() {
    //fetch thread
    this.fetchThread({ id: this.id })
      .then(thread => {
        //fetch user
        this.fetchUser({ id: thread.userId });
        return this.fetchPosts({ ids: thread.posts });
      })
      .then(posts => {
        return Promise.all(
          posts.map(post => this.fetchUser({ id: post.userId }))
        );
      })
      .then(() => {
        this.asyncDataStatus_fetched();
      });
  }
};
</script>
