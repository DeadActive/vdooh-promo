<template>
  <v-dialog v-model="dialog" max-width="900">
    <v-card>
      <v-layout justify-end class="overlay-activator">
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-layout>
      <div>
        <v-img :aspect-ratio="aspectRatio" :src="src" />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ImageDialog',

  props: {
    aspectRatio: [String, Number],
    value: Boolean,
    src: String,
  },

  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(dialog) {
        this.$emit('input', dialog);
      },
    },
  },
};
</script>

<style>
  .overlay-activator {
    position: absolute;
    right: 10px;
    top: 5px;
    z-index: 9999;
  }
</style>
