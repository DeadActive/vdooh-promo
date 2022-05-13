<template>
  <v-dialog max-width="350" v-model="dialog">
    <v-form v-model="valid" @submit.prevent="$emit('save', title)">
      <v-card>
        <v-card-text>
          <v-text-field
            v-model="title"
            :rules="[rules.required]"
            label="Название шаблона"
            ref="title"
            focusable
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >Закрыть</v-btn>
          <v-btn
            :disabled="!valid"
            color="primary"
            type="submit"
            depressed
          >Принять</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
export default {
  name: 'titleDialog',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    title: '',
    valid: false,
    rules: {
      required: v => !!v || "Обязательно к заполнению.",
    },
  }),
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
  watch: {
    dialog(dialog) {
      if (dialog) {
        this.title = '';
        this.$nextTick(this.$refs.title.focus);
      }
    },
  },
};
</script>

<style>

</style>
