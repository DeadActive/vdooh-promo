<template>
  <v-layout fill-height class="mx-0">
    <v-img :aspect-ratio="aspectRatio" :src="src" />

    <image-dialog v-model="overlay" :src="src" />

    <div class="overlay-activator">
      <v-tooltip top>
        <template #activator="{ on }">
          <slot name="activator">
            <v-btn
              color="white"
              style="opacity: 0.9"
              small
              outlined
              fab
              @click="openOverlay"
              v-on="on"
            >
              <v-icon>zoom_out_map</v-icon>
            </v-btn>
          </slot>
        </template>
        Нажмите для увеличения
      </v-tooltip>
    </div>
  </v-layout>
</template>

<script>
import ImageDialog from './ImageDialog';

export default {
  name: 'ImageOverlay',

  components: {
    ImageDialog,
  },

  props: {
    aspectRatio: [String, Number],
    src: [String, Object],
  },

  data: () => ({
    overlay: false,
  }),

  methods: {
    openOverlay() {
      this.overlay = true;
    }
  },
};
</script>

<style>
  .overlay-activator {
    position: absolute;
    right: 10px;
    top: 5px;
  }
</style>
