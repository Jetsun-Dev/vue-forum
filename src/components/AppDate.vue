<template>
  <span :title="timeStamp | humanDate">{{timeStamp | diffTime}}</span>
</template>

<script>
import moment from "moment";
export default {
  props: {
    timeStamp: {
      type: Number,
      required: true
    }
  },
  filters: {
    humanDate: function(date) {
      return moment.unix(date).format("MMMM Do YYYY, h:mm:ss a");
    },
    diffTime(date) {
      return moment.unix(date).fromNow();
    }
  }
};
</script>

<style scoped>
</style>