<template>
    <v-layout>
        <v-flex xs10>
            <v-tooltip top>
                <template #activator="{ on }">
                    <div
                        class="headline text-truncate"
                        style="cursor: pointer"
                        @click="openTranslation(translation.id)"
                        v-on="on"
                    >
                        {{ translation.title }}
                    </div>
                </template>
                {{ translation.title }}
            </v-tooltip>

            <div class="grey--text caption">id: {{ translation.id }}</div>
            <span class="grey--text caption">{{ translation.rusStatus }}</span>
        </v-flex>

        <v-flex xs2>
            <div
                v-if="translation.status === 'running'"
                class="text-right caption"
            >
                <v-tooltip top>
                    <template #activator="{ on }">
                        <v-progress-circular
                            :value="fillBudget"
                            :rotate="-90"
                            :size="43"
                            :width="5"
                            color="green"
                            v-on="on"
                        >
                            {{ fillBudget.toFixed() }}%
                        </v-progress-circular>
                    </template>

                    <span
                        >Израсходовано {{ spentBudget }} руб. из
                        {{ budget }} руб.</span
                    >
                </v-tooltip>
            </div>

            <div class="text-right" v-if="!isReadonly">
                <tooltip-button
                    v-if="!Number(translation.archived)"
                    :disabled="!notMayDeleteTranslation"
                    :loading="deleteLoading"
                    :tooltip="deleteTooltip"
                    icon="delete_outline"
                    color="error"
                    class="mr-0"
                    @action="deleteTranslation(translation.id)"
                />

                <tooltip-button
                    v-else
                    :loading="deleteLoading"
                    tooltip="Восстановить"
                    icon="visibility"
                    class="mr-0"
                    @action="recoverTranslation"
                />
            </div>
        </v-flex>
    </v-layout>
</template>

<script>
import TooltipButton from '@/components/TooltipButton';

export default {
    name: 'CardTitle',

    components: {
        TooltipButton,
    },

    props: {
        deleteLoading: Boolean,
        translation: Object,
    },

    computed: {
        notMayDeleteTranslation() {
            const { status } = this.translation;
            const statuses = ['planned', 'declined', 'finished', 'stop'];
            return statuses.includes(status);
        },

        deleteTooltip() {
            return this.notMayDeleteTranslation
                ? 'Скрыть'
                : 'Скрыть невозможно. Сначала остановите кампанию';
        },

        isReadonly() {
            return this.$store.getters['auth/isReadonly'];
        },

        fillBudget() {
            return parseFloat(this.translation.fill_budget);
        },

        spentBudget() {
            return Number(
                parseFloat(this.translation.spent_budget_RUR).toFixed()
            ).toLocaleString('ru');
        },
        budget() {
            return Number(
                parseFloat(this.translation.budget_RUR).toFixed()
            ).toLocaleString('ru');
        },
    },

    methods: {
        recoverTranslation() {
            return this.$emit('recover-translation', this.translation.id);
        },
        deleteTranslation() {
            return this.$emit('delete-translation', this.translation.id);
        },
        openTranslation(id) {
            return this.$emit('open-translation', id);
        },
    },
};
</script>
