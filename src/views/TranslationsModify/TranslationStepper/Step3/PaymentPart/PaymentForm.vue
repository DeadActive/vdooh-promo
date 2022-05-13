<template>
    <v-layout column>
        <v-flex xs12 v-if="isGuaranteed && !isLimitControlMode">
            <h3 class="mb-0 mt-2">Стратегия выполнения плана</h3>
            <v-layout align-center>
                <span
                    class="body-1 text--darken-1 grey--text mr-2 cursor--pointer"
                    :class="{
                        'primary--text font-weight-medium': !isAutoStrategy,
                    }"
                    @click="changeStrategy(false)"
                    >Ручная</span
                >
                <v-switch v-model="isAutoStrategy" />
                <span
                    class="body-1 text--darken-1 grey--text ml-2 cursor--pointer"
                    :class="{
                        'primary--text font-weight-medium': isAutoStrategy,
                    }"
                    @click="changeStrategy(true)"
                    >Автоматическая</span
                >
            </v-layout>
        </v-flex>

        <v-flex xs12 md8>
            <v-select
                v-if="isGuaranteed && isAutoStrategy"
                v-model="translation.strategyAutoMode"
                :items="strategyAutoModes"
                :rules="[rules.required]"
                label="Стратегия"
            />

            <v-text-field
                v-if="budgetFocus"
                v-model="translation.budget"
                :rules="[rules.required]"
                :disabled="notMayEdit"
                oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                label="Бюджет рекламной кампании"
                max="100000000"
                type="number"
                class="mt-3"
                ref="budget"
                suffix="₽"
                min="1"
                @input="calcSumOhvat"
                @blur="budgetFocus = false"
                outlined
                dense
            />
            <v-text-field
                v-else
                :value="Number(translation.budget).toLocaleString('ru')"
                :rules="[rules.required]"
                :disabled="notMayEdit"
                label="Бюджет рекламной кампании"
                class="mt-3"
                suffix="₽"
                @focus="budgetFocus = true"
                outlined
                dense
            />

            <template v-if="!isAutoStrategy">
                <v-text-field
                    v-if="dayBudgetFocus"
                    v-model="translation.dayBudget"
                    :rules="validDayBudget ? [] : [rules.maxDayBudget]"
                    :disabled="notMayEdit"
                    oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                    hint="Допустимые траты бюджета в рамках одного дня"
                    label="Дневной лимит по бюджету"
                    max="100000000"
                    ref="dayBudget"
                    type="number"
                    suffix="₽"
                    min="0"
                    not-visible-null
                    @blur="dayBudgetFocus = false"
                    @input="calculateLimit('dayPlanOTS')"
                    outlined
                    dense
                />
                <v-text-field
                    v-else
                    :value="Number(translation.dayBudget).toLocaleString('ru')"
                    :rules="validDayBudget ? [] : [rules.maxDayBudget]"
                    :disabled="notMayEdit"
                    hint="Допустимые траты бюджета в рамках одного дня"
                    label="Дневной лимит по бюджету"
                    suffix="₽"
                    @focus="dayBudgetFocus = true"
                    outlined
                    dense
                />
            </template>

            <template
                v-if="isGuaranteed && !isAutoStrategy && !isLimitControlMode"
            >
                <v-text-field
                    v-if="dayOtsFocus"
                    v-model="translation.dayPlanOTS"
                    :disabled="notMayEdit"
                    hint="Допустимые траты ots в рамках одного дня"
                    label="Дневной лимит по OTS"
                    type="number"
                    min="0"
                    not-visible-null
                    @input="calculateLimit('dayBudget')"
                    @blur="blurPlanOts"
                    outlined
                    dense
                />
                <v-text-field
                    v-else
                    :value="Number(translation.dayPlanOTS).toLocaleString('ru')"
                    :disabled="notMayEdit"
                    hint="Допустимые траты ots в рамках одного дня"
                    label="Дневной лимит по OTS"
                    @focus="dayOtsFocus = true"
                    outlined
                    dense
                />
            </template>

            <template
                align-center
                v-if="translation.auctionMode === 'PPV' && !isLimitControlMode"
            >
                <v-text-field
                    v-if="showAtDay"
                    v-model="translation.costPPVday"
                    :hint="'Минимальная ставка ' + ppvDay.min + ' руб. '"
                    :step="translation.doorType == 'outdoor' ? 0.1 : 0.01"
                    :rules="[rules.required]"
                    :disabled="disabledFloor"
                    oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                    label="Дневная ставка за показ"
                    ref="costPPVday"
                    type="number"
                    class="mt-3"
                    suffix="₽"
                    max="1000"
                    min="0.1"
                    persistent-hint
                    outlined
                    dense
                />

                <v-text-field
                    v-if="showAtNight"
                    v-model="translation.costPPVnight"
                    :hint="'Минимальная ставка ' + ppvNight.min + ' руб.'"
                    persistent-hint
                    :step="translation.doorType == 'outdoor' ? 0.1 : 0.01"
                    :rules="[rules.required]"
                    :disabled="disabledFloor"
                    oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                    label="Ночная ставка за показ"
                    ref="costPPVnight"
                    type="number"
                    class="mt-3"
                    suffix="₽"
                    max="1000"
                    min="0.1"
                    outlined
                    dense
                />
            </template>

            <template
                align-center
                v-else-if="
                    translation.auctionMode === 'CPT' || isLimitControlMode
                "
            >
                <v-text-field
                    v-if="isGuaranteed && isLimitControlMode"
                    v-model="translation.displayCost"
                    :disabled="floorLoading || notMayEdit"
                    :rules="[rules.required]"
                    oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                    label="Ставка за показ"
                    type="number"
                    max="100000"
                    suffix="₽"
                    ref="cost"
                    min="1"
                    persistent-hint
                    @input="calcSumOhvat"
                    outlined
                    dense
                />
                <v-text-field
                    v-else-if="isGuaranteed"
                    v-model="translation.cost"
                    :disabled="disabledFloor || notMayEdit"
                    :rules="[rules.required]"
                    oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                    label="Стоимость за 1000 контактов (OTS)"
                    suffix="₽"
                    type="number"
                    max="100000"
                    ref="cost"
                    min="1"
                    persistent-hint
                    outlined
                    dense
                />
                <v-text-field
                    v-else
                    v-model="translation.cost"
                    :hint="
                        'Минимальная ставка ' +
                        otsMin +
                        ' руб. Рекомендованная - ' +
                        otsRecommend +
                        ' руб.'
                    "
                    :disabled="disabledFloor || notMayEdit"
                    :rules="[rules.required, rules.min]"
                    oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                    label="Стоимость за 1000 контактов (OTS)"
                    suffix="₽"
                    type="number"
                    max="2999"
                    ref="cost"
                    min="1"
                    persistent-hint
                    outlined
                    dense
                />

                <template v-if="!isLimitControlMode">
                    <v-text-field
                        v-if="planOTSFocus"
                        v-model="translation.planOTS"
                        :disabled="notMayEdit"
                        oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                        label="Суммарный OTS"
                        max="2000000000"
                        ref="planOTS"
                        min="1"
                        type="number"
                        @input="calcBudget"
                        @blur="planOTSFocus = false"
                        outlined
                        dense
                    />
                    <v-text-field
                        v-else
                        :value="
                            Number(translation.planOTS).toLocaleString('ru')
                        "
                        :disabled="notMayEdit"
                        label="Суммарный OTS"
                        @focus="planOTSFocus = true"
                        outlined
                        dense
                    />
                </template>

                <template v-else>
                    <v-text-field
                        v-if="planShowsFocus"
                        v-model="translation.planShows"
                        :disabled="notMayEdit"
                        oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max)"
                        label="Количество показов"
                        ref="planShows"
                        max="2000000000"
                        type="number"
                        min="1"
                        @blur="planShowsFocus = false"
                        @input="calcBudgetForDisplay"
                        outlined
                        dense
                    />
                    <v-text-field
                        v-else
                        :value="
                            Number(translation.planShows).toLocaleString('ru')
                        "
                        :disabled="notMayEdit"
                        label="Количество показов"
                        @focus="planShowsFocus = true"
                        outlined
                        dense
                    />
                </template>
            </template>

            <template v-if="isGuaranteed || isGalmed">
                <v-select
                    v-model="translation.minIntervalSecs"
                    :items="galleryIntervals"
                    :rules="[rules.required]"
                    :disabled="notMayEdit"
                    label="Интервал между показами"
                    outlined
                    dense
                />

                <!-- <v-subheader class="pl-0">Коэффициент интервала</v-subheader>
        <v-slider
          v-model="translation.intervalK"
          thumb-label="always"
          class="mt-6 mb-2"
          step="0.01"
          :min="0"
          hide-details
        >
          <template v-slot:prepend>
            <v-text-field
              v-model="translation.intervalK"
              style="width: 60px"
              class="mt-n3 pt-0"
              type="number"
              step="0.01"
              max="100"
              min="0"
              hide-details
              single-line
            ></v-text-field>
          </template>
        </v-slider> -->
            </template>

            <v-text-field
                v-if="!isGuaranteed && !isGalmed"
                v-model="translation.minIntervalSecs"
                :rules="[rules.required]"
                label="Интервал между показами"
                type="number"
                suffix="мин."
                max="60"
                min="0"
                outlined
                dense
            />
        </v-flex>
    </v-layout>
</template>

<script>
import Step3Bus from "../Step3Bus";
import moment from "moment";
import { mapGetters } from "vuex";

const galleryIntervals = [
    { value: 0, text: "Полная занятость" },
    { value: 50, text: "72 показов в час" },
    { value: 55, text: "66 показа в час" },
    { value: 60, text: "60 показов в час" },
    { value: 67, text: "54 показа в час" },
    { value: 75, text: "48 показов в час" },
    { value: 86, text: "42 показа в час" },
    { value: 100, text: "36 показов в час" },
    { value: 120, text: "30 показов в час" },
    { value: 150, text: "24 показа в час" },
    { value: 200, text: "18 показов в час" },
    { value: 400, text: "9 показов в час" },
    { value: 600, text: "6 показов в час" },
];

const strategyAutoModes = [
    { value: 1, text: "Пассивная - порог срабатывания 90% - 100%" },
    { value: 0, text: "Стандартная - порог срабатывания 95% - 105%" },
    { value: 2, text: "Активная - порог срабатывания 100% - 101%" },
];

export default {
    name: "PaymentForm",

    props: {
        translationIs: Function,
        floorLoading: Boolean,
        isGuaranteed: Boolean,
        notMayEdit: Boolean,
        translation: Object,
        rules: Object,
        otsMin: {
            type: Number,
            default: 0,
        },
        otsRecommend: {
            type: Number,
            default: 0,
        },
        ppvNight: {
            type: Object,
            default: () => {},
        },
        ppvDay: {
            type: Object,
            default: () => {},
        },
    },

    created() {
        moment.locale("ru");
        moment.weekdays(true);

        if (!this.isNew) {
            this.calcSumOhvat();
        }
        Step3Bus.$on("change-translation-week", () => {
            this.calcDayPlanOTS();
        });
        if (this.isAutoStrategy) {
            this.calcDayPlanOTS();
        }
    },

    data: () => ({
        planShowsFocus: false,
        validDayBudget: false,
        dayBudgetFocus: false,
        planOTSFocus: false,
        dayOtsFocus: false,
        budgetFocus: false,

        strategyAutoModes,
        galleryIntervals,
    }),

    computed: {
        isAutoStrategy: {
            get() {
                return !!Number(this.translation.strategyAuto);
            },
            set(newVal) {
                this.$store.dispatch("translation/changeTranslation", {
                    strategyAuto: newVal ? 1 : 0,
                });
            },
        },

        disabledFloor() {
            return (
                this.floorLoading || this.translationIs(["review", "running"])
            );
        },
        isLimitControlMode() {
            return !!Number(this.translation.limitControlMode);
        },

        currentWeek() {
            const { inDetailPeriod, notDetailWeek, detailWeek } =
                this.translation;

            if (inDetailPeriod) {
                return detailWeek.slice();
            }
            detailWeek.forEach((day) => {
                day.hours = notDetailWeek.find(
                    (d) => d.value === day.type
                ).hours;
            });
            return detailWeek;
        },

        mayEditStrategy() {
            return ["planned", "stop", "stopped"].includes(
                this.translation.status
            );
        },

        reducedHours() {
            const { inDetailPeriod, notDetailWeek, detailWeek } =
                this.translation;

            const currentWeek = inDetailPeriod ? detailWeek : notDetailWeek;
            const allActiveHours = currentWeek.reduce(
                (hourArray, day) => [...hourArray, ...day.hours],
                []
            );
            return [...new Set(allActiveHours)];
        },
        showAtDay() {
            const showAtDay = this.reducedHours.some((hour) => hour > 5);
            if (!showAtDay) {
                this.translation.costPPVday = 0;
            } else if (!this.translation.costPPVday) {
                this.translation.costPPVday = this.ppvDay.min;
            }
            return showAtDay;
        },
        showAtNight() {
            const showAtNight = this.reducedHours.some((hour) => hour < 6);
            if (!showAtNight) {
                this.translation.costPPVnight = 0;
            } else if (!this.translation.costPPVnight) {
                this.translation.costPPVnight = this.ppvNight.min;
            }
            return showAtNight;
        },

        translationDuration() {
            const startDate = moment(this.translation.startDate);
            const endDate = moment(this.translation.endDate);
            const counfOfDays = new Array(7).fill(0);
            const period = this.enumerateDaysBetweenDates(startDate, endDate);

            period.forEach((date) => {
                const dayOfWeek = moment(date).weekday();
                console.log(
                    "date = " + date + "; " + "dayOfWeek = " + dayOfWeek
                );
                ++counfOfDays[dayOfWeek];
            });

            this.currentWeek.forEach((dayOfWeek, index) => {
                if (!dayOfWeek.hours.length) {
                    counfOfDays[index] = 0;
                }
            });
            console.log(
                "Translation Duration: " +
                    counfOfDays.reduce((prev, current) => prev + current, 0)
            );
            return counfOfDays.reduce((prev, current) => prev + current, 0);
        },
        ...mapGetters({
            isGalmed: "auth/getIsGalmed",
        }),
    },

    methods: {
        changeStrategy(value) {
            if (!this.mayEditStrategy) return;
            this.isAutoStrategy = value;
        },

        calcSumOhvat() {
            if (this.translation.addedSurfaces.length) {
                this.$emit("change-plan-ots");
            }

            if (this.isLimitControlMode) {
                const duration = this.translationDuration;
                const planShows = Math.round(
                    this.getNormalNumber(this.translation.budget) /
                        this.getNormalNumber(this.translation.displayCost)
                );

                console.log(
                    `dayPlanShows: ${planShows}/${duration} = `,
                    planShows / duration
                );

                return this.$store.dispatch("translation/changeTranslation", {
                    dayPlanShows: Number(
                        parseFloat(planShows / duration).toFixed(0)
                    ),
                    planShows,
                });
            }

            this.$store.dispatch("translation/changeTranslation", {
                planOTS: Math.round(
                    (this.getNormalNumber(this.translation.budget) /
                        this.getNormalNumber(this.translation.cost)) *
                        1000
                ),
            });
        },

        blurPlanOts() {
            this.dayOtsFocus = false;
            this.translation.dayPlanOTS = Number(
                parseFloat(this.translation.dayPlanOTS).toFixed()
            );
        },

        changeStrategy(value) {
            if (!this.mayEditStrategy) return;
            this.isAutoStrategy = value;
        },

        calcBudget() {
            console.log("пересчитываем");
            if (this.translation.addedSurfaces.length) {
                this.$emit("change-plan-ots");
            }

            if (!this.translation.cost) {
                this.$store.dispatch("translation/changeTranslation", {
                    cost: this.settings.min_OTS,
                });
            }

            this.$store.dispatch("translation/changeTranslation", {
                budget: Math.round(
                    (this.getNormalNumber(this.translation.planOTS) *
                        this.getNormalNumber(this.translation.cost)) /
                        1000
                ),
            });
        },
        calcBudgetForDisplay() {
            if (!this.isLimitControlMode) return;
            return this.$store.dispatch("translation/changeTranslation", {
                budget: Math.round(
                    this.getNormalNumber(this.translation.planShows) *
                        this.getNormalNumber(this.translation.displayCost)
                ),
            });
        },

        getNormalNumber(number) {
            return Number(number.toString().split(" ").join(""));
        },

        enumerateDaysBetweenDates(startDate, endDate) {
            const now = startDate.clone(),
                dates = [];

            while (now.isSameOrBefore(endDate)) {
                dates.push(now.format("M/D/YYYY"));
                now.add(1, "days");
            }
            return dates;
        },
        calcDayPlanOTS() {
            if (!this.isAutoStrategy) return;

            const duration = this.translationDuration;
            const planOTS = this.translation.planOTS;
            console.log(
                `dayPlanOTS: ${planOTS}/${duration} = `,
                planOTS / duration
            );

            return this.$store.dispatch("translation/changeTranslation", {
                dayPlanOTS: Number(parseFloat(planOTS / duration).toFixed(0)),
            });
        },

        calculateLimit(field) {
            const isDayPlanOTS = field === "dayPlanOTS";
            const { dayPlanOTS = 0, dayBudget = 0, cost } = this.translation;
            if (!cost) return;

            if (isDayPlanOTS) {
                return this.$store.dispatch("translation/changeTranslation", {
                    dayPlanOTS: Number(((dayBudget / cost) * 1000).toFixed(0)),
                });
            } else {
                this.$store.dispatch("translation/changeTranslation", {
                    dayBudget: Number(((dayPlanOTS / 1000) * cost).toFixed(2)),
                });
            }
        },
    },

    watch: {
        isAutoStrategy() {
            this.calcDayPlanOTS();
        },
        "translation.planOTS"() {
            this.calcDayPlanOTS();
        },
        "translation.endDate"() {
            this.calcSumOhvat();
            this.calcDayPlanOTS();
        },
        "translation.startDate"() {
            this.calcSumOhvat();
            this.calcDayPlanOTS();
        },
        "translation.cost"() {
            this.calcSumOhvat();
            this.calculateLimit("dayPlanOTS");
        },
    },
};
</script>
