<template>
    <div>
        <v-layout class="py-3 cursor--pointer" align-center>
            <v-checkbox
                v-model="customPeriodComp"
                label="Настроить дни и время показа"
            >
            </v-checkbox>
        </v-layout>

        <v-slide-y-transition>
            <div class="d-flex flex-column" dense v-if="customPeriod">
                <v-btn-toggle
                    v-model="selectType"
                    class="pb-4"
                    borderless
                    color="primary"
                >
                    <v-btn text> Сбросить </v-btn>
                    <v-btn text> Круглосуточно </v-btn>
                    <v-btn text> Будни </v-btn>
                    <v-btn text> Выходные </v-btn>
                    <v-btn text> День </v-btn>
                    <v-btn text> Ночь </v-btn>
                    <v-btn text> Рабочее время </v-btn>
                    <v-btn text> Прайм-тайм </v-btn>
                </v-btn-toggle>

                <div
                    v-for="([id, name], dayIndex) in Object.entries(daysOfWeek)"
                    :key="id"
                    class="d-flex"
                >
                    <div
                        style="width: 24px"
                        @click="addDay(dayIndex)"
                        class="cursor-pointer day-label"
                        :class="{ active: isDaySelected(dayIndex) }"
                    >
                        {{ name }}
                    </div>
                    <div
                        class="day-item"
                        v-for="(hour, index) in hoursOfDay"
                        :key="hour"
                        @click="select(dayIndex, index)"
                        :class="{
                            active: translation.detailWeek[
                                dayIndex
                            ].hours.includes(index),
                        }"
                    ></div>
                    <!-- <div class="day-item"
                        v-for="(hour, index) in hoursOfDay"
                        :key="index"
                        :class="{active: translation.detailWeek[dayIndex][]}"
                    ></div> -->
                </div>
                <div class="pl-6 d-flex">
                    <div
                        class="hour-title cursor-pointer"
                        v-for="(hour, index) in hoursOfDay"
                        :key="hour"
                        @click="addHour(index)"
                        :class="{ active: isHourSelected(index) }"
                    >
                        {{ hour }}
                    </div>
                </div>
                <span class="my-2"
                    >{{
                        declOfNum(totalHours, ["Выбран", "Выбрано", "Выбрано"])
                    }}
                    <strong>{{ totalHours }}</strong>
                    {{ declOfNum(totalHours, ["час", "часа", "часов"]) }}
                </span>
            </div>
        </v-slide-y-transition>
    </div>
</template>

<script>
import _ from "lodash";

const worktime = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const peakHours = [8, 9, 10, 17, 18, 19];
const nightHours = [0, 1, 2, 3, 4, 5];
const dayHours = [
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
];

export default {
    props: {
        value: Object,
        translation: Object,
        customPeriod: Boolean,
    },
    data() {
        return {
            selectType: undefined,
            selectMap: [],
            daysOfWeek: {
                md: "Пн",
                tu: "Вт",
                we: "Ср",
                th: "Чт",
                fr: "Пт",
                sa: "Сб",
                su: "Вс",
            },
            hoursOfDay: [
                "00-01",
                "01-02",
                "02-03",
                "03-04",
                "04-05",
                "05-06",
                "06-07",
                "07-08",
                "08-09",
                "09-10",
                "10-11",
                "11-12",
                "12-13",
                "13-14",
                "14-15",
                "15-16",
                "16-17",
                "17-18",
                "18-19",
                "19-20",
                "20-21",
                "21-22",
                "22-23",
                "23-00",
            ],
            show: false,
        };
    },
    mounted() {
        this.selectMap = [
            this.clearAll,
            this.setAll,
            this.setWeekdays,
            this.setWeekend,
            this.setDaytime,
            this.setNighttime,
            this.setWorktime,
            this.setPeakHours,
        ];
    },
    methods: {
        declOfNum(n, titles) {
            return titles[
                n % 10 === 1 && n % 100 !== 11
                    ? 0
                    : n % 10 >= 2 &&
                      n % 10 <= 4 &&
                      (n % 100 < 10 || n % 100 >= 20)
                    ? 1
                    : 2
            ];
        },
        setAll() {
            this.clearAll();
            const week = this.translation.detailWeek;

            week[0].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[1].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[2].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[3].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[4].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[5].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[6].hours = [...Array.from({ length: 24 }, (v, k) => k)];
        },
        clearAll() {
            const week = this.translation.detailWeek;

            week.forEach((day) => {
                day.hours = [];
            });
        },
        setPeakHours() {
            this.clearAll();
            const week = this.translation.detailWeek;

            week[0].hours = [...peakHours];
            week[1].hours = [...peakHours];
            week[2].hours = [...peakHours];
            week[3].hours = [...peakHours];
            week[4].hours = [...peakHours];
        },
        setDaytime() {
            this.clearAll();
            const week = this.translation.detailWeek;

            week[0].hours = [...dayHours];
            week[1].hours = [...dayHours];
            week[2].hours = [...dayHours];
            week[3].hours = [...dayHours];
            week[4].hours = [...dayHours];
            week[5].hours = [...dayHours];
            week[6].hours = [...dayHours];
        },
        setNighttime() {
            this.clearAll();
            const week = this.translation.detailWeek;

            week[0].hours = [...nightHours];
            week[1].hours = [...nightHours];
            week[2].hours = [...nightHours];
            week[3].hours = [...nightHours];
            week[4].hours = [...nightHours];
            week[5].hours = [...nightHours];
            week[6].hours = [...nightHours];
        },
        setWeekdays() {
            this.clearAll();

            const week = this.translation.detailWeek;

            week[0].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[1].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[2].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[3].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[4].hours = [...Array.from({ length: 24 }, (v, k) => k)];
        },
        setWeekend() {
            this.clearAll();

            const week = this.translation.detailWeek;

            week[5].hours = [...Array.from({ length: 24 }, (v, k) => k)];
            week[6].hours = [...Array.from({ length: 24 }, (v, k) => k)];
        },
        setWorktime() {
            this.clearAll();

            const week = this.translation.detailWeek;

            week[0].hours = [...worktime];
            week[1].hours = [...worktime];
            week[2].hours = [...worktime];
            week[3].hours = [...worktime];
            week[4].hours = [...worktime];
        },
        addDay(day) {
            const dayOfWeek = this.translation.detailWeek[day];

            if (dayOfWeek.hours.length <= 23) {
                dayOfWeek.hours = [...Array.from({ length: 24 }, (v, k) => k)];
                return;
            }
            dayOfWeek.hours = [];
        },
        addHour(hour) {
            const week = _.cloneDeep(this.translation.detailWeek);

            // check hour
            const selected = false;
            let countSelected = 0;
            Object.entries(week).forEach(([dat, { hours }]) => {
                const idx = hours.findIndex((x) => x === hour);

                if (idx > -1) {
                    countSelected++;
                }
            });

            Object.entries(week).forEach(([day, { hours }]) => {
                const idx = hours.findIndex((x) => x === hour);

                if (countSelected < 7) {
                    if (idx === -1) {
                        hours.push(hour);
                        return;
                    }
                    return;
                }

                if (idx !== -1) hours.splice(idx, 1);
            });

            this.translation.detailWeek = week;
        },
        select(day, hour) {
            const hours = this.translation.detailWeek[day].hours;
            const index = hours.findIndex((x) => x === hour);

            if (index > -1) {
                hours.splice(index, 1);
            } else {
                hours.push(hour);
            }
        },
        isDaySelected(day) {
            return this.translation.detailWeek[day].hours.length > 23;
        },
        isHourSelected(hour) {
            const week = this.translation.detailWeek;
            let countSelected = 0;
            Object.entries(week).forEach(([dat, { hours }]) => {
                const idx = hours.findIndex((x) => x === hour);

                if (idx > -1) {
                    countSelected++;
                }
            });

            return countSelected === 7;
        },
    },
    computed: {
        customPeriodComp: {
            get() {
                return this.customPeriod;
            },
            set(val) {
                this.$emit("update:custom-period", val);
            },
        },
        totalHours() {
            let total = 0;
            this.translation.detailWeek.forEach((d) => {
                total += d.hours.length;
            });

            return total;
        },
    },
    watch: {
        selectType() {
            if (this.selectType !== undefined) {
                this.selectMap[this.selectType]();
            } else {
                this.clearAll();
            }
        },
        customPeriod(val) {
            console.log(val);
        },
    },
};
</script>

<style scoped>
.day-item {
    display: block;
    width: 20px;
    height: 20px;
    background-color: #4c1dbb;
    opacity: 0.2;
    margin: 6px 6px;
    cursor: pointer;
    transition: 0.2s background-color ease;
    border-radius: 1.75px;
}

.day-item:hover {
    opacity: 0.3;
}

.day-item.active {
    opacity: 1;
}

.hour-title {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    width: 20px;
    margin: 0 6px;
}

.hour-title.active {
    color: #4c1dbb;
    font-weight: 700;
}

.cursor-pointer {
    cursor: pointer;
}

.day-label.active {
    color: #4c1dbb;
    font-weight: 700;
}
</style>
