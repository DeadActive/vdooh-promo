<template>
    <div>
        <alert-dialog
            text="Данное действие приведет к удалению выбранных ранее поверхностей"
            title="Вы уверены?"
            ref="alertDialog"
            type="error"
            @approve="alertApprove"
            @decline="alertDecline"
        />

        <alert-dialog
            :without-decline="withoutDecline"
            :text="alertDialogText"
            ref="timerAlertDialog"
            title="Вы уверены?"
            type="error"
            @approve="timerAlertApprove"
            @decline="timerAlertDecline"
        />

        <v-stepper v-model="stepper" class="mb-4" alt-labels>
            <v-stepper-header>
                <template v-for="(step, index) in steppers">
                    <v-hover :key="index">
                        <v-stepper-step
                            slot-scope="{ hover }"
                            :editable="
                                stepIndex === index ||
                                (hover && stepMayBeEditable(index))
                            "
                            :complete="isStepComplete(index)"
                            :key="`${index}-step`"
                            :step="index + 1"
                        >
                            <div class="text-center">
                                {{ step.title }}
                            </div>
                        </v-stepper-step>
                    </v-hover>

                    <v-divider
                        v-if="step.step !== 2"
                        :key="`${index}-stepper`"
                    />
                </template>
            </v-stepper-header>

            <v-stepper-items class="mt-4 pb-3">
                <v-stepper-content
                    v-for="(step, index) in steppers"
                    :key="`${index}-content`"
                    :step="index + 1"
                    class="elevation-0 pa-0"
                    color="#fafafa"
                >
                    <v-form
                        v-model="steppers[index].valid"
                        :class="{ 'px-4': index !== 1 }"
                        ref="form"
                        lazy-validation
                        @submit.prevent="nextStep(index + 1)"
                    >
                        <v-layout column>
                            <component
                                :is="`modify-step-${step.step}`"
                                :class="{ 'px-4': index !== 1 }"
                                v-bind="stepProps"
                                @update:is-maximize-reach="
                                    isMaximizeReach = $event
                                "
                                @update:maximize-reach="maximizeReach = $event"
                                @time-outed-surfaces="timeOutedSurfaces"
                                @clear-surfaces="clearSurfaces"
                                @load-settings="loadSettings"
                                @load-forecast="loadForecast"
                                @change-video="changeVideo"
                                @loadSurfaces="loadSurfaces($event)"
                            />

                            <v-layout class="px-4 mx-2">
                                <v-btn
                                    v-if="stepper !== 1"
                                    :disabled="canPrevStep"
                                    color="primary"
                                    @click="prevStep(index + 1)"
                                    outlined
                                    height="48"
                                    class="px-9 mr-4"
                                    ><v-icon>mdi-chevron-left </v-icon
                                    >Назад</v-btn
                                >

                                <translation-actions
                                    :translation-is="translationIs"
                                    :is-guaranteed="isGuaranteed"
                                    :change-video="$data._changeVideo"
                                    :translation="translation"
                                    :is-new="isNew"
                                />

                                <v-spacer />
                                <v-btn
                                    v-if="stepper === 2"
                                    :disabled="
                                        canNextStep &&
                                        !translation.addedSurfaces.length
                                    "
                                    color="primary"
                                    type="submit"
                                    width="160"
                                    height="48"
                                    class="text-nouppercase"
                                    >Вперед<v-icon
                                        >mdi-chevron-right
                                    </v-icon></v-btn
                                >
                                <v-btn
                                    v-else-if="step.step !== 4"
                                    :disabled="!canNextStep"
                                    color="primary"
                                    type="submit"
                                    width="160"
                                    height="48"
                                    class="text-nouppercase"
                                    >Вперед<v-icon
                                        >mdi-chevron-right
                                    </v-icon></v-btn
                                >
                            </v-layout>
                        </v-layout>
                    </v-form>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </div>
</template>

<script>
import axios from "axios";
import AlertDialog from "../../../components/AlertDialog.vue";
import ModifyStep23 from "./Step23";
import ModifyStep1 from "./Step1";
import ModifyStep2 from "./Step4";
import moment from "moment";
import TranslationActions from "../TranslationActions";

export default {
    name: "TranslationStepper",

    components: {
        AlertDialog,
        ModifyStep23,
        ModifyStep1,
        ModifyStep2,
        TranslationActions,
    },

    props: {
        translationIs: Function,
        isGuaranteed: Boolean,
        translation: Object,
        steppers: Array,
        isNew: Boolean,
    },

    created() {
        if (!this.isNew && this.stepper === 3) {
            this.loadSettings();
        }
    },

    data: () => ({
        loadSurfacesTimer: null,

        isMaximizeReach: false,
        maximizeReach: 2,

        forecastLoading: false,
        surfacesLoaded: false,
        needReload: false,

        alertDialogWithAction: true,
        alertDialogText: "",

        currentSurfacePayload: {},
        lastSurfacePayload: {},
        notAvailableSurfaces: [],

        withoutDecline: false,
        floorLoading: false,
        settings: {
            otsRecommend: 0,
            ppvNight: {
                min: 0,
                max: 0,
            },
            ppvDay: {
                min: 0,
                max: 0,
            },
            otsMin: 0,
        },
        _changeVideo: false,
    }),

    computed: {
        stepper: {
            get() {
                return this.translation.stepper;
            },
            set(stepper) {
                if (this.isGuaranteed) {
                    clearTimeout(this.loadSurfacesTimer);
                    // clearTimeout(this.loadForecastTimer);
                }
                if (!this.isNew && stepper === 3) {
                    this.loadSettings();
                }
                this.steppers[stepper - 1].wasVisited = true;
                this.$store.dispatch("translation/changeTranslation", {
                    stepper,
                });
            },
        },

        surfaces() {
            return this.$store.getters["surfaces/getSurfaces"];
        },

        addedSingleSurfaces() {
            return this.returnSingleSurfaces(this.translation.addedSurfaces);
        },

        stepIndex() {
            return this.stepper - 1;
        },

        canPrevStep() {
            return this.stepper === 1;
        },
        canNextStep() {
            return this.stepper !== 4 && this.steppers[this.stepper - 1].valid;
        },

        rules() {
            return {
                required: (v) => !!v || "Обязательно к заполнению.",
                maxDayBudget: (v) =>
                    Number(this.translation.dayBudget) <=
                        Number(this.translation.budget) ||
                    "Дневной лимит не может превышать ваш бюджет",
                min: (v) =>
                    Number(v.toString().split(" ").join("")) >=
                        Number(this.settings.otsMin) ||
                    `Установите стоимость выше ${this.settings.otsMin} руб.`,
                minPPVDay: (v) =>
                    Number(v.toString().split(" ").join("")) >=
                        Number(this.settings.ppvDay.min) ||
                    `Установите стоимость выше ${this.settings.ppvDay.min} руб.`,
                minPPVNight: (v) =>
                    Number(v.toString().split(" ").join("")) >=
                        Number(this.settings.ppvNight.min) ||
                    `Установите стоимость выше ${this.settings.ppvNight.min} руб.`,
            };
        },

        stepProps() {
            return {
                returnSingleSurfaces: this.returnSingleSurfaces,
                notAvailableSurfaces: this.notAvailableSurfaces,
                addedSurfaces: this.translation.addedSurfaces,
                forecastLoading: this.forecastLoading,
                isMaximizeReach: this.isMaximizeReach,
                reloadForecast: this.reloadForecast,
                surfacesLoaded: this.surfacesLoaded,
                maximizeReach: this.maximizeReach,
                translationIs: this.translationIs,
                checkSurfaces: this.checkSurfaces,
                isGuaranteed: this.isGuaranteed,
                floorLoading: this.floorLoading,
                translation: this.translation,
                needReload: this.needReload,
                settings: this.settings,
                isNew: this.isNew,
                rules: this.rules,
            };
        },

        isAllbb() {
            return this.$route.query && this.$route.query.allbb;
        },

        isStopped() {
            return (
                this.translation.status === "stop" ||
                this.translation.status === "stopped"
            );
        },
    },

    methods: {
        test(text) {
            console.log(text);
        },
        returnSurfaceKey(key) {
            switch (key) {
                case "city":
                    return "city_id";
                case "doorType":
                    return "door";

                case "selectedNetworks":
                    return "NETWORKID";

                case "orientationVertical":
                    return "is_vertical";
                case "doorSurface":
                    return "surface_type";

                default:
                    return key;
            }
        },
        returnSingleSurfaces(surfaces) {
            const allSurfaces = [];
            let sourceSurfaces = [];

            if (Array.isArray(surfaces)) {
                sourceSurfaces = surfaces.slice();
            } else {
                sourceSurfaces.push(surfaces);
            }

            sourceSurfaces.forEach((surface) => {
                if (surface.players) {
                    return allSurfaces.push(
                        ...surface.players.map((player) => {
                            const result = Object.assign({}, surface, player);
                            delete result.players;
                            return result;
                        })
                    );
                }
                return allSurfaces.push(surface);
            });
            return allSurfaces;
        },

        /**
         * Вызывается при смене данных, привязанных к поверхностям
         * Вызывает диалоговое окно с подтверждением удаления поверхностей, которые были удалены с карты
         * @param {String} key Ключ изменяемого свойства
         * @param {String | Array} newValue Новое значение свойства
         */
        checkSurfaces(key, newValue) {
            clearTimeout(this.loadSurfacesTimer);

            if (!this.steppers[1].wasVisited) {
                if (this.isGuaranteed && this.stepper === 2) {
                    this.timeOutedSurfaces();
                }
                return this.$store.dispatch("translation/changeTranslation", {
                    [key]: newValue,
                });
            }

            const oldValue = this.translation[key];
            let withAlert = true;
            if (newValue === oldValue) withAlert = false;
            let deleted = oldValue;

            if (Array.isArray(newValue)) {
                if (
                    newValue.length >= oldValue.length &&
                    newValue.every((v) => oldValue.includes(v))
                )
                    withAlert = false;
                deleted = oldValue.find(
                    (ov) => !newValue.find((nv) => nv === ov)
                );
            }
            if (!deleted) withAlert = false;
            if (
                this.addedSingleSurfaces.every(
                    (s) => s[this.returnSurfaceKey(key)] !== deleted
                )
            )
                withAlert = false;

            if (key === "auctionMode") {
                const oldSurfacesCount = this.addedSingleSurfaces.filter((s) =>
                    Number(s[oldValue.toUpperCase() + "_supported"])
                ).length;
                const newSurfacesCount = this.addedSingleSurfaces.filter((s) =>
                    Number(s[newValue.toUpperCase() + "_supported"])
                ).length;
                if (oldSurfacesCount > newSurfacesCount) withAlert = true;
            }

            if (withAlert) {
                this.$refs.alertDialog.alert({
                    filterBy: this.returnSurfaceKey(key),
                    filterValue: deleted,
                    value: newValue,
                    oldValue,
                    key,
                });
            } else {
                this.alertApprove({ key, value: newValue });
            }
            return true;
        },

        alertApprove({ key, value, filterValue, filterBy }) {
            this.$store.dispatch("translation/changeTranslation", {
                [key]: value,
            });
            if (key === "auctionMode") {
                const supported = `${value.toString().toUpperCase()}_supported`;
                this.translation.addedSurfaces =
                    this.translation.addedSurfaces.filter(
                        (s) => s[supported] === "1"
                    );
            }
            if (filterValue) {
                this.translation.addedSurfaces =
                    this.translation.addedSurfaces.filter(
                        (s) => s[filterBy] !== filterValue
                    );
            }
            this.timeOutedSurfaces();
        },
        alertDecline({ key, oldValue }) {
            if (key !== "doorType" && key !== "auctionMode") return;
            this.$store.dispatch("translation/changeTranslation", {
                [key]: "",
            });
            this.$nextTick(() => {
                this.$store.dispatch("translation/changeTranslation", {
                    [key]: oldValue,
                });
            });
        },

        timerAlertApprove({ addedSurfaces, deleted }) {
            this.$store.dispatch("translation/changeTranslation", {
                addedSurfaces: this.returnNotRegisteredElements(
                    addedSurfaces,
                    deleted,
                    "NETWORKID",
                    "SURFACEID"
                ),
            });
            this.withoutDecline = false;
        },
        timerAlertDecline() {
            const { vg_hours_active } = this.lastSurfacePayload;

            Object.values(this.translation.detailWeek).forEach((value) => {
                value.hours = vg_hours_active[value.value];
            });

            if (!this.translation.inDetailPeriod) {
                const workdays = this.translation.detailWeek.filter(
                    (d) => d.type === "workdays"
                );
                const weekdays = this.translation.detailWeek.filter(
                    (d) => d.type === "weekdays"
                );

                this.translation.notDetailWeek[0].hours = workdays[0].hours;
                this.translation.notDetailWeek[1].hours = weekdays[0].hours;
            }
        },

        returnHoursActive() {
            let hoursActive = {};
            Object.values(this.translation.detailWeek).forEach((day) => {
                hoursActive[day.value] = [];
            });

            if (this.translation.inDetailPeriod) {
                Object.values(this.translation.detailWeek).forEach((value) => {
                    hoursActive[value.value] = value.hours;
                });
            } else {
                Object.values(this.translation.detailWeek).forEach((value) => {
                    const { hours } = this.translation.notDetailWeek.find(
                        (d) => d.value === value.type
                    );
                    hoursActive[value.value] = hours;
                });
            }
            return hoursActive;
        },

        timeOutedSurfaces() {
            clearTimeout(this.loadSurfacesTimer);
            const timerTime = this.isGuaranteed ? 3500 : 1000;
            this.loadSurfacesTimer = setTimeout(this.loadSurfaces, timerTime);
        },

        /**
         * Вернуть незарегистрированные элементы массивами
         * @param {Array} sourceArray массив в котором идет поиск
         * @param {Array} dictionaryArray массив, содержащий разрешенные элементы
         * @param {Rest from String} keys ключи по которым проверяются элементы
         */
        returnNotRegisteredElements(sourceArray, dictionaryArray, ...keys) {
            return sourceArray.filter((sourceElement) => {
                return !dictionaryArray.find((dictionaryElement) =>
                    keys.every(
                        (key) => sourceElement[key] === dictionaryElement[key]
                    )
                );
            });
        },

        clearAddedSurfaces() {
            const addedSurfaces = this.translation.addedSurfaces;
            const availableSurfaces = this.returnSingleSurfaces(
                this.surfaces
            ).filter((s) => s.available);
            if (!addedSurfaces.length) return;

            const deleted = this.returnNotRegisteredElements(
                addedSurfaces,
                availableSurfaces,
                "NETWORKID",
                "SURFACEID"
            );
            if (!deleted.length) return;

            if (!this.isStopped) {
                this.withoutDecline = true;

                this.alertDialogText = [
                    "Следующие экраны были автоматически удалены из-за недоступности в выбранный период:",
                ];
                this.alertDialogText.push(
                    ...deleted.map(
                        (surface, index) => `${index + 1}. ${surface.SURFACEID}`
                    )
                );

                this.$refs.timerAlertDialog.alert({ addedSurfaces, deleted });
            }

            this.$store.dispatch("translation/changeTranslation", {
                addedSurfaces: this.returnNotRegisteredElements(
                    addedSurfaces,
                    deleted,
                    "NETWORKID",
                    "SURFACEID"
                ),
            });
            return (this.notAvailableSurfaces = deleted);
        },

        async loadSurfaces(mediaplan) {
            clearTimeout(this.loadSurfacesTimer);
            this.surfacesLoaded = true;

            const PPV_supported = this.translation.auctionMode === "PPV";
            const CPT_supported = this.translation.auctionMode === "CPT";
            let response = {
                error: true,
                data: null,
            };

            let data = {
                CITYID: this.translation.city,
                filtered: false,
                PPV_supported,
                CPT_supported,
            };

            if (this.isGuaranteed) {
                data = {
                    vg_period_from: this.translation.startDate,
                    vg_period_to: this.translation.endDate,
                    vg_hours_active: this.returnHoursActive(),
                    vg_NETWORKID: "GALLERY",
                    filtered: false,
                    CITYID: this.translation.city,
                    vg_dont_filter: 1,
                    vg_interval: this.translation.minIntervalSecs,
                };
                if (this.isNew && this.isMaximizeReach) {
                    if (!this.maximizeReach) {
                        this.maximizeReach = 2;
                    }
                    data.vg_max_reach = this.isMaximizeReach;
                    data.vg_count = this.maximizeReach;
                }
                if (mediaplan) {
                    let surface_ids = [];
                    this.translation.addedSurfaces.forEach((surface) => {
                        surface_ids.push(surface.id);
                    });
                    data.vg_mp = 1;
                    data.vg_tr_title = this.translationIs.title;
                    data.vg_budget_RUR = this.translationIs.budget;
                    data.limit_control_mode = this.translation.limitControlMode;
                    data.surface_ids = surface_ids;
                }
                Object.assign(
                    this.lastSurfacePayload,
                    this.currentSurfacePayload
                );
                Object.assign(this.currentSurfacePayload, data);
            }

            if (this.translation.doorType === "outdoor") {
                data = {
                    NETWORKID: this.translation.selectedNetworks,
                    resources: this.translation.resources,
                    size: this.translation.format,
                    ...data,
                };
                response = await this.$store.dispatch(
                    "surfaces/loadSurfacesAndMulti",
                    data
                );
                if (mediaplan) {
                    window.open(response.vg_mp_file, "_blank");
                    // this.downloadSurfacesMediaplan(response.vg_mp_file);
                    // console.log("response:");
                    // console.log(response);
                }
            } else {
                data = {
                    is_vertical: this.translation.orientationVertical,
                    surface_type: this.translation.doorSurface,
                    ...data,
                };
                response = await this.$store.dispatch(
                    "surfaces/loadIndoorSurfaces",
                    data
                );
            }

            const { data: responseData, error } = response;

            if (error && responseData === "busy") {
                return this.timeOutedSurfaces();
            }
            this.surfacesLoaded = false;

            if (this.isNew && this.isMaximizeReach) {
                const singleSurfaces = this.returnSingleSurfaces(this.surfaces);
                return this.$store.dispatch("translation/changeTranslation", {
                    addedSurfaces: singleSurfaces.slice(),
                });
            } else {
                const availableSurfaces = this.surfaces.filter(
                    (surface) => surface.available
                );
                const surfacesCount =
                    this.returnSingleSurfaces(availableSurfaces).length;
                this.$store.dispatch(
                    "surfaces/setAllSurfacesCount",
                    surfacesCount
                );
            }

            if (!this.isNew) {
                this.loadAddedSurfaces(this.translation.addedSurfaces);
            }

            if (this.isGuaranteed && !this.isNew) {
                if (!this.isStopped) {
                    this.loadSurfacesByLink();
                } else {
                    this.clearAddedSurfaces();
                }

                if (this.translation.addedSurfaces.length) {
                    this.reloadForecast();
                }
            }
        },
        async downloadSurfacesMediaplan(url) {
            axios({
                url,
                method: "GET",
                responseType: "blob",
            }).then((response) => {
                var fileURL = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                var fileLink = document.createElement("a");

                fileLink.href = fileURL;
                fileLink.setAttribute(
                    "download",
                    url.substring(url.lastIndexOf("/") + 1)
                );
                document.body.appendChild(fileLink);

                fileLink.click();
            });
        },
        async loadSurfacesByLink() {
            await this.$store.dispatch("surfaces/getSurfacesByLink", {
                ids: this.translation.addedSurfaces.map((s) => s.id),
                filtered: false,
                merge: true,
            });
            this.surfacesLoaded = false;
            this.loadForecast();
        },

        loadAddedSurfaces(resources) {
            if (!Array.isArray(resources)) return;

            const singleSurfaces = this.returnSingleSurfaces(this.surfaces);
            const addedSurfaces = resources
                .map((resourceSurface) => {
                    const { SURFACEID, NETWORKID } = resourceSurface;
                    const surface = singleSurfaces.find(
                        (surface) =>
                            surface.SURFACEID === SURFACEID &&
                            surface.NETWORKID === NETWORKID
                    );

                    return {
                        ...resourceSurface,
                        ...surface,
                    };
                })
                .filter((s) => !!s);

            this.$store.dispatch("translation/changeTranslation", {
                addedSurfaces,
            });
            return true;
        },
        clearSurfaces() {
            this.$store.dispatch("translation/changeTranslation", {
                addedSurfaces: [],
            });
            this.isMaximizeReach = false;
        },

        async loadSettings() {
            if (this.isGuaranteed) return;
            this.floorLoading = true;
            const { error, data } = await this.$store.dispatch(
                "surfaces/getFloorPrice",
                this.translation.addedSurfaces
            );
            if (!error) {
                this.settings.otsRecommend = data.otsRecommend;
                this.settings.ppvNight = data.ppvNight;
                this.settings.otsMin = data.otsMin;
                this.settings.ppvDay = data.ppvDay;

                if (this.isNew || this.isAllbb) {
                    this.translation.cost = data.otsMin;
                    this.translation.costPPVday = data.ppvDay.min;
                    this.translation.costPPVnight = data.ppvNight.min;
                }
            }
            this.floorLoading = false;
        },

        loadForecast() {
            if (this.isGuaranteed && this.stepper === 2) {
                this.needReload = true;
            }
        },
        loadForecastTimeouted() {
            this.needReload = true;
        },

        async reloadForecast() {
            this.needReload = false;
            this.forecastLoading = true;

            if (!this.translation.addedSurfaces.length || !this.isGuaranteed)
                return;
            const endDate = moment(this.translation.endDate);
            const startDate = moment(this.translation.startDate);
            const duration = endDate.diff(startDate, "days") + 1;

            const forecastData = {
                vg_SURFACEID: this.translation.addedSurfaces.map(
                    (s) => s.SURFACEID
                ),
                vg_interval: this.translation.minIntervalSecs,
                vg_period_from: this.translation.startDate,
                vg_period_to: this.translation.endDate,
                vg_hours_active: this.returnHoursActive(),
                vg_NETWORKID: "GALLERY",
                translationId: null,

                ots: Number(this.translation.planOTS),
                duration,
            };

            if (!this.isNew) {
                forecastData.translationId = this.translation.id;
            }
            await this.$store.dispatch("surfaces/loadForecast", {
                planOTS: this.translation.planOTS,
                isBooked: this.translation.book,
                isNew: this.isNew,
                forecastData,
            });
            await this.loadUniqueMacs();

            this.forecastLoading = false;
            this.needReload = false;
        },

        async loadUniqueMacs() {
            if (this.isNew) return;
            await this.$store.dispatch(
                "surfaces/loadUniqueMacs",
                this.translation.id
            );
        },

        changeVideo() {
            this._changeVideo = true;
            return this.$emit("change-video");
        },

        stepMayBeEditable(index) {
            if (!index) return true;
            const prevStep = index - 1;

            return this.isStepComplete(prevStep);
        },
        isStepComplete(index) {
            return (
                this.steppers[index].valid &&
                this.steppers[index].wasVisited &&
                this.steppers[index].condition(this.translation)
            );
        },

        nextStep(n) {
            console.log(this.translation);
            if (n === 4) return;
            const form = this.$refs.form[n - 1];

            if (form && form.validate()) {
                return (this.stepper = n + 1);
            }
        },
        prevStep(n) {
            if (n === 1) return;
            return (this.stepper = n - 1);
        },
    },

    watch: {
        "translation.city"(city) {
            this.$store.dispatch("settings/changeSettings", { city });
        },
        "translation.addedSurfaces"(newVal, oldVal) {
            if (!oldVal.length) return;
            this.loadSettings();
            this.needReload = true;
        },

        "getTranslationCity.minIntervalSecs"(newVal) {
            this.needReload = true;
        },

        isMaximizeReach(newVal) {
            this.$store.dispatch("translation/changeTranslation", {
                addedSurfaces: [],
            });
            if (!newVal) {
                this.timeOutedSurfaces();
            }
        },
        maximizeReach(newVal) {
            this.timeOutedSurfaces();
        },
    },

    beforeDestroy() {
        clearTimeout(this.loadSurfacesTimer);
    },
};
</script>
