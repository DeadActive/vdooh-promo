<template>
    <v-layout column mb-3>
        <v-layout wrap>
            <v-flex xs12 sm4 lg3 class="mr-8">
                <date-picker
                    v-model="startDate"
                    :disabled="notMayEdit"
                    :show-current="today"
                    :max="maxStartDay"
                    :rules="rules"
                    label="Дата начала"
                />
            </v-flex>

            <v-flex xs12 sm4 lg3>
                <date-picker
                    v-model="endDate"
                    :show-current="currentEndDay"
                    :disabled="notMayEdit"
                    :rules="rules"
                    label="Дата окончания"
                />
            </v-flex>
        </v-layout>

        <!-- <hour-customizer
            :custom-period.sync="customPeriod"
            :translation="translation"
            :dayTabs.sync="dayTabs"
            @current-days-in-period="currentDaysInPeriod"
            @time-outed-surfaces="timeOutedSurfaces"
        /> -->

        <hour-schedule
            :custom-period.sync="customPeriod"
            :translation="translation"
        ></hour-schedule>

        <v-flex
            xs12
            class="grey--text caption"
            v-if="translation.addedSurfaces.length"
        >
            * изменение периода может привести к удалению ранее выбранных
            экранов, в случае их недоступности
        </v-flex>
    </v-layout>
</template>

<script>
import DatePicker from '@/components/DatePicker';
import HourCustomizer from './HourCustomizer';
import HourSchedule from './HoursSchedule.vue';
import Step3Bus from '../Step3Bus';
import moment from 'moment';

export default {
    name: 'PeriodPart',

    components: {
        HourCustomizer,
        DatePicker,
        HourSchedule,
    },

    props: {
        checkSurfaces: Function,
        isGuaranteed: Boolean,
        notMayEdit: Boolean,
        translation: Object,
        isNew: Boolean,
        rules: Object,
    },

    data: () => ({
        customPeriod: true,
        dayTabs: 0,
    }),

    mounted() {
        this.translation.inDetailPeriod = true;
    },

    computed: {
        endDate: {
            get() {
                return this.translation.endDate;
            },
            set(endDate) {
                if (this.isGuaranteed) {
                    this.checkSurfaces('endDate', endDate);
                } else {
                    this.$store.dispatch('translation/changeTranslation', {
                        endDate,
                    });
                }
                this.currentDaysInPeriod();
            },
        },
        startDate: {
            get() {
                return this.translation.startDate;
            },
            set(startDate) {
                if (startDate >= this.endDate) {
                    this.endDate = moment(startDate)
                        .subtract(-1, 'days')
                        .format('YYYY-MM-DD');
                }
                if (this.isGuaranteed) {
                    this.checkSurfaces('startDate', startDate);
                } else {
                    this.$store.dispatch('translation/changeTranslation', {
                        startDate,
                    });
                }
                this.currentDaysInPeriod();
            },
        },

        detailWeek: {
            get() {
                return this.translation.detailWeek;
            },
            set(detailWeek) {
                this.$store.dispatch('translation/changeTranslation', {
                    detailWeek,
                });
            },
        },

        oldStartDate() {
            return this.translation.oldStartDate;
        },
        oldEndDate() {
            return this.translation.oldEndDate;
        },

        maxStartDay() {
            if (!this.isNew && this.isGuaranteed && !this.isStopped) {
                return this.oldStartDate;
            }
            return '';
        },
        isStopped() {
            return ['stop', 'stopped'].includes(this.translation.status);
        },

        currentEndDay() {
            if (!this.isNew && this.isGuaranteed && !this.isStopped) {
                return this.oldEndDate;
            }
            return this.startDate;
        },

        today() {
            return moment().format('YYYY-MM-DD');
        },
    },

    methods: {
        currentDaysInPeriod() {
            if (!this.translation.inDetailPeriod) return;

            this.detailWeek = this.detailWeek.map((d) => ({
                ...d,
                disabled: false,
            }));
            if (moment(this.endDate).diff(this.startDate, 'days') >= 7) return;

            moment.locale('en');

            const startDate = moment(this.startDate)
                .format('dddd')
                .toLowerCase();
            const endDate = moment(this.endDate).format('dddd').toLowerCase();

            const index = this.translation.detailWeek.findIndex(
                (d) => d.value === startDate
            );
            if (!~index) return;
            let count = 0;
            for (let i = index; i < 7; ++i) {
                const day = this.translation.detailWeek[i];
                day.disabled = true;

                if (day.value === startDate) this.dayTabs = i;
                if (day.value === endDate) {
                    return this.translation.detailWeek.forEach((d) => {
                        d.disabled = !d.disabled;
                        if (d.disabled) d.hours = [];
                    });
                }
                if (i === 6) i = -1;
            }
            Step3Bus.$emit('change-translation-week');
        },

        timeOutedSurfaces() {
            this.$emit('time-outed-surfaces');
        },
    },

    watch: {
        'translation.inDetailPeriod'(newVal) {
            console.log(newVal);
            if (newVal) this.currentDaysInPeriod();
        },
    },
};
</script>
