<template>
    <v-card class="mb-1 translation-card fill-height v-layout column">
        <v-layout column fill-height class="ma-0 pa-4">
            <v-card-title class="pb-1">
                <card-title
                    :delete-loading="deleteLoading"
                    :translation="translation"
                    @recover-translation="recoverTranslation"
                    @delete-translation="deleteTranslation"
                    @open-translation="openTranslation"
                />
            </v-card-title>

            <card-media
                :real-videos-in="realVideosIn"
                :current-date="currentDate"
                :translation="translation"
            />

            <v-flex shrink class="mt-auto">
                <card-list
                    :show-auction-model-of="showAuctionModelOf"
                    :current-date="currentDate"
                    :translation="translation"
                    :current-active-surfaces="currentActiveSurfaces"
                    :current-moder-surfaces="currentModerSurfaces"
                    :current-declined-surfaces="currentDeclinedSurfaces"
                    :current-surfaces="currentSurfaces"
                    :have-days="haveDays"
                    :hours="hours"
                    :week="week"
                    class="ma-0"
                    @open-day-modal="openDayModal"
                />
            </v-flex>

            <v-dialog v-model="daysModal" max-width="600px">
                <days-modal :day="currentDay" />
            </v-dialog>

            <v-flex shrink>
                <v-card-actions class="pl-0">
                    <card-actions
                        :current-surfaces="currentSurfaces"
                        :translation="translation"
                        :mediaplan-loading="mediaplanLoading"
                        :status-loading="statusLoading"
                        :copy-loading="copyLoading"
                        @set-translation-status="setTranslationStatus"
                        @export-mediaplan-for="exportMediaplanFor"
                        @open-translation="openTranslation"
                        @copy-translation="copyTranslation"
                    />
                </v-card-actions>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
import translationMethods from "@/mixins/translationMethods";
import CardActions from "./CardActions";
import CardTitle from "./CardTitle";
import CardMedia from "./CardMedia";
import DaysModal from "./DaysModal";
import CardList from "./CardList";

const week = [
    { title: "Пн", value: "monday", hours: [] },
    { title: "Вт", value: "tuesday", hours: [] },
    { title: "Ср", value: "wednesday", hours: [] },
    { title: "Чт", value: "thursday", hours: [] },
    { title: "Пт", value: "friday", hours: [] },
    { title: "Сб", value: "saturday", hours: [] },
    { title: "Вс", value: "sunday", hours: [] },
];

export default {
    name: "TranslationCard",

    mixins: [translationMethods],

    components: {
        CardActions,
        CardTitle,
        CardMedia,
        DaysModal,
        CardList,
    },

    props: {
        deleteLoading: Boolean,
        translation: Object,
    },

    data: () => ({
        daysModal: false,
        currentDay: [],
        hours: "",
    }),

    computed: {
        haveDays() {
            return Object.values(this.week).some(
                (d) => d.hours && d.hours.length
            );
        },

        week() {
            const hours = this.translation.hours_active;
            return week.map((day) => ({
                ...day,
                hours: hours[day.value] || [],
            }));
        },
    },

    methods: {
        openTranslation(id) {
            this.$router.push({
                name: "translation.edit",
                params: { id },
            });
        },

        openDayModal(day) {
            this.daysModal = true;
            this.currentDay = day;
        },

        currentTimeClass(day) {
            return this.data.includes(day)
                ? "font-weight-medium"
                : "grey--text";
        },

        currentDate(dateTime) {
            const [year, month, day] = dateTime.split(" ")[0].split("-");
            return [day, month, year].join(".");
        },
    },
};
</script>
