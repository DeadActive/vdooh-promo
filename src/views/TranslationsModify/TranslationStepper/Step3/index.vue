<template>
    <v-layout column>
        <v-container>
            <v-img src="/img/step/3.png"></v-img>
        </v-container>
    </v-layout>
</template>

<script>
import PaymentPart from "./PaymentPart";
import PeriodPart from "./PeriodPart";

export default {
    name: "ModifyStep10",

    components: {
        PaymentPart,
        PeriodPart,
    },

    props: {
        translationIs: Function,
        floorLoading: Boolean,
        translation: Object,
        settings: Object,
        rules: Object,
    },
    methods: {},
};
</script>
