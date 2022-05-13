<template>
<div>
  <v-card class="pa-4 d-flex justify-end flex-column" :min-height="(notSurfaces || surfacesLoaded || !forecastOTS) ? '50px' : '180px'">
    <div class="title mb-2">Прогноз</div>
    <div v-if="notSurfaces" class="body-2 font-weight-regular grey--text">
      Выберите экраны для генерации прогноза
    </div>

    <div v-else-if="surfacesLoaded">
      <span class="grey--text caption">
        Идет загрузка прогноза...
      </span>
      <v-progress-linear indeterminate class="mb-2 mt-2" />
    </div>

    <template v-else>
      <div class="subheading" v-if="dmpHttpCode === 400">
        <span class="font-weight-medium mr-1">OTS:</span>
        <span class="red--text">Ошибка</span>
      </div>

      <div class="subheading" v-else-if="forecastOTS">
        <template v-if="translation.limitControlMode">
          <div>
            <span class="font-weight-medium mr-1">Показы:</span>
            <span :class="{ 'red--text': displayGreater }">{{ Number(translation.planShows).toLocaleString('ru') }}</span>
            из {{ Number(displayTotal).toLocaleString('ru') }}
            
            <div v-if="displayGreater" class="grey--text caption">
              Планируемое вами количество показов превышает доступный остаток по выбранным экранам. Увеличьте количество экранов или ставку. Либо уменьшите бюджет.
            </div>
          </div>

          <span class="font-weight-medium mr-1">OTS:</span>
          <!-- <span>{{ Number(planOTS).toLocaleString('ru') }}</span>
          из -->
          {{ Number(forecastOTS).toLocaleString('ru') }}
        </template>

        <template v-else>
          <span class="font-weight-medium mr-1">OTS:</span>
          <span :class="{ 'red--text': otsGreater }">{{ Number(translation.planOTS).toLocaleString('ru') }}</span>
          из {{ Number(forecastOTS).toLocaleString('ru') }}

          <div v-if="otsGreater" class="grey--text caption">
            Планируемый вами OTS превышает доступный остаток по выбранным экранам. Увеличьте количество экранов или ставку. Либо уменьшите бюджет.
          </div>
        </template>
      </div>

      <div class="subheading" v-if="!isNew">
        <v-layout align-center>
          <v-flex class="font-weight-medium mr-1" shrink>Уникальных (реальных) MAC-адресов:</v-flex>
          <v-flex grow :class="currentUniqueMacColor">{{ currentUniqueMacs }}</v-flex>
          <v-flex shrink>
            <tooltip-button
              :loading="updateCalculationLoading"
              tooltip="Обновить расчет"
              color="success"
              icon="cached"
              @action="updateCalculation"
            />
          </v-flex>
        </v-layout>
      </div>

      <div class="subheading" v-if="!isNew && currentContacts">
        <span class="font-weight-medium">Неуник. МАС-адреса:</span> {{ Number(currentContacts).toLocaleString('ru') }}
      </div>
      <div class="subheading" v-if="!isNew && currentFrequency">
        <span class="font-weight-medium">Частота:</span> ~ {{ Number((currentFrequency).toFixed(2)).toLocaleString('ru') }}
      </div>
      <div class="subheading" v-if="!isNew && currentCoverage">
        <span class="font-weight-medium">Охват:</span> ~ {{ Number(Math.round(currentCoverage)).toLocaleString('ru') }}
      </div>

      <div class="subheading mb-auto" v-if="population">
        <span class="font-weight-medium">Ген.совокупность:</span> ~ {{ Number(population).toLocaleString('ru') }}
      </div>

      <template v-if="loading">
        <v-progress-linear indeterminate class="mb-2 mt-2" />
      </template>

      <div class="grey--text caption">
        <!-- данные обновляются автоматически каждые 15 секунд и при выборе экранов -->
        <v-btn
          :color="needReload ? 'error' : 'primary'" 
          @click="reloadForecast"
          outlined
          class="mt-1"
        >Обновить прогноз</v-btn>
      </div>
    </template>
  </v-card>
  <v-btn v-if="surfaces.length" :loading="surfacesLoaded" class="mt-4" outlined color="success" @click="$emit('loadSurfaces', true)">Экспорт медиаплана</v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TooltipButton from '@/components/TooltipButton';

export default {
  name: 'ForecastPart',

  components: {
    TooltipButton,
  },

  props: {
    reloadForecast: Function,
    surfacesLoaded: Boolean,
    needReload: Boolean,
    translation: Object,
    loading: Boolean,
    surfaces: Array,
    isNew: Boolean,
  },

  created() {
    this.$store.dispatch('surfaces/clearForecastData');
  },

  data: () => ({
    updateCalculationLoading: false,
  }),

  computed: {
    ...mapGetters({
      forecastFrequency:  'surfaces/getForecastFrequency',
      population:         'surfaces/getForecastPopulation',
      displayTotal:       'surfaces/getDisplayTotal',
      forecastOTS:        'surfaces/getForecastOTS',
      dmpHttpCode:        'surfaces/getDmpHttpCode',
      uniqueMac:          'surfaces/getUniqueMac',
      planOTS:          'surfaces/getPlanOTS',
    }),

    otsGreater() {
      return this.translation.planOTS > this.forecastOTS;
    },
    displayGreater() {
      return this.translation.planShows > this.displayTotal;
    },

    notSurfaces() {
      return !this.surfaces.length;
    },
    id() {
      return this.translation.id;
    },

    currentContacts() {
      return this.uniqueMac && this.uniqueMac.contacts;
    },
    currentFrequency() {
      const forecastReach = Number(this.uniqueMac.forecastReach);
      if (forecastReach && forecastReach > 0 && this.currentContacts) {
        return this.currentContacts / forecastReach;
      }
      return 0;
    },
    currentCoverage() {
      if (this.translation.planOTS && this.currentFrequency) {
        return this.translation.planOTS / this.currentFrequency;
      }
      return 0;
    },

    currentUniqueMacs() {
      if (!this.uniqueMac) return;
      const {
        forecastReach,
        taskStatus,
      } = this.uniqueMac;

      switch(taskStatus) {
        case 2:
          return 'Ошибка расчета';
          break;

        case 0:
          return 'Прогноз в очереди';
          break;

        case -1:
          return 'Идет расчет...';
          break;

        case 1: {
          const forecastReachTotal = Number(this.uniqueMac.forecastReachTotal);
          return forecastReach.toLocaleString('ru') + ' (из ' + forecastReachTotal.toLocaleString('ru') + ')';
        } break;

        default:
          if (this.loading || this.uniqueMac.dmp_null_response) {
            return 'Прогноз загружается'
          } else return 'Прогноз отсутствует';
          break;
      }
    },
    currentUniqueMacColor() {
      if (Number(this.uniqueMac) < 0) {
        return 'grey--text text--darken-1';
      }
      else if (Array.isArray(this.uniqueMac) && !this.uniqueMac.length) {
        return 'grey--text text--darken-1';
      }
      return 'black--text';
    },
  },

  methods: {
    async updateCalculation() {
      this.updateCalculationLoading = true;
      await this.$store.dispatch('surfaces/updateCalculation', this.id);
      // await this.$store.dispatch('surfaces/loadUniqueMacs', this.id);
      this.updateCalculationLoading = false;
    },
  },
};
</script>
