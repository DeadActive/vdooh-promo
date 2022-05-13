<template>
  <v-tooltip
    :bottom="bottom"
    :right="right"
    :left="left"
    :top="top"
  >
    <template #activator="{ on }">
      <v-icon
        class="cursor--pointer"
        :large="large"
        :small="small"
        :color="color"
        v-on="on"
      >
        help_outline
      </v-icon>
    </template>
    {{ tooltip }}
  </v-tooltip>
</template>

<script>
export default {
  name: 'TooltipButton',
  props: {
    top: {
      type: Boolean,
      default: true,
    },
    tooltip: { type: String },
    bottom: { type: Boolean },
    small: { type: Boolean },
    large: { type: Boolean },
    right: { type: Boolean },
    left: { type: Boolean },
    color: { type: String },
  },
};
</script>
