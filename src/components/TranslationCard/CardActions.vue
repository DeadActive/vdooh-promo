<template>
  <v-layout>
    <template v-if="!Number(translation.archived) && !isReadonly">
      <v-btn
        v-if="mayStop"
        :loading="statusLoading"
        text
        @click="setTranslationStatus(translation.id, 'stopped')"
      >
        <v-icon color="orange">stop</v-icon>&nbsp;Остановить
      </v-btn>

      <v-btn
        v-else-if="mayRun"
        :disabled="disabledRun"
        :loading="statusLoading"
        text
        @click="setTranslationStatus(translation.id, 'running')"
      >
        <v-icon color="success">play_arrow</v-icon>
        &nbsp;{{ 'Запустить' }}
      </v-btn>
    </template>

      <v-spacer />
      <tooltip-button
        v-if="isGuaranteedUser || isGalmedUser"
        :to="'/audience-segments/' + translation.id"
        tooltip="Сегменты Аудитории"
        icon="donut_small"
        color="primary"
        class="pr-0"
      />
      <tooltip-button
        v-if="isGuaranteedUser"
        :to="'/report-plan-fact/' + translation.id"
        tooltip="Отчет план-факт по РК"
        icon="table_chart"
        color="primary"
        class="pr-0"
      />

      <tooltip-button
        v-if="mayReport"
        :to="'/reports/translation_id/' + translation.id"
        icon="insert_chart_outlined"
        tooltip="Отчет по кампании"
        color="primary"
        class="pr-0"
      />

      <tooltip-button
        tooltip="Редактировать"
        color="primary"
        class="mx-0"
        icon="edit"
        @action="openTranslation(translation.id)"
      />

      <tooltip-button
        :loading="mediaplanLoading"
        tooltip="Сохранение медиаплана"
        color="primary"
        icon="save_alt"
        @action="exportMediaplanFor(translation.id)"
      />

      <tooltip-button
        :to="'/translations/' + translation.id + '/auction/' + translation.auction_mode"
        tooltip="Настройка ставок"
        color="primary"
        icon="gavel"
      />

      <tooltip-button
        v-if="!isReadonly"
        :loading="copyLoading"
        tooltip="Скопировать кампанию"
        icon="file_copy"
        color="primary"
        @action="copyTranslation(translation.id)"
      />
  </v-layout>
</template>

<script>
import TooltipButton from "@/components/TooltipButton";

export default {
  name: 'CardActions',

  components: {
    TooltipButton,
  },

  props: {
    currentSurfaces: Function,
    mediaplanLoading: Boolean,
    statusLoading: Boolean,
    copyLoading: Boolean,
    translation: Object,
  },

  computed: {
    isGuaranteed() {
      return this.translation.deal_group === 'gallery!';
    },
    isGuaranteedUser() {
      return this.$store.getters['auth/getIsGuaranteedClient'];
    },
    isGalmedUser() {
      return this.$store.getters['auth/getIsGalmed'];
    },
    isReadonly() {
      return this.$store.getters['auth/isReadonly'];
    },

    mayStop() {
      const {
        deal_group: dealGroup,
        achived,
        status,
      } = this.translation;

      return this.translationIs('review', 'running')
          || (this.isGuaranteed && this.translationIs('planned'));
    },
    mayRun() {
      const {
        status,
      } = this.translation;

      return this.translationIs('planned', 'stop', 'finished') && this.translation.video_id.length;
    },
    disabledRun() {
      return this.isGuaranteed
          && (!this.currentSurfaces(this.translation) || !this.translation.video_id.length)
    },

    mayReport() {
      return this.translationIs('running', 'finished', 'stop');
    },
  },

  methods: {
    translationIs(...statuses) {
      return statuses.includes(this.translation.status);
    },

    setTranslationStatus(id, status) {
      if (this.isGuaranteed && status === 'running') {
        return this.$router.push(`/translations/${id}/edit`);
      }
      return this.$emit('set-translation-status', id, status);
    },
    openTranslation(id) {
      return this.$emit('open-translation', id);
    },
    exportMediaplanFor(id) {
      return this.$emit('export-mediaplan-for', id);
    },
    copyTranslation(id) {
      return this.$emit('copy-translation', id);
    },
  },
};
</script>
