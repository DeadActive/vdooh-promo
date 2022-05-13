<template>
  <v-dialog max-width="500" v-model="dialog">
    <v-card class="text-center pb-3" :class="{ 'pt-5': withActions }">
      <div v-if="!withActions">
        <v-layout justify-end>
          <v-btn icon @click="decline">
            <v-icon>close</v-icon>
          </v-btn>
        </v-layout>
      </div>

      <div v-if="type" class="mt-3">
        <v-icon x-large :color="type">{{ type }}</v-icon>
      </div>

      <div v-if="title" class="title pt-4">
        {{ title }}
      </div>
      <div v-else class="title pt-3">
        <slot name="title" />
      </div>

      <v-card-text v-if="text" class="subheading font-weight-light mt-3" style="max-height: 60vh; overflow-y: auto">
        <template v-if="Array.isArray(text)">
          <div v-for="(sentence, index) in text" :key="index">
            {{ sentence }}
          </div>
        </template>
        <div v-else>{{ text }}</div>
      </v-card-text>
      <v-card-text v-else class="subheading font-weight-light">
        <slot />
      </v-card-text>

      <v-card-actions v-if="withActions">
        <v-spacer />
        <v-btn
          color="success"
          class="mx-3"
          large
          icon
          text
          @click="approve"
        >
          <v-icon large>done</v-icon>
        </v-btn>

        <v-btn
          v-if="!withoutDecline"
          color="error"
          class="mx-3"
          large
          icon
          text
          @click="decline"
        >
          <v-icon large>close</v-icon>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'AlertDialog',
  props: {
    withoutDecline: Boolean,
    title: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    text: {
      type: [String, Array],
      default: '',
    },
    withActions: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    answer: false,
    dialog: false,
    data: {},
  }),
  methods: {
    async alert(data) {
      this.dialog = true;
      this.data = data;
    },
    approve() {
      this.answer = true;
      this.$emit('approve', this.data);
      this.dialog = false;
    },
    decline() {
      this.answer = true;
      this.$emit('decline', this.data);
      this.dialog = false;
    },
  },
  watch: {
    dialog(dialog) {
      if (dialog) this.answer = false;
      if (!dialog && !this.answer && this.withActions) {
        this.$emit('decline');
      }
    }
  }
};
</script>

<style>
</style>
