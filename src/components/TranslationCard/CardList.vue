<template>
    <v-layout column fill-height>
        <v-list dense class="pa-0" style="width: 100%">
            <v-list-item>
                <v-list-item-content>Даты проведения</v-list-item-content>
                <v-list-item-content class="align-end">
                    <v-list-item-title class="text-right black--text">
                        с
                        <span class="font-weight-medium">{{
                            currentDate(translation.date_from)
                        }}</span>
                        по
                        <span class="font-weight-medium">{{
                            currentDate(translation.date_to)
                        }}</span>
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <template v-for="infoItem in infos">
                <v-list-item v-if="infoItem.condition" :key="infoItem.header">
                    <v-list-item-content>{{
                        infoItem.header
                    }}</v-list-item-content>
                    <v-list-item-action
                        class="align-end font-weight-medium text-right black--text"
                        >{{ infoItem.value }}</v-list-item-action
                    >
                </v-list-item>
            </template>

            <template>
                <v-list-item>
                    <v-layout row>
                        <v-col v-if="countBillboard">
                            <v-layout column align-center>
                                <v-img
                                    src="/img/icons/billboard.svg"
                                    width="48"
                                    height="48"
                                ></v-img>
                                <div class="d-flex align-center flex-column">
                                    <span
                                        class="success--text"
                                        v-if="activeBillboard"
                                    >
                                        <v-icon color="success" class="mr-1"
                                            >check</v-icon
                                        >
                                        <b>{{ activeBillboard }}</b>
                                    </span>
                                    <span
                                        class="warning--text"
                                        v-if="moderBillboard !== errorBillboard"
                                    >
                                        <v-icon color="warning" class="mr-1"
                                            >autorenew</v-icon
                                        >
                                        <b>{{ moderBillboard }}</b>
                                    </span>
                                    <span
                                        class="error--text"
                                        v-if="errorBillboard"
                                    >
                                        <v-icon color="error" class="mr-1"
                                            >highlight_off</v-icon
                                        >
                                        <b>{{ errorBillboard }}</b>
                                    </span>
                                </div>
                            </v-layout>
                        </v-col>
                        <v-col v-if="countSuperSite">
                            <v-layout column align-center>
                                <v-img
                                    src="/img/icons/supersite.svg"
                                    width="48"
                                    height="48"
                                ></v-img>
                                <div class="d-flex align-center flex-column">
                                    <span
                                        class="success--text"
                                        v-if="activeSuperSite"
                                    >
                                        <v-icon color="success" class="mr-1"
                                            >check</v-icon
                                        >
                                        <b>{{ activeSuperSite }}</b>
                                    </span>
                                    <span
                                        class="warning--text"
                                        v-if="moderSuperSite != errorSuperSite"
                                    >
                                        <v-icon color="warning" class="mr-1"
                                            >autorenew</v-icon
                                        >
                                        <b>{{ moderSuperSite }}</b>
                                    </span>
                                    <span
                                        class="error--text"
                                        v-if="errorSuperSite"
                                    >
                                        <v-icon color="error" class="mr-1"
                                            >highlight_off</v-icon
                                        >
                                        <b>{{ errorSuperSite }}</b>
                                    </span>
                                </div>
                            </v-layout>
                        </v-col>
                        <v-col v-if="countCityBoard">
                            <v-layout column align-center>
                                <v-img
                                    src="/img/icons/cityboard.svg"
                                    width="48"
                                    height="48"
                                ></v-img>
                                <div class="d-flex align-center flex-column">
                                    <span
                                        class="success--text"
                                        v-if="activeCityBoard"
                                    >
                                        <v-icon color="success" class="mr-1"
                                            >check</v-icon
                                        >
                                        <b>{{ activeCityBoard }}</b>
                                    </span>
                                    <span
                                        class="warning--text"
                                        v-if="moderCityBoard !== errorCityBoard"
                                    >
                                        <v-icon color="warning" class="mr-1"
                                            >autorenew</v-icon
                                        >
                                        <b>{{ moderCityBoard }}</b>
                                    </span>
                                    <span
                                        class="error--text"
                                        v-if="errorCityBoard"
                                    >
                                        <v-icon color="error" class="mr-1"
                                            >highlight_off</v-icon
                                        >
                                        <b>{{ errorCityBoard }}</b>
                                    </span>
                                </div>
                            </v-layout>
                        </v-col>
                    </v-layout>
                </v-list-item>
            </template>

            <template>
                <v-list-item>
                    <v-list-item-content class="font-weight-medium"
                        >Дни показов:</v-list-item-content
                    >
                </v-list-item>

                <v-list-item>
                    <v-layout
                        justify-space-around
                        align-center
                        class="mx-5 days mt-0"
                    >
                        <v-tooltip
                            v-for="(day, index) in week"
                            :key="day.value"
                            top
                        >
                            <template #activator="{ on }">
                                <v-layout
                                    class="mb-0"
                                    align-center
                                    column
                                    @click="openDayModal(day)"
                                >
                                    <div
                                        :class="currentColor(day.hours)"
                                        class="cube cursor--pointer"
                                        v-on="on"
                                    />

                                    <div
                                        :class="
                                            day.value === hours &&
                                            currentTextColor(day.hours) +
                                                ' font-weight-bold'
                                        "
                                        class="mt-0"
                                    >
                                        {{ day.title }}
                                    </div>
                                </v-layout>
                            </template>
                            {{ currentText(day.hours) }}
                        </v-tooltip>
                    </v-layout>
                </v-list-item>

                <!-- <v-list-item>
          <v-list-item-content
            class="cursor--pointer primary--text font-weight-medium"
            @click="openDaysModal"
          >Отобразить часы показов по дням</v-list-item-content>
        </v-list-item> -->
            </template>
        </v-list>
    </v-layout>
</template>

<script>
import _ from "lodash";

export default {
    name: "CardList",

    props: {
        currentActiveSurfaces: Function,
        currentModerSurfaces: Function,
        showAuctionModelOf: Function,
        currentSurfaces: Function,
        currentDeclinedSurfaces: Function,
        currentDate: Function,
        translation: Object,
        haveDays: Boolean,
        hours: String,
        week: Array,
    },

    computed: {
        infos() {
            const {
                limit_control_mode: limitControlMode,
                PPV_cost_night_RUR: PPVnight,
                day_budget_RUR: dayBudget,
                auction_mode: auctionMode,
                PPV_cost_day_RUR: PPVday,
                deal_group: dealGroup,
                OTS_cost_RUR: OTScost,
                budget_RUR: budget,
                door,
            } = this.translation;

            const isGuaranteed = dealGroup === "gallery!";
            const byDisplay = !!Number(limitControlMode);
            const currentAuctionModel = this.showAuctionModelOf(
                auctionMode,
                dealGroup,
                byDisplay
            );
            const isPPV = currentAuctionModel === "PPV";
            const isCPT = currentAuctionModel === "CPT";

            const guaranteedDisplay =
                parseFloat(PPVday).toFixed(2).toLocaleString() + " руб.";
            const CPTcost =
                parseFloat(OTScost).toFixed(2).toLocaleString() + " руб.";
            const PPVcost =
                parseFloat(PPVday).toFixed(2).toLocaleString() +
                " руб. / " +
                parseFloat(PPVnight).toFixed(2).toLocaleString() +
                "руб.";

            const guaranteedCost = byDisplay ? guaranteedDisplay : CPTcost;

            return [
                {
                    value: parseFloat(budget).toLocaleString() + " руб.",
                    header: "Бюджет",
                    condition: true,
                },
                {
                    value: dayBudget
                        ? parseFloat(dayBudget).toLocaleString() + " руб."
                        : "Не указан",
                    header: "Дневной лимит",
                    condition: true,
                },
                {
                    value: currentAuctionModel,
                    header: "Модель аукциона",
                    condition: true,
                },
                {
                    value: guaranteedCost,
                    header: "Ставка",
                    condition: isGuaranteed,
                },
                { value: CPTcost, header: "Ставка CPT", condition: isCPT },
                {
                    value: PPVcost,
                    header: "Дневная / ночная ставка",
                    condition: isPPV,
                },

                {
                    value: door.charAt(0).toUpperCase() + door.slice(1),
                    header: "Размещение",
                    condition: true,
                },
            ];
        },
        activeBillboard() {
            return this.currentActiveSurfaces(
                this.filterBillboard(this.translation)
            );
        },
        moderBillboard() {
            return this.currentModerSurfaces(
                this.filterBillboard(this.translation)
            );
        },
        errorBillboard() {
            return this.currentDeclinedSurfaces(
                this.filterBillboard(this.translation)
            );
        },
        activeSuperSite() {
            return this.currentActiveSurfaces(
                this.filterSuperSite(this.translation)
            );
        },
        moderSuperSite() {
            return this.currentModerSurfaces(
                this.filterSuperSite(this.translation)
            );
        },
        errorSuperSite() {
            return this.currentDeclinedSurfaces(
                this.filterSuperSite(this.translation)
            );
        },
        activeCityBoard() {
            return this.currentActiveSurfaces(
                this.filterCityBoards(this.translation)
            );
        },
        moderCityBoard() {
            return this.currentModerSurfaces(
                this.filterCityBoards(this.translation)
            );
        },
        errorCityBoard() {
            return this.currentDeclinedSurfaces(
                this.filterCityBoards(this.translation)
            );
        },
        countBillboard() {
            return this.translation.resources.filter((i) => i.format === "6x3")
                .length;
        },
        countSuperSite() {
            return this.translation.resources.filter(
                (i) => i.format === "12x4" || i.format === "15x5"
            ).length;
        },
        countCityBoard() {
            return this.translation.resources.filter(
                (i) => i.format && i.format.toLowerCase() === "3.7x2.7"
            ).length;
        },
    },

    methods: {
        openDayModal(day) {
            const { hours } = day;
            if (!hours || !hours.length || hours.length === 24) return;
            return this.$emit("open-day-modal", day);
        },

        currentColor(hours) {
            if (!hours || !hours.length) return "grey lighten-1";
            if (hours.length === 24) return "green darken-1";
            return "orange darken-1";
        },
        currentTextColor(hours) {
            if (!hours || !hours.length) return "grey--text text--lighten-1";
            if (hours.length === 24) return "green--text text--darken-1";
            return "orange--text text--darken-1";
        },
        currentText(hours) {
            if (!hours || !hours.length) return "Показы в этот день отключены";
            if (hours.length === 24) return "Показы круглосуточно";
            return "Нажмите для просмотра часов";
        },
        filterBillboard(items) {
            const translation = _.cloneDeep(this.translation);
            translation.resources = items.resources.filter(
                (i) => i.format === "6x3"
            );
            return translation;
        },
        filterSuperSite(items) {
            const translation = _.cloneDeep(this.translation);
            translation.resources = items.resources.filter(
                (i) => i.format === "12x4" || i.format === "15x5"
            );
            return translation;
        },
        filterCityBoards(items) {
            const translation = _.cloneDeep(this.translation);
            translation.resources = items.resources.filter(
                (i) => i.format && i.format.toLowerCase() === "3.7x2.7"
            );
            return translation;
        },
    },
};
</script>

<style scoped>
.cube {
    width: 20px;
    height: 20px;
    border-radius: 3px;
}
.days .layout:first-child {
    margin-top: 0 !important;
}
</style>
