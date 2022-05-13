<template>
  <v-layout wrap>
    <template v-if="!(foundedSurfaces && foundedSurfaces.length)">
      <v-btn
        color="primary"
        outlined
        large
        @click="$refs.inputCSVUpload.click()"
      >Нажмите для импорта CSV-файла</v-btn>

      <input
        v-show="false"
        ref="inputCSVUpload"
        accept=".csv"
        type="file"
        @change="importCSV()"
      >
    </template>

    <template v-if="loaded">
      <v-layout wrap>
        <v-flex xs12 pl-4>
          <v-layout justify-space-between align-center wrap>
            <v-flex xs12 mb-n1>
              <span class="subheading font-weight-bold">Файл: </span> {{ filename }}
            </v-flex>
            <div class="subheading font-weight-bold">Импортированные поверхности ({{ foundedSurfaces.length }}):</div>

            <v-btn
              color="error"
              text
              @click="removeUploadedSurfaces"
            >Очистить</v-btn>
          </v-layout>
        </v-flex>

        <v-flex xs12 class="surfaces-list" v-if="foundedSurfaces.length">
          <v-list two-line>
            <v-layout justify-space-between wrap>
              <v-flex
                v-for="(surface, index) in foundedSurfaces"
                :key="surface.SURFACEID + index"
                xs5
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ surface.SURFACEID }}</v-list-item-title>
                    <v-list-item-subtitle>{{ surface.NETWORKID }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <tooltip-button
                      tooltip="Убрать эту поверхность"
                      color="error"
                      icon="delete"
                      text
                      @action="deleteSurface(surface.SURFACEID, surface.NETWORKID)"
                    />
                  </v-list-item-action>
                </v-list-item>
              </v-flex>
            </v-layout>
          </v-list>
        </v-flex>

        <v-flex xs12 v-else>
          Ни один экран не был найден. <!-- Либо был загружен файл с неккоректным разрешением, либо не была соблюдена  -->
        </v-flex>
      </v-layout>

      <v-layout wrap v-if="extraSurfaces.length" class="mt-4">
        <v-flex xs12>
          <v-layout justify-space-between align-center>
            <div class="subheading font-weight-bold">Ненайденные поверхности ({{ extraSurfaces.length }}):</div>
          </v-layout>
        </v-flex>

        <v-flex xs12 class="surfaces-list">
          <v-list>
            <v-layout justify-space-between wrap>
              <v-flex
                v-for="(surface, index) in extraSurfaces"
                :key="surface.SURFACEID + index"
                xs3
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{ surface.SURFACEID }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-flex>
            </v-layout>
          </v-list>
        </v-flex>
      </v-layout>

      <v-layout wrap v-if="notAvailable.length" class="mt-4">
        <v-flex xs12>
          <v-layout justify-space-between align-center>
            <div class="subheading font-weight-bold red--text text--darken-2">Недоступные поверхности ({{ notAvailable.length }}):</div>
          </v-layout>
        </v-flex>

        <v-flex xs12 class="surfaces-list">
          <v-list>
            <v-layout justify-space-between wrap>
              <v-flex
                v-for="(surface, index) in notAvailable"
                :key="surface.SURFACEID + index"
                xs3
              >
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="red--text text--darken-2">{{ surface.SURFACEID }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-flex>
            </v-layout>
          </v-list>
        </v-flex>
      </v-layout>
    </template>
  </v-layout>
</template>

<script>
import csvParser from "papaparse";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import TooltipButton from '@/components/TooltipButton';

export default {
  name: 'CSVLoader',

  components: {
    vueDropzone: vue2Dropzone,
    TooltipButton,
  },

  props: {
    foundedSurfaces: Array,
    extraSurfaces: Array,
    notAvailable: Array,
    isGuaranteed: Boolean,
  },

  data: () => ({
    loaded: false,
    filename: '',

    dropzoneOptions: {
      paramName: "csv",
      acceptedFiles: ".csv",
      url: 'https://httpbin.org/post',

      maxFiles: 1,
      maxFilesize: 50,

      addRemoveLinks: true,
      createImageThumbnails: false,

      dictRemoveFile: "Удалить",
      dictCancelUpload: "Отменить загрузку",
      dictInvalidFileType: "Нужно загрузить файл в формате csv",

      dictDefaultMessage:
        "<i class='material-icons'>cloud_upload</i><span style='position:relative;top:-6px;'> Кликните или просто перетащите в это поле видеофайл</span>",
      dictResponseError:
        "Возникла проблема на сервере. Свяжитесь с нами или попробуйте позже",
      dictMaxFilesExceeded:
        "Можно загрузить только один файл. Удалите лишний",
      dictFileTooBig:
        "Размер файла больше 50 мегабайт, мы не сможем его использовать"
    },
  }),

  computed: {
    surfaces() {
      return this.$store.getters['surfaces/getSurfaces'];
    },
  },

  methods: {
    removeUploadedSurfaces() {
      this.loaded = false;
      this.$emit('update:foundedSurfaces', []);
      this.$emit('update:extraSurfaces', []);
      this.$emit('update:notAvailable', []);
      this.$refs.inputCSVUpload.value = '';
    },
    deleteSurface(SURFACEID, NETWORKID) {
      const surfaces = this.foundedSurfaces.filter(
        surface => !((NETWORKID === surface.NETWORKID) && (SURFACEID === surface.SURFACEID))
      );
      this.$emit('update:foundedSurfaces', surfaces);
    },
    importCSV() {
      this.loaded = true;
      const file = this.$refs.inputCSVUpload.files[0];
      if (!file.name || file.name.split('.')[1] !== 'csv') return;
      this.filename = file.name;

      const csv = csvParser.parse(file, {
        delimiter: ';',
        header: true,
        complete: results => {
          const output = results.data;

          const surfaces = this.surfaces.flatMap(i => i.players || i);
          const foundSurfaces = [];
          const extraSurfaces = [];
          const notAvailable = [];

          output.forEach(item => {
            const SURFACEID = item.SURFACEID.replace('/0x23/', '#');
            if (!SURFACEID) return;

            const find = surfaces.find(surface => surface.SURFACEID === SURFACEID);
            if (this.isGuaranteed && find && !find.available) {
              return notAvailable.push(find);
            }

            if (find) {
              if (!foundSurfaces.find(s => SURFACEID === s.SURFACEID)) {
                return foundSurfaces.push(find)
              }
            }
            return extraSurfaces.push(item);
          });

          this.$emit('update:foundedSurfaces', foundSurfaces);
          this.$emit('update:extraSurfaces', extraSurfaces);
          this.$emit('update:notAvailable', notAvailable);
        }
      });
    },
  },
};
</script>

<style scoped>
  #dropzone {
    width: 100%;
  }
  .placeholder {
    background-color: #f1f1f1;
    border: 2px dashed #5C6BC0;
  }
  .surfaces-list {
    max-height: 50vh;
    overflow-y: auto;
  }
</style>
