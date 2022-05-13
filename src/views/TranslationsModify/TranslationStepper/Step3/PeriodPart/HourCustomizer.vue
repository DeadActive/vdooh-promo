<template>
  <v-layout column>
    <v-layout
      class="py-3 cursor--pointer"
      align-center
    >
      <div @click="changeCustomPeriod">
        <v-icon :color="customPeriodComp ? 'primary' : ''">
          {{ customPeriodComp ? 'check_box' : 'check_box_outline_blank' }}
        </v-icon>
        <span class="subheading ml-2">Настроить дни и время показа</span>
      </div>
    </v-layout>

    <v-slide-y-transition group>
      <template v-if="customPeriodComp">
        <v-layout key="select" align-center>
          <v-select
            v-model="translation.inDetailPeriod"
            :items="periodTypes"
            style="max-width: 250px"
            @change="changeInDetailPeriod"
          />

          <v-toolbar text class="table-quickfilter elevation-0 ml-5">
            <v-toolbar-items class="table-quickfilter__toolbar">
              <a
                v-for="period in Array.from(periodConfig)"
                :key="period[0]"
                @click="setPeriod(period[0])"
              >
                {{ period[1].title }}
              </a>
            </v-toolbar-items>
          </v-toolbar>
        </v-layout>

        <v-flex key="tabs-1" xs12 v-if="translation.inDetailPeriod">
          <v-tabs dark class="hour-selector" v-model="dayTabsComp">
            <v-tab
              v-for="day in translation.detailWeek"
              :disabled="day.disabled"
              :key="day.value"
            >
              {{ day.title }}
            </v-tab>

            <v-tab-item
              v-for="day in translation.detailWeek"
              :key="day.value"
            >
              <hour-selector
                :value="day.hours"
                @input="chageDayHours(day, $event)"
              />
            </v-tab-item>
          </v-tabs>
        </v-flex>

        <v-flex key="tabs-2" v-else>
          <v-tabs dark class="hour-selector" v-model="weekTabs">
            <v-tab
              v-for="day in translation.notDetailWeek"
              :key="day.value"
            >
              {{ day.title }}
            </v-tab>

            <v-tab-item
              v-for="day in translation.notDetailWeek"
              :key="day.value"
            >
              <hour-selector
                :value="day.hours"
                @input="chageDayHours(day, $event)"
              />
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </template>
    </v-slide-y-transition>
  </v-layout>
</template>

<script>
import HourSelector from './HourSelector';
import Step3Bus from '../Step3Bus';
import moment from 'moment';

const periodConfig = new Map();
periodConfig.set('morning',  { hours: [6, 7, 8, 9, 10, 11]    , title: 'Утро' });
periodConfig.set('day',      { hours: [12, 13, 14, 15, 16, 17], title: 'День' });
periodConfig.set('evening',  { hours: [18, 19, 20, 21, 22, 23], title: 'Вечер' });
periodConfig.set('rushHour', {
  hours: [8, 9, 10, 17, 18, 19],
  title: 'Часы Пик (будни)',
  onlyWorkdays: true,
});

const periodTypes = [
  { text: 'Дни недели',     value: true   },
  { text: 'Будни/Выходные', value: false  },
];

export default {
  name: 'HourCustomizer',

  props: {
    customPeriod: Boolean,
    translation: Object,
    dayTabs: Number,
  },

  components: {
    HourSelector,
  },

  created() {
    if (Object.values(this.currentWeek).every(d => !!d.hours && !d.hours.length)) return;
    this.customPeriodComp = Object.values(this.currentWeek).some(d => d.hours.length < 24);

    this.currentDaysInPeriod();
  },

  data: () => ({
    periodConfig,
    periodTypes,

    weekTabs: 0,
  }),

  computed:{
    customPeriodComp: {
      get() {
        return this.customPeriod;
      },
      set(customPeriod) {
        this.$emit('update:custom-period', customPeriod);
      }
    },

    currentWeek() {
      return this.translation.inDetailPeriod
        ? this.translation.detailWeek
        : this.translation.notDetailWeek
    },

    dayTabsComp: {
      get() {
        return this.dayTabs;
      },
      set(dayTabs) {
        this.$emit('update:dayTabs', dayTabs);
      },
    },
  },

  methods: {
    changeCustomPeriod() {
      if (this.customPeriodComp && Object.values(this.currentWeek).some(d => d.hours.length < 24)) {
        // notify here about clear hours
        // return this.$refs.alertDialog.alert();
      }
      this.selectAll();
      this.customPeriodComp = !this.customPeriodComp;
    },

    selectAll() {
      Object.values(this.currentWeek).forEach(value => {
        value.hours = new Array(24).fill(null).map((i, index) => index);
      });
    },
    
    currentDaysInPeriod() {
      this.$emit('current-days-in-period');
    },

    setPeriod(period) {
      const currentPeriod = this.periodConfig.get(period);
      if (!currentPeriod) return;

      const {
        inDetailPeriod,
        notDetailWeek,
        detailWeek,
      } = this.translation;

      if (inDetailPeriod) {
        detailWeek.forEach(day => {
          day.hours = [];

          if (day.type === 'workdays' && !currentPeriod.onlyWeekends) {
            day.hours = currentPeriod.hours.slice();
          }
          if (day.type === 'weekdays' && !currentPeriod.onlyWorkdays) {
            day.hours = currentPeriod.hours.slice();
          }
        })
      }
      else {
        notDetailWeek[0].hours = [];
        notDetailWeek[1].hours = [];

        if (!currentPeriod.onlyWeekends) {
          notDetailWeek[0].hours = currentPeriod.hours.slice();
        }
        if (!currentPeriod.onlyWorkdays) {
          notDetailWeek[1].hours = currentPeriod.hours.slice();
        }
      }

      console.log(notDetailWeek, detailWeek);
      Step3Bus.$emit('change-translation-week');
    },

    changeInDetailPeriod(inDetailPeriod) {
      const {
        notDetailWeek,
        detailWeek,
      } = this.translation;

      if (inDetailPeriod) {
        detailWeek.forEach(day => {
          day.hours = notDetailWeek.find(d => d.value === day.type).hours;
        });
        return Step3Bus.$emit('change-translation-week');
      }

      const workdays = new Set(...detailWeek.filter(d => d.type === 'workdays').map(d => d.hours));
      const weekends = new Set(...detailWeek.filter(d => d.type === 'weekends').map(d => d.hours));

      notDetailWeek[0].hours = [...workdays];
      notDetailWeek[1].hours = [...weekends];
      return Step3Bus.$emit('change-translation-week');
    },

    chageDayHours(day, hours) {
      day.hours = hours.slice();
      this.$emit('time-outed-surfaces');
      Step3Bus.$emit('change-translation-week');
    },
  },
};
</script>

<style scoped>
.theme--light.v-toolbar {
  background: inherit;
}

.table-quickfilter {
  padding-left: 0;
  padding-right: 0;
}

.table-quickfilter__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.table-quickfilter__toolbar a {
  margin: 0 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.54);
  white-space: nowrap;
}
</style>
