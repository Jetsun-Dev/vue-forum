<template>
  <div class="col-3 push-top">
    <div class="profile-card">
      <p class="text-center">
        <img :src="user.avatar" alt class="avatar-xlarge img-update" />
      </p>

      <div class="form-group">
        <input
          type="text"
          v-model="activeUser.username"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>

      <div class="form-group">
        <input
          type="text"
          v-model="activeUser.name"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>

      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          class="form-input"
          id="user_bio"
          v-model="activeUser.bio"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>

      <div class="stats">
        <span>{{userPostsCount}} posts</span>
        <span>{{userThreadsCount}} threads</span>
      </div>

      <hr />

      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input autocomplete="off" class="form-input" id="user_website" v-model="activeUser.website" />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input autocomplete="off" class="form-input" id="user_email" v-model="activeUser.email" />
      </div>

      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          autocomplete="off"
          class="form-input"
          id="user_location"
          v-model="activeUser.location"
        />
      </div>

      <div class="btn-group space-between">
        <button class="btn-ghost" @click.prevent="cancel">Cancel</button>
        <button type="submit" @click.prevent="save" class="btn-blue">Save</button>
      </div>
    </div>
    <p class="text-xsmall text-faded text-center">Member since june 2003, last visited 4 hours ago</p>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeUser: { ...this.user }
    };
  },
  computed: {
    userThreadsCount() {
      if (this.user.threads) {
        return this.$store.getters['users/userThreadsCount'](this.user[".key"]);
      } else {
        return 0;
      }
    },
    userPostsCount() {
      return this.$store.getters['users/userPostsCount'](this.user[".key"]);
    }
  },
  methods: {
    save() {
      this.$store.dispatch("users/updateUser", { ...this.activeUser });
      this.$router.push({ name: "PageProfile" });
    },
    cancel() {
      this.$router.push({ name: "PageProfile" });
    }
  }
};
</script>

<style scoped>
</style>