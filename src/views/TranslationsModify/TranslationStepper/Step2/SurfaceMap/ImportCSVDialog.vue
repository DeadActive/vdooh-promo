<template>
  <v-dialog v-model="dialog" max-width="700">
    <v-card class="pa-4">
      <v-card-title class="title">
        Импорт данных из CSV
      </v-card-title>

      <v-card-text>
        <v-layout column>
          <span class="subheading mb-3">Для импорта адресной программы нужно:</span>
          <span>
            1.
            <span
              class="primary--text cursor--pointer"
              style="text-decoration: underline;"
              @click="downloadTemplate"
            >
              Скачать шаблон csv-файла
            </span>
          </span>
          <span>2. Заполнить, колонку SURFACEID, указав GID всех поверхностей</span>
          <span>3. Сохранить файл</span>
          <span>4. Загрузить измененный файл в поле ниже:</span>
        </v-layout>
      </v-card-text>

      <v-card-actions>
        <v-layout justify-end wrap>
          <v-flex xs12>
            <CSVLoader
              :extraSurfaces.sync="extraSurfaces"
              :not-available.sync="notAvailable"
              :foundedSurfaces.sync="surfaces"
              :is-guaranteed="isGuaranteed"
            />
          </v-flex>

          <v-btn
            color="primary"
            class="mt-4"
            depressed
            @click="importCSV"
          >Подтвердить</v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CSVLoader from './CSVLoader';

export default {
  name: 'ImportCSVDialog',

  components: {
    CSVLoader,
  },

  props: {
    isGuaranteed: Boolean,
    value: Boolean,
  },

  data: () => ({
    extraSurfaces: [],
    notAvailable: [],
    surfaces: [],
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

  methods: {
    downloadTemplate() {
      window.open('/img/template.csv', '_blank');
    },
    importCSV() {
      this.$emit('import', this.surfaces);
      this.surfaces = [];
      this.dialog = false;
    },
  },
};
</script>
