<template>
    <v-layout column>
        <span class="mb-5 headline">Период</span>
        <v-divider />
        <period-part
            :translation="translation"
            :rules="rules"
            class="mt-6"
            @time-outed-surfaces="$emit('time-outed-surfaces')"
        />

        <span class="mb-2 headline">Оплата</span>
        <v-divider />

        <payment-part
            :translation-is="translationIs"
            :floor-loading="floorLoading"
            :translation="translation"
            :settings="settings"
            :rules="rules"
        />
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
