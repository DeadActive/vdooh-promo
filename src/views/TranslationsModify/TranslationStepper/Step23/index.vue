<template>
  <v-layout column>
    <v-layout class="mx-4" column>
      <span class="mb-2 headline">Период</span>
      <v-divider />
      <period-part
        :check-surfaces="checkSurfaces"
        :is-guaranteed="isGuaranteed"
        :translation="translation"
        :not-may-edit="notMayEdit"
        :is-new="isNew"
        :rules="rules"
        class="mt-3"
        @time-outed-surfaces="$emit('time-outed-surfaces')"
      />
    </v-layout>

    <v-layout class="mb-4 px-4" column>
      <span class="mb-2 headline">Карта</span>
      <v-divider />
      <step-form
        :is-maximize-reach.sync="isMaximizeReachComp"
        :check-surfaces="checkSurfaces"
        :is-guaranteed="isGuaranteed"
        :translation="translation"
        :not-may-edit="notMayEdit"
        :is-new="isNew"
        :rules="rules"
        class="mt-3"
      />
    </v-layout>

    <v-flex>
      <surface-map
        :return-single-surfaces="returnSingleSurfaces"
        :not-available-surfaces="notAvailableSurfaces"
        :selected-surfaces="selectedSurfaces"
        :surfaces-loaded="surfacesLoaded"
        :added-surfaces="addedSurfaces"
        :is-guaranteed="isGuaranteed"
        :not-may-edit="notMayEdit"
        :surfaces="surfaces"
        :is-new="isNew"
        :is-maximize-reach.sync="isMaximizeReachComp"
        :maximize-reach.sync="maximizeReachComp"
        @remove-added-surfaces="removeAddedSurfaces"
        @load-forecast="$emit('load-forecast')"
        @load-settings="$emit('load-settings')"
        @clear-surfaces="clearSurfaces"
        @add-surface="addSurface"
        @select-all="selectAll"
      />
    </v-flex>

    <v-layout class="mx-4" column>
      <span class="mb-2 headline">Оплата</span>
      <v-divider />
      <payment-part
        :forecast-loading="forecastLoading"
        :surfaces-loaded="surfacesLoaded"
        :reload-forecast="reloadForecast"
        :translation-is="translationIs"
        :is-guaranteed="isGuaranteed"
        :not-may-edit="notMayEdit"
        :translation="translation"
        :need-reload="needReload"
        :surfaces="surfaces"
        :settings="settings"
        :is-new="isNew"
        :rules="rules"
        v-on="$listeners"
        @change-plan-ots="$emit('load-forecast')"
      />
    </v-layout>
  </v-layout>
</template>

<script>
import PaymentPart from '../Step3/PaymentPart';
import PeriodPart from '../Step3/PeriodPart';
import SurfaceMap from '../Step2/SurfaceMap';
import StepForm from '../Step2/StepForm';

export default {
  name: 'ModifyStep23',

  components: {
    PaymentPart,
    PeriodPart,
    SurfaceMap,
    StepForm,
  },

  props: {
    maximizeReach: [Number, String],
    returnSingleSurfaces: Function,
    notAvailableSurfaces: Array,
    isMaximizeReach: Boolean,
    forecastLoading: Boolean,
    reloadForecast: Function,
    surfacesLoaded: Boolean,
    translationIs: Function,
    checkSurfaces: Function,
    isGuaranteed: Boolean,
    needReload: Boolean,
    translation: Object,
    settings: Object,
    isNew: Boolean,
    rules: Object,
  },

  data: () => ({
    selectedSurfaces: [],
  }),

  computed: {
    isMaximizeReachComp: {
      get() {
        return this.isMaximizeReach;
      },
      set(newVal) {
        this.$emit('update:is-maximize-reach', newVal);
      },
    },
    maximizeReachComp: {
      get() {
        return this.maximizeReach;
      },
      set(newVal) {
        this.$emit('update:maximize-reach', newVal);
      },
    },

    addedSurfaces: {
      get() {
        return this.translation.addedSurfaces;
      },
      set(surfaces) {
        this.$store.dispatch('translation/addSurfacesToTranslation', surfaces);
      },
    },

    surfaces() {
      return this.$store.getters['surfaces/getSurfaces'];
    },

    notMayEdit() {
      return false;
      // return this.isGuaranteed && !this.translationIs('planned');
    },
  },

  methods: {
    selectAll() {
      this.selectedSurfaces = this.returnSingleSurfaces(this.surfaces);
    },
    addSurface(surface) {
      this.addedSurfaces.push(...this.returnSingleSurfaces(surface)
        .filter(s => !this.addedSurfaces.map(s => s.id).includes(s.id))
        .filter(s => !!s.available)
      )
    },

    clearSurfaces() {
      this.$emit('clear-surfaces');
    },
    removeAddedSurfaces(surfaces) {
      this.addedSurfaces = this.addedSurfaces.filter(surface => {
        return !surfaces.find(s => s.id === surface.id);
      });
    },
  },
};
</script>