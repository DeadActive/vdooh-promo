<template>
  <v-snackbar v-model="show" top :color="type" :timeout="5000">{{ message }}</v-snackbar>
</template>

<script>
export default {
  computed: {
    show: {
      get() {
        return this.$store.state.notification.show;
      },
      set(show) {
        this.$store.commit('notification/CHANGE_SHOW', show);
      }
    },
    message() {
      return this.$store.state.notification.message;
    },
    type() {
      return this.$store.state.notification.type;
    },
  },
};
</script>

<style scoped>
.notification-bar {
  margin: 1em 0 1em;
}
</style>
