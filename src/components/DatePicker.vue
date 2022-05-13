<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        ref="menu"
        offset-y
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="date"
                :disabled="disabled"
                append-icon="calendar_today"
                :label="label"
                readonly
                v-on="on"
                @click:append="menu = true"
                outlined
                dense
                color="primary"
            />
        </template>

        <v-date-picker
            v-model="date"
            :show-current="showCurrent"
            :first-day-of-week="1"
            :disabled="disabled"
            :min="showCurrent"
            :max="max"
            locale="ru"
            scrollable
            no-title
            :type="isMonth ? 'month' : 'date'"
            @click:date="$refs.menu.save(date)"
            @click:month="clickMonth"
            color="primary"
        >
        </v-date-picker>
    </v-menu>
</template>

<script>
export default {
    name: 'CalendarInput',

    props: {
        label: {
            default: 'Выбор даты',
            type: String,
        },
        showCurrent: String,
        disabled: Boolean,
        isMonth: Boolean,
        value: String,
        max: String,
    },

    data: (vm) => ({
        menu: false,
    }),

    computed: {
        date: {
            get() {
                return this.value;
            },
            set(date) {
                this.$emit('input', date);
            },
        },
    },

    methods: {
        clickMonth() {
            if (this.isMonth) {
                this.$refs.menu.save(this.date);
            }
        },
    },
};
</script>
