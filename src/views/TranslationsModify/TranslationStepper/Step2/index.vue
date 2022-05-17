<template>
    <v-layout column>
        <v-container>
            <v-img src="/img/step/2.png"></v-img>
        </v-container>
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
