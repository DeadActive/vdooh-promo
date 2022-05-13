<template>
    <v-layout
        v-bind="binding"
        class="px-4 my-3"
        justify-space-between
        align-start
        wrap
    >
        <v-flex xs12 xl9>
            <v-layout v-bind="binding" align-center>
                <p class="font-weight-medium pb-0 mb-0 pr-3 primary--text">
                    Выбор экранов:
                </p>
                <v-btn-toggle
                    borderless
                    v-model="mode"
                    class="elevation-0 dense"
                    dense
                >
                    <v-btn
                        value="all"
                        color="primary"
                        text
                        :disabled="showOnlySelected"
                    >
                        <span>Выбрать все</span>
                    </v-btn>
                    <v-btn
                        value="single"
                        :disabled="showOnlySelected"
                        text
                        color="primary"
                    >
                        <span>Одиночный</span>
                    </v-btn>
                    <v-btn
                        value="multiple"
                        :disabled="showOnlySelected"
                        text
                        color="primary"
                    >
                        <span>&nbsp;Множественный</span>
                    </v-btn>
                    <!-- <v-btn text value="route" :disabled="showOnlySelected">
            <v-icon>linear_scale</v-icon>
            <span>&nbsp;Маршрут</span>
          </v-btn> -->
                    <v-btn
                        text
                        value="polygon"
                        :disabled="showOnlySelected"
                        color="primary"
                    >
                        <span>&nbsp;Произвольная область</span>
                    </v-btn>
                    <v-btn
                        text
                        value="circle"
                        :disabled="showOnlySelected"
                        color="primary"
                    >
                        <span>&nbsp;Радиус</span>
                    </v-btn>
                </v-btn-toggle>
            </v-layout>
        </v-flex>

        <!-- <v-flex shrink>
      <v-layout>
        <v-btn
          :disabled="!selectedManySurfaces.length"
          class="ma-0 mx-2"
          color="error"
          depressed
          @click="$emit('clear-selection')"
        >Сброс</v-btn>
      </v-layout>
    </v-flex> -->
    </v-layout>
</template>

<script>
export default {
    name: 'MapSortBar',
    props: {
        value: {
            type: String,
            required: true,
        },
        showOnlySelected: {
            type: Boolean,
            default: false,
        },
        selectedManySurfaces: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        mode: {
            get() {
                return this.value;
            },
            set(mode) {
                this.$emit('input', mode);
            },
        },
        binding() {
            const binding = {};
            if (this.$vuetify.breakpoint.smAndDown) binding.column = true;
            return binding;
        },
    },
};
</script>

<style></style>
