<template>
    <v-layout column>
        <v-layout v-if="loading" justify-center>
            <v-progress-circular color="primary" size="350" indeterminate />
        </v-layout>

        <template v-else>
            <v-card class="mb-4 elevation-0">
                <translation-stepper
                    :translation.sync="translation"
                    :translation-is="translationIs"
                    :steppers.sync="steppers"
                    :is-new="isNew"
                    @change-video="changeVideo = true"
                />
            </v-card>
        </template>
    </v-layout>
</template>

<script>
import TranslationStepper from "./TranslationStepper";
import TranslationActions from "./TranslationActions";
import moment from "moment";
import { mapGetters, mapState } from "vuex";

let isReload = true;
let isAllBB = false;

export default {
    name: "TranslationModify",

    components: {
        TranslationStepper,
        TranslationActions,
    },

    beforeRouteEnter(to, from, next) {
        next();
    },

    created() {
        this.loading = true;
        //this.clearSurfaces();

        if (this.isNew) {
            this.translation.stepper = 1;
            this.newTranslation();
            this.$store.dispatch("translation/changeTranslation", {
                endDate: moment().subtract(-2, "days").format("YYYY-MM-DD"),
            });
            this.$store.dispatch("translation/changeTranslation", {
                startDate: moment().format("YYYY-MM-DD"),
            });
            this.loading = false;
        }
    },

    data: () => ({
        changeVideo: false,
        loading: true,
    }),

    computed: {
        ...mapState("translation", ["translation"]),

        id() {
            return this.$route.params.id;
        },
        isNew() {
            return !this.id;
        },

        steppers() {
            const steppers = [
                {
                    step: 1,
                    title: "Основные данные",
                    condition: () => true,
                    wasVisited: true,
                    valid: true,
                },
                {
                    step: 2,
                    title: "Выбор поверхностей",
                    condition: () => true,
                    wasVisited: false,
                    valid: true,
                },
                {
                    step: 3,
                    title: "Период и оплата",
                    condition: () => true,
                    wasVisited: false,
                    valid: true,
                },
            ];

            steppers.push({
                step: 4,
                // condition: (translation) => !!translation.videoID.length,
                condition: (translation) => true,
                title: "Загрузка фото",
                wasVisited: !this.isNew,
                valid: true,
            });
            return steppers;
        },
    },

    methods: {
        /**
         * Проверка принадлежности РК к переданным статусам
         * @param {String | Array} statuses Статус или массив статусов, которые нужно проверить
         */
        translationIs(statuses) {
            const status = this.translation.status;
            const statusArray = Array.isArray(statuses)
                ? statuses.slice()
                : [statuses];

            return statusArray.some((s) => status === s);
        },

        async newTranslation() {
            this.clearTranslation();
            await this.$store.dispatch("translation/newTranslation");

            Object.values(this.translation.detailWeek).forEach((day) => {
                day.hours = Array(24)
                    .fill(null)
                    .map((_, index) => index);
            });
            Object.values(this.translation.notDetailWeek).forEach((day) => {
                day.hours = Array(24)
                    .fill(null)
                    .map((_, index) => index);
            });
        },
        async loadTranslation(id, step, surfaces) {
            const { data } = await this.$store.dispatch(
                "translation/loadTranslation",
                { id, step }
            );

            this.loading = false;

            if (!step) {
                // this.$store.dispatch('translation/changeTranslation', { addedSurfaces: [] });
                // this.addSurface(data.resources);
            }
            if (surfaces && surfaces.length) {
                // this.addedSurfaces = [...surfaces];
                // this.$store.dispatch('translation/changeTranslation', { selectedSurfaces: [...surfaces] });
            }
        },

        clearTranslation() {
            return this.$store.dispatch("translation/clearTranslation");
        },
    },
};
</script>
