<template>
  <v-tooltip
    :bottom="bottom"
    :right="right"
    :left="left"
    :top="top"
  >
    <template #activator="{ on }">
      <v-btn
        :class="`${textColor}--text text--darken-${darken} text--lighten-${lighten}`"
        :color="currentColor"
        :loading="loading"
        :large="large"
        :small="small"
        :text="text"
        :to="to"
        v-on="on"
        icon
        @click.prevent="action"
      >
        <v-icon
          :large="large"
          :small="small"
        >
          <slot name="icon">{{ icon }}</slot>
        </v-icon>
      </v-btn>
    </template>

    <slot name="tooltip">{{ tooltip }}</slot>
  </v-tooltip>
</template>

<script>
export default {
  name: 'TooltipButton',
  props: {
    text: {
      type: Boolean,
      default: true,
    },
    top: {
      type: Boolean,
      default: true,
    },
    textColor: {
      type: String,
      default: 'grey',
    },
    lighten: [String, Number],
    darken: [String, Number],
    disabled: Boolean,
    loading: Boolean,
    tooltip: String,
    bottom: Boolean,
    small: Boolean,
    large: Boolean,
    right: Boolean,
    left: Boolean,
    color: String,
    icon: String,
    to: String,
  },

  computed: {
    currentColor() {
      if (this.disabled) return 'grey';
      return this.color;
    }
  },

  methods: {
    action() {
      if (this.disabled) return;
      this.$emit('action');
    },
  },
};
</script>
