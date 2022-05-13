<template>
  <v-dialog v-model="dialog" max-width="1000px">
    <v-card>
      <v-card-title v-if="title" >
        <v-layout justify-space-between>
          <v-flex shrink class="headline font-weight-medium pt-2">
            {{ title }}
          </v-flex>

          <v-flex shrink>
            <v-btn
              icon
              @click="dialog = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <video
        :src="$appUrl + '/media/' + filename"
        width="100%"
        controls
      />
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DialogVideo',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
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

</style>
