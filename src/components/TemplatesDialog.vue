<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>
        <v-layout pt-3 px-2>
          <v-flex class="primary--text headline font-weight-"
          >Сохраненные шаблоны</v-flex>

          <v-flex shrink>
            <v-btn icon text @click="dialog = false" class="ma-0">
              <v-icon>close</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-text v-if="templates.length">
        <v-list>
          <template v-for="(template, index) in templates">
            <v-list-item :key="`title-${index}`" @click="$emit('load-template', template.id)" v-ripple>
              <v-list-item-content>
                {{ template.title }}
              </v-list-item-content>

              <v-list-item-action>
                <v-layout justify-end>
                  <v-tooltip top>
                    <v-btn
                      slot="activator"
                      color="error"
                      class="mx-0 mr-0"
                      icon
                      text
                      small
                      @click="$emit('delete-template', template.id)"
                    >
                      <v-icon small>close</v-icon>
                    </v-btn>
                    <span>Удалить</span>
                  </v-tooltip>
                </v-layout>
              </v-list-item-action>
            </v-list-item>

            <v-divider
              v-if="index + 1 < templates.length"
              :key="index"
            />
          </template>
        </v-list>
      </v-card-text>

      <v-card-text v-else class="text-center pb-5 title">
        Данные отсутствуют
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'TemplatesDialog',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    templates: {
      type: Array,
      default: () => [],
    }
  },
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
};
</script>

<style>

</style>
