<template>
    <v-layout column>
        <v-flex class="mb-4 px-4">
            <step-form
                :check-surfaces="checkSurfaces"
                :is-guaranteed="isGuaranteed"
                :translation="translation"
                :is-new="isNew"
                :rules="rules"
            />
        </v-flex>
        <v-flex>
            <surface-map
                :return-single-surfaces="returnSingleSurfaces"
                :selected-surfaces="selectedSurfaces"
                :surfaces-loaded="surfacesLoaded"
                :added-surfaces="addedSurfaces"
                :is-guaranteed="isGuaranteed"
                :surfaces="surfaces"
                :is-new="isNew"
                @remove-added-surfaces="removeAddedSurfaces"
                @clear-surfaces="clearSurfaces"
                @add-surface="addSurface"
                @select-all="selectAll"
            />
        </v-flex>
    </v-layout>
</template>

<script>
import SurfaceMap from "./SurfaceMap";
import StepForm from "./StepForm";

export default {
    name: "ModifyStep9",

    components: {
        SurfaceMap,
        StepForm,
    },

    props: {
        returnSingleSurfaces: Function,
        notAvailableSurfaces: Array,
        surfacesLoaded: Boolean,
        translationIs: Function,
        checkSurfaces: Function,
        isGuaranteed: Boolean,
        translation: Object,
        isNew: Boolean,
        rules: Object,
    },

    data: () => ({
        selectedSurfaces: [],
    }),

    computed: {
        addedSurfaces: {
            get() {
                return this.translation.addedSurfaces;
            },
            set(surfaces) {
                this.$store.dispatch(
                    "translation/addSurfacesToTranslation",
                    surfaces
                );
            },
        },

        surfaces() {
            return this.$store.getters["surfaces/getSurfaces"];
        },
    },

    methods: {
        selectAll() {
            console.log("select-all");
            this.addedSurfaces = this.returnSingleSurfaces(this.surfaces);
        },
        addSurface(surface) {
            console.log("add-surface");
            this.addedSurfaces.push(...this.returnSingleSurfaces(surface));
        },

        clearSurfaces() {
            this.$emit("clear-surfaces");
        },
        removeAddedSurfaces(surfaces) {
            this.addedSurfaces = this.addedSurfaces.filter((surface) => {
                return !surfaces.find((s) => s.id === surface.id);
            });
        },
    },
};
</script>
