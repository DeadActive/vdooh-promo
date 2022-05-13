<template>
  <v-layout wrap justify-space-between>
    <v-flex xs12 sm5 md4 pa-4>
      <payment-form
        :ots-recommend="settings.otsRecommend"
        :translation-is="translationIs"
        :ppv-night="settings.ppvNight"
        :is-guaranteed="isGuaranteed"
        :floor-loading="floorLoading"
        :ots-min="settings.otsMin"
        :ppv-day="settings.ppvDay"
        :translation="translation"
        :not-may-edit="notMayEdit"
        :rules="rules"
        @change-plan-ots="$emit('change-plan-ots')"
      />
    </v-flex>

    <v-flex xs12 md6 pa-4>
      <forecast-part
        v-if="isGuaranteed"
        :surfaces="translation.addedSurfaces"
        :reload-forecast="reloadForecast"
        :surfaces-loaded="surfacesLoaded"
        :translation="translation"
        :loading="forecastLoading"
        :need-reload="needReload"
        :is-new="isNew"
        v-on="$listeners"
      />
      <surfaces-table
        v-else
        :surfaces="translation.addedSurfaces"
        :door-type="translation.doorType"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import SurfacesTable from './SurfacesTable';
import ForecastPart from './ForecastPart';
import PaymentForm from './PaymentForm';

export default {
  name: 'PaymentPart',

  components: {
    SurfacesTable,
    ForecastPart,
    PaymentForm,
  },

  props: {
    forecastLoading: Boolean,
    reloadForecast: Function,
    translationIs: Function,
    surfacesLoaded: Boolean,
    floorLoading: Boolean,
    isGuaranteed: Boolean,
    needReload: Boolean,
    notMayEdit: Boolean,
    translation: Object,
    settings: Object,
    rules: Object,
    surfaces: Array,
    isNew: Boolean,
  },
};
</script>