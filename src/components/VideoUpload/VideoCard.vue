<template>
  <v-card width="400px" class="ma-1">
    <v-card-title>
      <v-layout justify-space-between align-end>
        <span class="subheading font-weight-medium">{{ video.original_filename || currentFilename }}</span>
        <span class="caption grey--text">id: {{ video.id }}</span>
      </v-layout>
    </v-card-title>

    <video
      :src="currentSrc"
      style="max-height: 300px"
      class="mt-3"
      width="97%"
      controls
    />

    <toggle-element v-if="mediaParams.length" title="Медиапараметры" flat>
      <v-layout column px-4 mx-1 pt-2 mb-2>
        <v-layout
          v-for="mediaParam in mediaParams"
          :key="mediaParam.value"
          justify-space-between
          wrap
        >
          <v-flex shrink>
            {{ mediaParam.text }}
          </v-flex>
          <v-flex shrink>
            <span class="font-weight-medium">
              {{ mediaParam.value }}
            </span>
          </v-flex>
        </v-layout>
      </v-layout>
    </toggle-element>

    <v-card-actions v-if="!withoutDelete">
      <v-spacer />
      <v-btn
        color="red"
        text
        @click="$emit('delete')"
      >Удалить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ToggleElement from '@/components/ToggleElement';

export default {
  name: 'VideoCard',

  components: {
    ToggleElement,
  },

  props: {
    withoutDelete: Boolean,
    video: Object,
  },

  computed: {
    currentSrc() {
      return this.video.src || (this.$appUrl + "/media/" + this.currentFilename);
    },
    currentFilename() {
      return this.video.filename || this.video.video_filename;
    },
    mediaParams() {
      if (!this.video.media_params) return [];

      const [type, resolution, time] = this.video.media_params.split(',');
      return [
        { text: 'Тип файла',        value: type },
        { text: 'Разрешение видео', value: resolution },
        { text: 'Время',            value: time },
      ];
    }
  },
};
</script>
