<template>
  <v-card class="pb-4">
    <v-card-title class="subheading">
      <div class="text-center">
        {{ currentDay }}
      </div>
    </v-card-title>

    <v-layout
      class="mx-5"
      justify-center
      wrap
    >
      <v-flex
        v-for="hour in 24"
        :key="hour"
        xs3
        :class="currentTimeClass(hour - 1)"
      >{{ ('0' + (hour - 1)).slice(-2)+':00-'+('0' + (hour - 1)).slice(-2)+':59' }}</v-flex>
    </v-layout>
  </v-card>
</template>

<script>
const week = [
  { title: 'Понедельник', value: 'monday', },
  { title: 'Вторник',     value: 'tuesday', },
  { title: 'Среда',       value: 'wednesday', },
  { title: 'Четверг',     value: 'thursday', },
  { title: 'Пятница',     value: 'friday', },
  { title: 'Суббота',     value: 'saturday', },
  { title: 'Воскресенье', value: 'sunday', },
];

export default {
  name: 'DaysModal',

  props: {
    day: Object,
  },

  computed: {
    currentDay() {
      return week.find(w => w.value === this.day.value).  title;
    },
  },

  methods: {
    currentTimeClass(hour) {
      return this.day.hours.includes(hour) ? "font-weight-medium" : "grey--text";
    },
  },
};
</script>

<style scoped>
  .cube {
    width: 20px;
    height: 20px;
    border-radius: 3px;
  }
  .days .layout:first-child {
    margin-top: 0 !important;
  }
</style>
