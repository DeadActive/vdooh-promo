<template>
  <v-expansion-panels
    v-model="toggle"
    :dark="dark"
    :flat="flat"
  >
    <v-expansion-panel>
      <v-expansion-panel-header>
        <slot name="title">
         <h4>{{ title }}</h4>
        </slot>
      </v-expansion-panel-header>

      <v-expansion-panel-content>
        <slot />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'ToggleElement',

  props: {
    value: [Boolean, Number],
    dark: Boolean,
    flat: Boolean,
    title: String,
  },

  computed: {
    toggle: {
      get() {
        return this.value ? 0 : undefined;
      },
      set(toggle) {
        this.$emit('input', this.value === 0);
      },
    },
  },
};
</script>
