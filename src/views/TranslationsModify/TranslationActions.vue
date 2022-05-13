<template>
    <v-layout align-center>
        <alert-dialog
            text="Вы уверены, что хотите отправить рекламную кампанию на модерацию?"
            title="Загружены креативы не для всех экранов"
            ref="alertDialog"
            type="warning"
            @approve="alertApprove"
        />

        <!-- <v-spacer /> -->
        <v-checkbox
            v-if="mayGetPhotoReport"
            v-model="translation.proof"
            label="Получить фотоотчет по данной РК"
            class="mr-4"
        />
        <v-checkbox
            v-if="mayBookTranslation"
            v-model="translation.book"
            label="Забронировать"
            class="mr-4"
        />

        <v-btn
            v-if="isAllbb || toPlannedSet"
            color="primary"
            class="mr-4 px-9"
            depressed
            :outlined="!lastStep"
            @click="changeStatus('planned')"
            height="48"
            >Сохранить</v-btn
        >

        <template v-else>
            <v-btn
                class="mx-2"
                color="grey"
                depressed
                text
                @click="$router.back()"
                >Отменить</v-btn
            >
        </template>

        <v-btn
            v-if="
                isAllbb ||
                toReviewSet ||
                (isGalmed && hasMoney && haveRequisites && toReviewSet)
            "
            :disabled="disabledReview"
            :color="translationIs('running') ? 'primary' : 'success'"
            depressed
            :outlined="!lastStep"
            @click="changeStatus('running')"
            height="48"
            class="px-9"
        >
            {{ "Сохранить и запустить" }}
        </v-btn>
    </v-layout>
</template>

<script>
import AlertDialog from "@/components/AlertDialog";
import { mapState } from "vuex";

export default {
    name: "TranslationActions",

    components: {
        AlertDialog,
    },

    props: {
        translationIs: Function,
        isGuaranteed: Boolean,
        changeVideo: Boolean,
        translation: Object,
        isNew: Boolean,
    },

    computed: {
        ...mapState({
            haveRequisites: "auth/requisitesOk",
            isReadonly: "auth/isReadonly",
            hasMoney: "auth/hasMoney",
        }),

        isAllbb() {
            return this.$route.query && this.$route.query.allbb;
        },

        mayGetPhotoReport() {
            return (
                this.isNew &&
                (this.translation.stepper === 4 ||
                    (this.translation.stepper === 3 && this.isGuaranteed))
            );
        },
        lastStep() {
            return (
                this.translation.stepper === 4 ||
                (this.translation.stepper === 3 && this.isGuaranteed)
            );
        },
        mayBookTranslation() {
            return (
                (this.isNew || this.translation.status == "stop") &&
                this.translation.stepper > 1 &&
                this.isGuaranteed
            );
        },
        disabledReview() {
            return (
                !this.haveRequisites ||
                !this.translation.videoID.length ||
                (this.isGuaranteed && !this.translation.book)
            );
        },

        toPlannedSet() {
            return (
                this.isNew ||
                this.translationIs(["declined", "planned", "stopped", "stop"])
            );
        },
        toReviewSet() {
            return this.isNew && this.isGuaranteed
                ? this.translation.videoID
                    ? this.translation.videoID.length
                    : this.translation.video_id.length
                : this.isNew ||
                      this.translationIs([
                          "declined",
                          "planned",
                          "stopped",
                          "stop",
                      ]) ||
                      (this.translationIs("running") && this.changeVideo);
        },
    },

    methods: {
        getVideoResolutions(surfaces) {
            const variations = surfaces.map((surface) => surface.resolution);
            return [...new Set(variations.filter((v) => !!v))];
        },

        changeStatus(status) {
            if (!["review", "running"].includes(status)) {
                return this.alertApprove({ status });
            }

            this.addedSurfaces = [];

            const currentResolutions = this.getVideoResolutions(
                this.translation.previewVideos
            );
            const allResolutions = this.getVideoResolutions(
                this.translation.addedSurfaces
            );
            let allIn = allResolutions.every((resolution) =>
                currentResolutions.find((r) => r === resolution)
            );
            if (process.env.NODE_ENV === "development") {
                allIn = currentResolutions.length >= allResolutions.length;
            }

            if (!allIn) {
                return this.$refs.alertDialog.alert({ status });
            }
            return this.alertApprove({ status });
        },

        alertApprove({ status }) {
            this.saveTranslation(status);
        },

        async saveTranslation(status) {
            this.$store.dispatch("translation/changeTranslation", { status });
            if (this.isGuaranteed && !this.translation.book) {
                this.$store.dispatch("translation/changeTranslation", {
                    status: "stopped",
                });
            }

            if (!this.isGuaranteed) {
                this.$store.dispatch("translation/changeTranslation", {
                    minIntervalSecs: this.translation.minIntervalSecs,
                });
            }

            if (this.translation.doorSurface)
                this.$store.dispatch("translation/changeTranslation", {
                    doorSurface: JSON.stringify(this.translation.doorSurface),
                });
            if (this.translation.orientationVertical)
                this.$store.dispatch("translation/changeTranslation", {
                    orientationVertical: JSON.stringify(
                        this.translation.orientationVertical
                    ),
                });

            if (
                this.translation.strategyAuto == 1 ||
                this.translation.strategyAuto == "1"
            )
                this.$store.dispatch("translation/changeTranslation", {
                    dayBudget: 0,
                });

            const { error } = await this.$store.dispatch(
                "translation/saveTranslation",
                this.translation
            );

            if (!error) {
                setTimeout(() => {
                    this.$router.push({ name: "translations.all" });
                }, 100);
            }
        },
    },
};
</script>
