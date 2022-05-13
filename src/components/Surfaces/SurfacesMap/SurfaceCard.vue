<template>
  <v-layout justify-end>
    <v-flex shrink style="z-index: 1000; min-width: 470px">
      <v-tabs
        v-if="selectedSurface.players && mapMode === 'single'"
        class="ma-2 elevation-3 mw-450"
        v-model="surfacesTabs"
      >
        <v-tab
          v-for="(player, index) in selectedSurface.players"
          :key="index"
          :href="`#tab-${index}`"
          ripple
          >Сторона {{ player.side.toUpperCase() }}</v-tab
        >

        <v-tab-item
          v-for="(player, index) in selectedSurface.players"
          :key="index"
          :value="`tab-${index}`"
        >
          <single-card
            :is-maximize-reach="isMaximizeReach"
            :checkIfAdded="checkIfAdded"
            :with-sort-bar="withSortBar"
            :door-type="doorType"
            :surface="player"
            @close="$emit('close')"
            @add-surface="$emit('add-surface', $event)"
            @remove-surface="$emit('remove-surface', $event)"
          />
        </v-tab-item>
      </v-tabs>

      <single-card
        v-else-if="
          !selectedManySurfaces.length &&
          mapMode === 'single' &&
          !selectedSurface.players
        "
        :is-maximize-reach="isMaximizeReach"
        :with-sort-bar="withSortBar"
        :checkIfAdded="checkIfAdded"
        :surface="selectedSurface"
        :door-type="doorType"
        class="ma-2"
        @close="$emit('close')"
        @add-surface="$emit('add-surface', $event)"
        @remove-surface="$emit('remove-surface', $event)"
      />

      <v-card
        class="ma-2 pa-2"
        v-else-if="mapMode !== 'single' && selectedManySurfaces.length"
      >
        <v-card-title class="py-2 pl-2 title">
          {{
            declOfNum(calculateAllScreensInAllSurfaces, [
              "Выбран",
              "Выбрано",
              "Выбрано",
            ])
          }}
          {{ calculateAllScreensInAllSurfaces }}
          {{
            declOfNum(calculateAllScreensInAllSurfaces, [
              "экран",
              "экрана",
              "экранов",
            ])
          }}
        </v-card-title>

        <v-card-actions>
          <v-slide-x-transition>
            <v-btn
              v-if="selectedManySurfaces.length && !selectAllAdded"
              :disabled="!selectedManySurfaces.length"
              color="primary"
              depressed
              @click="$emit('add-many-surfaces')"
              >Добавить выбранные</v-btn
            >
          </v-slide-x-transition>
          <v-slide-x-transition>
            <v-btn
              v-if="
                selectedManySurfaces.length &&
                (selectAllAdded || selectSomeAdded)
              "
              color="red"
              text
              dark
              @click="removeOnlyAddedSurfaces"
              >Удалить добавленные</v-btn
            >
          </v-slide-x-transition>

          <!-- <v-slide-x-transition>
            <v-btn
              v-if="mapMode !== 'all'"
              :disabled="selectedManySurfaces.length === allSurfaces.length"
              color="primary"
              depressed
              text
              @click="$emit('select-all')"
            >Выбрать все</v-btn>
          </v-slide-x-transition> -->

          <v-slide-x-transition>
            <v-btn
              :disabled="!selectedManySurfaces.length"
              class="ma-0 mx-2"
              color="error"
              text
              depressed
              @click="$emit('clear-selection')"
              >Сброс</v-btn
            >
          </v-slide-x-transition>
        </v-card-actions>
      </v-card>

      <v-layout column align-end>
        <v-slide-x-transition>
          <v-btn
            v-if="!isEditing && (mapMode === 'circle' || mapMode === 'polygon')"
            color="primary"
            depressed
            @click="$emit('start-editing')"
            >Редактирование области</v-btn
          >
        </v-slide-x-transition>

        <v-slide-x-transition>
          <v-btn
            v-if="isEditing && (mapMode === 'circle' || mapMode === 'polygon')"
            color="success"
            depressed
            @click="$emit('end-editing')"
            >Завершить редактирование</v-btn
          >
        </v-slide-x-transition>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import SingleCard from "./SingleCard";

export default {
  name: "SurfaceCard",
  components: { SingleCard },
  props: {
    mapMode: {
      type: String,
      default: "single",
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    selectedSurface: {
      type: Object,
      default: () => ({}),
    },
    selectedManySurfaces: {
      type: Array,
      default: () => [],
    },
    allSurfaces: {
      type: Array,
      default: () => [],
    },
    addedSurfaces: {
      type: Array,
      default: () => [],
    },
    doorType: {
      type: String,
      default: "",
    },
    withSortBar: {
      type: Boolean,
      default: false,
    },
    isMaximizeReach: Boolean,
  },
  data: () => ({
    surfacesTabs: null,
  }),
  computed: {
    calculateAllScreensInAllSurfaces() {
      const withSites = this.selectedManySurfaces.filter((s) => !!s.players),
        withoutSites = this.selectedManySurfaces.filter(
          (s) => !s.players && s.available
        ),
        withSitesLength = withSites.reduce(
          (summ, current) =>
            summ + current.players.filter((p) => p.available).length,
          0
        );

      return withoutSites.length + withSitesLength;
    },

    selectAllAdded() {
      return this.getSingleSurfaces(this.selectedManySurfaces)
        .filter((s) => s.available)
        .map((s) => s.id)
        .every((id) => this.addedSurfaces.map((s) => s.id).includes(id));
    },
    selectSomeAdded() {
      return this.getSingleSurfaces(this.selectedManySurfaces)
        .filter((s) => s.available)
        .map((surface) => !!this.addedSurfaces.find((s) => s.id === surface.id))
        .filter((s) => s).length;
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
    getSingleSurfaces(surfaces) {
      const allSurfaces = [];
      surfaces.map((surface) =>
        surface.players
          ? allSurfaces.push(...surface.players)
          : allSurfaces.push(surface)
      );

      return allSurfaces;
    },

    checkIfAdded(SURFACEID, NETWORKID) {
      return !!this.addedSurfaces.find(
        (s) => s.SURFACEID === SURFACEID && s.NETWORKID === NETWORKID
      );
    },

    removeOnlyAddedSurfaces() {
      this.$emit(
        "remove-only-added-surfaces",
        this.getSingleSurfaces(this.selectedManySurfaces)
      );
    },
  },
};
</script>

<style scoped>
.mw-450 {
  max-width: 450px;
}
</style>
