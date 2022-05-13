<template>
  <v-layout wrap class="px-3">
    <v-flex xs12>
      <v-layout align-center class="pt-3 cursor--pointer" @click="selectUnselectHoursFor('night')">
        <v-icon
          :color="selectAllNight && selectAllNight.length > 0 ? 'primary' : ''"
        >{{ nightIcon }}</v-icon>
        <span class="subheading font-weight-bold ml-2">Ночные часы</span>
      </v-layout>
    </v-flex>

    <v-flex md2 sm4 xs6 v-for="index in 6" :key="index">
      <v-checkbox
        v-model="selectedHours"
        :label="('0' + (index-1)).slice(-2)+':00-'+('0' + (index-1)).slice(-2)+':59'"
        :value="index-1"
        class="hours"
      />
    </v-flex>

    <v-flex xs12 class="mt-4">
      <v-layout align-center class="pt-3 cursor--pointer" @click="selectUnselectHoursFor('day')">
        <v-icon
          :color="selectAllDay && selectAllDay.length > 0 ? 'primary' : ''"
        >{{ dayIcon }}</v-icon>
        <span class="subheading font-weight-bold ml-2">Дневные часы</span>
      </v-layout>
    </v-flex>
    <v-flex md2 sm4 xs6 v-for="index in 18 " :key="(index + 6)">
      <v-checkbox
        v-model="selectedHours"
        :label="('0' + ((index + 6)-1)).slice(-2)+':00-'+('0' + ((index + 6)-1)).slice(-2)+':59'"
        :value="(index + 6)-1"
        class="hours"
      />
    </v-flex>

    <v-flex xs12 class="mb-2">
      <span class="subheading font-italic">
        {{declOfNum(selectedHours.length, ['Выбран', 'Выбрано', 'Выбрано'])}} <strong>{{selectedHours.length}}</strong> {{declOfNum(selectedHours.length, ['час', 'часа', 'часов'])}}
      </span>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'HourSelector',
  props: {
    value: Array,
  },
  computed: {
    selectedHours: {
      get() {
        return this.value;
      },
      set(hours) {
        this.$emit('input', hours);
      },
    },
    selectAllNight() {
      return this.selectedHours.filter(w => w < 6);
    },
    selectAllDay() {
      return this.selectedHours.filter(w => w >= 6);
    },
    isSelectAllNight() {
      return this.selectAllNight.length === 6;
    },
    isSelectAllDay() {
      return this.selectAllDay.length === 18;
    },

    nightIcon() {
      return this.currentIcon(this.isSelectAllNight, this.selectAllNight);
    },
    dayIcon() {
      return this.currentIcon(this.isSelectAllDay, this.selectAllDay);
    },
  },
  methods: {
    declOfNum(n, titles) {
      return titles[
        n % 10 === 1 && n % 100 !== 11
          ? 0
          : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
          ? 1
          : 2
      ];
    },
    selectUnselectHoursFor(time) {
      let allHours = Array.apply(null, Array(24)).map((x, i) => i);

      const select = time === 'day'
        ? this.isSelectAllDay
        : this.isSelectAllNight,
      dayIf = h => h < 6,
      nightIf = h => h >= 6;

      allHours = [...allHours.filter(time === 'night' ? dayIf : nightIf)];

      let selected = this.selectedHours.filter(time === 'night' ? nightIf : dayIf);
      if (!select) {
        selected = [...selected, ...allHours];
      }
      this.selectedHours = selected.slice();
    },
    currentIcon(isSelectAll, array) {
      if (isSelectAll) return "check_box";
      if (array.length) return "indeterminate_check_box";
      return "check_box_outline_blank";
    },
  },
};
</script>

<style>
  .hour-selector {
    background-color: #d4d4d448;
  }
</style>
