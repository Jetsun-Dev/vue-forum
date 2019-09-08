<template>
  <div class="col-full">
    <h1>Page Not Found</h1>
    <p>
      Oops, we can't find what you are looking for. Why don't you
      <router-link :to="{name: 'PageHome'}">go Home</router-link>&nbsp; instead?
    </p>
  </div>
</template>
<script>
export default {
  created() {
    this.$emit("ready");
  }
};
</script>
<style scoped>
div {
  text-align: center;
  padding: 60px 0;
}
h1 {
  font-size: 100px;
}
p {
  font-size: 30px;
  font-weight: 100;
}
</style>




