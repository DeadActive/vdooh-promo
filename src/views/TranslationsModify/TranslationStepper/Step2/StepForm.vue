<template>
    <v-layout>
        <v-flex xs12 md6 lg4 xl4>
            <refresh-select
                v-model="city"
                :disabled="notMayEdit || isMaximizeReach"
                :rules="[rules.required]"
                :refresh="refresh"
                :items="cities"
                item-value="CITYID"
                item-text="nameRu"
                label="Город"
                with-select-all
            />
        </v-flex>

        <template v-if="translation.doorType === 'outdoor'" class="mb-2">
            <v-flex
                v-if="!isGuaranteed"
                :class="$vuetify.breakpoint.lgAndUp ? 'pl-4' : 'pl-0'"
                xs12
                md6
                lg4
                xl4
            >
                <refresh-select
                    v-model="selectedNetworks"
                    :items="networks"
                    item-text="network_name"
                    item-value="NETWORKID"
                    label="Операторы"
                    with-select-all
                />
            </v-flex>

            <v-flex
                xs12
                md12
                lg4
                xl4
                :class="$vuetify.breakpoint.lgAndUp ? 'pl-4' : 'pl-0'"
            >
                <refresh-select
                    v-model="format"
                    :disabled="notMayEdit || isMaximizeReach"
                    :rules="[rules.required]"
                    :items="outdoorFormat"
                    item-value="value"
                    item-text="name"
                    label="Формат"
                    with-select-all
                />
            </v-flex>
        </template>

        <template v-if="translation.doorType === 'indoor'" class="mb-2">
            <v-flex
                xs12
                md6
                lg5
                xl4
                :class="$vuetify.breakpoint.lgAndUp ? 'pl-4' : 'pl-0'"
            >
                <refresh-select
                    v-model="orientationVertical"
                    :rules="[rules.required]"
                    :items="indoorType"
                    item-value="value"
                    item-text="name"
                    label="Формат"
                    with-select-all
                />
            </v-flex>

            <v-flex
                xs12
                md6
                lg5
                xl4
                :class="$vuetify.breakpoint.lgAndUp ? 'pl-4' : 'pl-0'"
            >
                <refresh-select
                    v-model="doorSurface"
                    :items="indoorFormat"
                    label="Тип локации"
                    item-value="value"
                    item-text="name"
                    with-select-all
                />
            </v-flex>
        </template>
    </v-layout>
</template>

<script>
import RefreshSelect from "@/components/RefreshSelect";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
    name: "StepForm",

    components: {
        RefreshSelect,
    },

    props: {
        isMaximizeReach: Boolean,
        checkSurfaces: Function,
        isGuaranteed: Boolean,
        translation: Object,
        notMayEdit: Boolean,
        isNew: Boolean,
        rules: Object,
    },

    created() {
        if (this.translation.stepper !== 2) return;
        this.loadCities();
        console.log(this);
    },

    data: () => ({
        firstCityLoad: true,
        refresh: false,
    }),

    computed: {
        //#region computed properties
        city: {
            get() {
                return this.translation.city;
            },
            set(city) {
                this.checkSurfaces("city", city);
            },
        },
        selectedNetworks: {
            get() {
                return this.translation.selectedNetworks;
            },
            set(selectedNetworks) {
                this.checkSurfaces("selectedNetworks", selectedNetworks);
            },
        },
        format: {
            get() {
                return this.translation.format;
            },
            set(format) {
                this.checkSurfaces("format", format);
            },
        },
        orientationVertical: {
            get() {
                return this.translation.orientationVertical;
            },
            set(orientationVertical) {
                this.checkSurfaces("orientationVertical", orientationVertical);
            },
        },
        doorSurface: {
            get() {
                return this.translation.doorSurface;
            },
            set(doorSurface) {
                this.checkSurfaces("doorSurface", doorSurface);
            },
        },
        //#endregion
        ...mapGetters({
            isGalmed: "auth/getIsGalmed",
            outdoorFormat: "types/outdoorFormat",
            indoorFormat: "types/indoorFormat",
            networks: "surfaces/getNetworks",
            indoorType: "types/indoorType",
            cities: "types/getCities",
        }),
    },

    methods: {
        ...mapActions("settings", ["defineLocation"]),
        async loadCities() {
            await this.$store.dispatch("types/loadCities", {
                door: this.translation.doorType,
                galmed: this.isGalmed ? 1 : 0,
            });

            if (this.isNew && this.firstCityLoad) {
                const city = this.$store.getters["settings/getTranslationCity"];
                this.$store.dispatch("translation/changeTranslation", { city });
                this.firstCityLoad = false;
            }

            this.loadNetworks();
            this.loadLocation();
        },
        async loadLocation() {
            this.defineLocation();
        },
        async loadNetworks() {
            if (this.isGuaranteed && this.isNew) {
                this.selectedNetworks = ["GALLERY"];
            }

            await this.$store.dispatch("surfaces/getNetworks", {
                doorType: this.translation.doorType,
                mode: this.translation.auctionMode,
                city: this.translation.city,
                galmed: this.isGalmed ? 1 : 0,
            });

            this.selectedNetworks = this.networks.map(
                (network) => network.NETWORKID
            );

            this.loadFormats();
        },

        async loadFormats() {
            const networks = this.selectedNetworks.length
                ? this.selectedNetworks
                : this.networks.map((network) => network.NETWORKID);
            const cities = this.translation.city.length
                ? this.translation.city
                : this.cities.map((city) => city.CITYID);
            await this.$store.dispatch("types/loadOutdoorFormat", {
                NETWORKID: networks,
                CITYID: cities,
            });
            if (this.isGalmed)
                this.format = this.outdoorFormat.map((format) => format.value);
        },

        refreshAll() {
            this.refresh = true;
            this.$nextTick(() => {
                this.refresh = false;
            });
        },
    },

    watch: {
        "translation.stepper"(step) {
            if (step !== 2) return;
            this.loadCities();
        },
        "translation.city"(city) {
            this.loadNetworks();
        },
    },
};
</script>
