<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            v-model="form.name"
            id="name"
            type="text"
            class="form-input"
            @blur="$v.form.name.$touch()"
          />
          <template v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="form-error">This field is required</span>
          </template>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            v-model.lazy="form.username"
            id="username"
            type="text"
            class="form-input"
            @blur="$v.form.username.$touch()"
          />
          <template v-if="$v.form.username.$error">
            <span v-if="!$v.form.username.required" class="form-error">This field is required</span>
            <span v-else-if="!$v.form.username.unique" class="form-error">Username must be unique</span>
          </template>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            v-model.lazy="form.email"
            id="email"
            type="email"
            class="form-input"
            @blur="$v.form.email.$touch()"
          />
          <template v-if="$v.form.email.$error">
            <span v-if="!$v.form.email.required" class="form-error">This field is required</span>
            <span
              v-else-if="!$v.form.email.email"
              class="form-error"
            >This is not a valid email address</span>
            <span v-else-if="!$v.form.email.unique" class="form-error">Email must be unique</span>
          </template>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="form-input"
            @blur="$v.form.password.$touch()"
          />
          <template v-if="$v.form.password.$error">
            <span v-if="!$v.form.password.required" class="form-error">This field is required</span>
            <span
              v-else-if="!$v.form.password.minLength"
              class="form-error"
            >The password should be at least 6 character long</span>
          </template>
        </div>

        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input
            v-model.lazy="form.avatar"
            id="avatar"
            type="text"
            class="form-input"
            @blur="$v.form.avatar.$touch()"
          />
          <template v-if="$v.form.avatar.$error">
            <span v-if="!$v.form.avatar.url" class="form-error">This field should be valid url</span>
            <span
              v-else-if="!$v.form.avatar.supportedImageFile"
              class="form-error"
            >Image must be .jpg, .jpeg, .png, .svg, or .gif format</span>
            <span
              v-else-if="!$v.form.avatar.responseOk"
              class="form-error"
            >The supplied image cannot be found</span>
          </template>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click="registerWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email, url, minLength } from "vuelidate/lib/validators";
import {
  uniqueUsername,
  uniqueEmail,
  supportedImageFile,
  responseOk
} from "@/utils/validators";

export default {
  data() {
    return {
      form: {
        name: null,
        username: null,
        email: null,
        password: null,
        avatar: null
      }
    };
  },
  validations: {
    form: {
      name: {
        required
      },
      username: {
        required,
        unique: uniqueUsername
      },
      email: {
        required,
        email,
        unique: uniqueEmail
      },
      password: {
        required,
        minLength: minLength(6)
      },
      avatar: {
        url,
        supportedImageFile,
        responseOk
      }
    }
  },
  methods: {
    register() {
      this.$v.form.$touch();
      if (this.$v.form.$invalid) {
        return;
      }
      this.$store
        .dispatch("auth/registerUserWithEmailAndPassword", this.form)
        .then(() => this.successRedirect());
    },
    registerWithGoogle() {
      this.$store
        .dispatch("auth/signInWithGoogle")
        .then(() => this.successRedirect());
    },
    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: "PageHome" };
      this.$router.push(redirectTo);
    }
  },
  created() {
    this.$emit("ready");
  }
};
</script>

<style scoped>
</style>