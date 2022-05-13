<template>
  <v-dialog v-model="dialog" max-width="80%" class="videoList">
    <v-card>
      <v-toolbar dark color="primary" fixed>
        <v-btn icon dark @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>

        <v-toolbar-title>Выбор видео из одобренных ранее</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            :disabled="!selected.length"
            dark
            text
            @click="$emit('select-video', selected)"
          >Выбрать</v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-layout>
        <v-card-text>
          <v-data-iterator
            :footer-props="footerCardProps"
            :items-per-page="6"
            :items="videos"
          >
            <template #default="props">
              <v-row>
                <v-col
                  v-for="item in props.items"
                  :key="item.name"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card>
                    <v-card-title primary-title class="pt-4 pb-1 px-4 mb-3">
                      <v-layout column>
                        <div
                          class="headline text-truncate"
                          style="cursor: pointer;"
                        >{{ item.original_filename || 'Название файла' }}</div>

                        <div class="grey--text caption font-weight-regular pt-2">id: {{ item.id }}</div>
                        <div class="grey--text caption font-weight-regular">Название файла: {{ item.filename }}</div>
                      </v-layout>
                    </v-card-title>

                    <v-btn
                      :color="selected.includes(item) ? 'success' : 'primary'"
                      class="white--text"
                      absolute
                      bottom
                      medum
                      right
                      fab
                      @click="toggleSelected(item)"
                    >
                      <v-icon v-if="selected.includes(item)">done</v-icon>
                      <v-icon v-else>add</v-icon>
                    </v-btn>

                    <video
                      :src="$appUrl+'/media/'+item.filename"
                      style="height: 300px"
                      class="mt-3"
                      width="97%"
                      controls
                    />
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-data-iterator>
        </v-card-text>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ApprovedDialog",

  props: {
    selectedVideo: Array,
    value: Boolean,
    videos: Array
  },

  data: vm => ({
    footerCardProps: vm.$store.getters.getFooterProps.card,
    selected: [],
  }),

  computed: {
    dialog: {
      get() {
        return this.value;
      },
      set(dialog) {
        this.$emit("input", dialog);
      },
    },
  },

  methods: {
    toggleSelected(item) {
      if (this.selected.includes(item)) {
        this.selected = this.selected.filter(s => s !== item);
      }
      else this.selected.push(item)
    }
  },

  watch: {
    selectedVideo(newVal) {
      this.selected = this.selected.filter(video =>
        newVal.find(v => v.id === video.id)
      );
    }
  }
};
</script>
