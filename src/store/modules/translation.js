import TranslationService from "@services/TranslationService";
import { notDetailWeek, detailWeek } from "@dal/translation/config";
import { translationToFrontendDAL } from "@dal/translation";

const initTranslation = () => ({
    translationType: "auction",

    selectedSurfaces: [],
    addedSurfaces: [],
    trackingURLs: [],
    stepper: 1,
    id: null,

    plannedCost: null,
    videoFile: null,
    resources: null,
    title: null,

    withURLTracking: false,
    inDetailPeriod: false,
    billExactPrice: false,
    proof: false,
    dummy: false,
    book: true,

    dayBudget: "",
    planOTS: "",
    budget: 1,
    group: "",
    cost: "1",

    forecastReachDays: 0,
    strategyAutoMode: 0,
    forecastOTSdays: 0,
    strategyAuto: 0,
    dayPlanOTS: 0,
    intervalK: 0,

    limitControlMode: 0,
    dayPlanShows: 1,
    displayCost: 1,
    planShows: 1,

    frequency: "0.01600000",
    minIntervalSecs: 0,
    costPPVnight: "1",
    costPPVday: "1",
    archived: "0",

    auctionMode: "PPV",
    doorType: "outdoor",

    status: "planned",
    oldStartDate: "",
    oldEndDate: "",
    startDate: "",
    endDate: "",

    hoursActive: {},
    notDetailWeek,
    detailWeek,

    orientationVertical: ["1", "0"],
    selectedNetworks: [],
    city: ["MOSCOW"],
    format: ["6x3"],
    doorSurface: ["bc"],
    videoID: [],
    previewVideos: [],
    replaceVideos: false,

    review_per_video: {},
});

export default {
    namespaced: true,
    name: "translation",

    state: {
        translation: initTranslation(),
    },

    mutations: {
        SET_DAYS: (state, { forecastReachDays, forecastOTSdays }) => {
            state.translation.forecastReachDays = forecastReachDays;
            state.translation.forecastOTSdays = forecastOTSdays;
        },

        ADD_SURFACES_TO_TRANSLATION: (state, surfaces) =>
            (state.translation.addedSurfaces = surfaces.slice()),
        UNSET_SELECTED_SURFACES: (state) =>
            (state.translation.selectedSurfaces = []),
        ADD_SELECTED_SURFACE: (state, surface) => {
            if (!state.translation.selectedSurfaces)
                state.translation.selectedSurfaces = [];
            state.translation.selectedSurfaces.push(surface);
        },
        ADD_MANY_SELECTED_SURFACES: (state, surfaces) => {
            if (!state.translation.selectedSurfaces)
                state.translation.selectedSurfaces = [];
            state.translation.selectedSurfaces.push(...surfaces);
        },
        CHANGE_TRANSLATION_PROPERTY: (state, { name, value }) =>
            (state.translation[name] = value),
        ADD_VIDEO_ID_TO_TRANSLATION: (state, videoID) => {
            if (!state.translation.videoID) state.translation.videoID = [];
            state.translation.videoID.push(videoID);
        },
        ADD_VIDEO_ID_TO_PREVIEW: (state, photo) => {
            if (!state.translation.previewVideos)
                state.translation.previewVideos = [];
            state.translation.previewVideos.push(photo);
        },

        SET_TRANSLATION: (state, translation) =>
            (state.translation = translation),

        CLEAR_TRANSLATION: (state) => {
            const city = state.translation.city;
            const doorType = state.translation.doorType;
            state.translation = initTranslation();
            state.translation.city = city;
            state.translation.doorType = doorType;
        },

        SET_CURRENT_STEP: (state, step) => (state.translation.stepper = step),
    },

    actions: {
        /**
         * Добавить поверхности в рекламную компанию
         */
        addSurfacesToTranslation: ({ commit }, surfaces) =>
            commit("ADD_SURFACES_TO_TRANSLATION", surfaces),
        /**
         * Добавление списка поверхности в рекламную кампанию
         */
        addManySelectedSurfaces: ({ commit }, surfaces) =>
            commit("ADD_MANY_SELECTED_SURFACES", surfaces),
        /**
         * Добавления выбранных поверхностей в список рекламной кампании
         */
        addSelectedSurface: ({ commit }, surface) =>
            commit("ADD_SELECTED_SURFACE", surface),
        /**
         * Установка текущего шага формы редактирования рекламной кампании
         */
        setCurrentStep: ({ commit }, step) => commit("SET_CURRENT_STEP", step),
        /**
         * Очистка рекламной кампании
         */
        clearTranslation: ({ commit }) => commit("CLEAR_TRANSLATION"),

        /**
         * Экспорт медиаплпна по рекламной камапнии
         */
        async exportMediaplanFor(_, id) {
            const { mediaplan_xlsx_url: url } = (
                await TranslationService.getTranslationMediaPlan(id)
            ).data.api.translation;
            return url;
        },

        /**
         * Заведение новой рекламной кампании
         */
        async newTranslation({ dispatch }) {
            const { id } = (await TranslationService.newTranslation()).data;
            dispatch("changeTranslation", { id });
        },
        /**
         * Изменение свойства рекламной кампании
         */
        changeTranslation({ commit, state }, data) {
            Object.keys(data).forEach((name) => {
                if (state.translation.hasOwnProperty(name)) {
                    commit("CHANGE_TRANSLATION_PROPERTY", {
                        name,
                        value: data[name],
                    });
                }
            });
        },

        /**
         * Сохранение рекламной кампании
         */
        async saveTranslation({ dispatch, commit, state, rootState }) {
            const translation = { ...state.translation };

            translation.selectedSurfaces = translation.addedSurfaces.slice();
            console.log(translation.withURLTracking, translation.trackingURLs);
            if (
                translation.withURLTracking &&
                Array.isArray(translation.trackingURLs)
            ) {
                translation.clicks = translation.trackingURLs
                    .filter((url) => !!url)
                    .slice();
            } else translation.clicks = [];

            if (translation.inDetailPeriod) {
                Object.values(translation.detailWeek).forEach((value) => {
                    translation.hoursActive[value.value] = value.hours;
                });
            } else {
                Object.values(translation.detailWeek).forEach((value) => {
                    const { hours } = translation.notDetailWeek.find(
                        (d) => d.value === value.type
                    );
                    translation.hoursActive[value.value] = hours;
                });
            }

            translation.billExactPrice = translation.billExactPrice ? "1" : "0";
            translation.dummy = translation.dummy ? "1" : "0";
            translation.proof =
                translation.proof || rootState.auth.isAllBB ? 1 : 0;

            if (translation.translationType === "guaranteed") {
                translation.billExactPrice = "1";
                if (!!Number(translation.limitControlMode)) {
                    translation.costPPVnight = translation.costPPVday =
                        translation.displayCost;
                }
            }

            const uslessTranslationProperties = [
                "archived",
                "addedSurfaces",
                "inDetailPeriod",
                "oldEndDate",
                "oldStartDate",
                "previewVideos",
                "replaceVideos",
                "review_per_video",
                "stepper",
                "detailWeek",
                "notDetailWeek",
                "resources",
                "videoFile",
                "selectedNetworks",
                "plannedCost",
                "displayCost",
                "frequency",
                "paymentType",
                "withURLTracking",
                "trackingURLs",
            ];
            if (translation.translationType !== "guaranteed") {
                const onlyGuaranteedProperties = [
                    "dayPlanOTS",
                    "strategy",
                    "book",
                    "forecastOTSdays",
                    "forecastReachDays",
                    "intervalK",
                    "planOTS",
                    "strategyAuto",
                    "strategyAutoMode",
                ];
                uslessTranslationProperties.push(...onlyGuaranteedProperties);

                if (!rootState.auth.allMighty) {
                    uslessTranslationProperties.push("billExactPrice", "dummy");
                }
            }

            if (translation.doorType !== "indoor") {
                uslessTranslationProperties.push(
                    "doorSurface",
                    "orientationVertical"
                );
            } else {
                uslessTranslationProperties.push("format");
            }

            if (
                translation.auctionMode !== "PPV" &&
                !Number(translation.limitControlMode)
            ) {
                uslessTranslationProperties.push("costPPVday", "costPPVnight");
            } else {
                uslessTranslationProperties.push("cost");
            }

            uslessTranslationProperties.forEach((property) => {
                delete translation[property];
            });

            try {
                await TranslationService.saveTranslation(
                    translation,
                    rootState.auth.allMighty
                );
                dispatch(
                    "notification/set",
                    {
                        message: "Рекламная кампания сохранена",
                        type: "success",
                    },
                    { root: true }
                );

                commit("UNSET_SELECTED_SURFACES");
                commit("SET_TRANSLATION", initTranslation());
                return { error: false };
            } catch (e) {
                dispatch(
                    "notification/set",
                    {
                        message: "Произошла ошибка при сохранении кампании",
                        type: "error",
                    },
                    { root: true }
                );
                return { error: true };
            }
        },
        /**
         * Загрузка рекламной кампании
         */
        async loadTranslation({ commit }, { id, step = 1 }) {
            const { translation } = (
                await TranslationService.getTranslation(id)
            ).data.api;
            const newTranslation = translationToFrontendDAL(translation, step);

            commit("SET_TRANSLATION", newTranslation);
            return {
                data: {
                    resources: translation.resources,
                },
            };
        },

        /**
         * Добавление ID видео в рекламную кампанию
         */
        addVideoIDToTranslation: ({ commit }, videoID) => {
            if (Array.isArray(videoID))
                videoID.forEach((video) =>
                    commit("ADD_VIDEO_ID_TO_TRANSLATION", video)
                );
            else commit("ADD_VIDEO_ID_TO_TRANSLATION", videoID);
        },
        /**
         * Добавление видео для просмотра в рекламную кампанию
         */
        addVideoToPreview: ({ commit }, videos) => {
            if (Array.isArray(videos))
                videos.forEach((video) =>
                    commit("ADD_VIDEO_ID_TO_PREVIEW", video)
                );
            else commit("ADD_VIDEO_ID_TO_PREVIEW", videos);
        },

        /**
         * Генерирование ссылки на список поверхностей
         */
        async generateLink({ state }) {
            const data = state.translation.addedSurfaces.map((s) => s.id);
            const { basket_id } = (
                await TranslationService.generateLink(JSON.stringify(data))
            ).data.api;
            return {
                data: basket_id,
                error: false,
            };
        },
    },

    getters: {
        getCurrentStep: (state) => state.translation.stepper,
        getCurrentTranslation: (state) => state.translation,
    },
};
