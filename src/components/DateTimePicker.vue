<template>
  <v-layout justify-space-between align-center wrap>
    <v-flex class="title ml-2 mb-2" xs12>
      {{ label }}
    </v-flex>

    <v-flex shrink class="mx-2">
      <calendar-input v-model="date" :show-current="showCurrent" />
    </v-flex>

    <v-flex shrink>
      <time-input v-model="time" />
    </v-flex>
  </v-layout>
</template>

<script>
import CalendarInput from './CalendarInput'
import TimeInput from './TimeInput'

export default {
  name: 'DateTimePicker',

  components: {
    CalendarInput,
    TimeInput,
  },

  props: {
    showCurrent: [String, Date],
    value: String,
    label: String,
  },

  computed: {
    date: {
      get() {
        if (!this.value) return '';
        return this.value.split(' ')[0];
      },
      set(date) {
        this.$emit('input', [date, this.time].join(' '));
      },
    },

    time: {
      get() {
        if (!this.value) return '';
        return this.value.split(' ')[1];
      },
      set(time) {
        this.$emit('input', [this.date, time].join(' '));
      },
    },
  },
};
</script>
