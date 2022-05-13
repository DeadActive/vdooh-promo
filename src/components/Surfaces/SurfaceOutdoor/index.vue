<template>
    <v-tabs v-model="tab" hide-slider class="dense">
        <v-tab ripple>
            <v-btn color="primary" :text="tab === 1">
                <v-icon small>map</v-icon>На карте
            </v-btn>
        </v-tab>
        <v-tab ripple>
            <v-btn color="primary" :text="tab === 0">
                <v-icon small>view_list</v-icon>Таблицей
            </v-btn>
        </v-tab>

        <v-layout class="mt-n2 ml-5">
            <v-layout justify-center v-if="isGuaranteed && isNew">
                <v-flex
                    class="mt-5 mr-2 black--text body-1 font-weight-regular cursor--pointer"
                    shrink
                    @click="isMaximizeReachComp = !isMaximizeReachComp"
                    >Максимизация охвата</v-flex
                >

                <v-flex class="pr-4 mr-2" shrink>
                    <v-checkbox v-model="isMaximizeReachComp" />
                </v-flex>

                <v-flex shrink>
                    <v-text-field
                        v-if="isMaximizeReach"
                        v-model="maximizeReachComp"
                        :max="allSurfacesCount"
                        oninput="!validity.typeMismatch||(value='');!validity.rangeOverflow||(value=this.max);validity.valid||(value='');"
                        style="width: 80px"
                        label="Количество"
                        type="number"
                        class="mt-2"
                        min="1"
                    />
                    <div v-else style="width: 80px" />
                </v-flex>
            </v-layout>

            <v-flex shrink>
                <v-checkbox
                    v-if="isGuaranteed"
                    v-model="showOnlyAvailable"
                    label="Только доступные"
                    class="pr-4 mr-2"
                />
            </v-flex>

            <v-flex shrink>
                <v-checkbox
                    v-model="showOnlySelected"
                    label="Только выбранные"
                    class="pr-4 mr-2"
                />
            </v-flex>
        </v-layout>

        <v-tab-item class="mt-6">
            <surfaces-map
                :is-maximize-reach="isMaximizeReachComp"
                :show-only-selected="showOnlySelected"
                :all-surfaces="availableSurfaces"
                :added-surfaces="addedSurfaces"
                :door-type="doorType"
                with-sort-bar
                @add-surface="$emit('add-surface', $event)"
                @remove-surface="$emit('remove-surface', $event)"
                @refresh-show-only-selected="refreshShowOnlySelected"
                @remove-only-added-surfaces="
                    $emit('remove-only-added-surfaces', $event)
                "
            />
        </v-tab-item>

        <v-tab-item>
            <surface-list
                :is-maximize-reach="isMaximizeReachComp"
                :show-only-selected="showOnlySelected"
                :added-surfaces="addedSurfaces"
                :all-surfaces="surfacesTable"
                :is-guaranteed="isGuaranteed"
                :door-type="doorType"
                @add-surface="$emit('add-surface', $event)"
                @select-all="$emit('select-all')"
                @remove-surface="$emit('remove-surface', $event)"
                @clear-surfaces="$emit('clear-surfaces')"
            />
        </v-tab-item>
    </v-tabs>
</template>

<script>
import SurfaceList from './SurfaceList';
import SurfacesMap from '@/components/Surfaces/SurfacesMap';

export default {
    name: 'SurfaceOutdoor',

    components: {
        SurfaceList,
        SurfacesMap,
    },

    props: {
        addedSurfaces: {
            type: Array,
            default: () => [],
        },
        allSurfaces: {
            type: Array,
            default: () => [],
        },
        doorType: {
            type: String,
            default: '',
        },
        maximizeReach: [Number, String],
        isMaximizeReach: Boolean,
        isGuaranteed: Boolean,
        isNew: Boolean,
    },

    data: () => ({
        showOnlyAvailable: false,
        showOnlySelected: false,
        tab: null,
    }),

    computed: {
        isMaximizeReachComp: {
            get() {
                return this.isMaximizeReach;
            },
            set(newVal) {
                this.$emit('update:is-maximize-reach', newVal);
            },
        },
        maximizeReachComp: {
            get() {
                return this.maximizeReach;
            },
            set(newVal) {
                this.$emit('update:maximize-reach', newVal);
            },
        },
        surfacesTable() {
            const surfaces = [];
            this.allSurfaces.forEach((s) => {
                if (s.players) {
                    const players = s.players.map((p) => ({
                        site_id: s.site_id,
                        ...p,
                    }));
                    return surfaces.push(...players);
                }
                return surfaces.push(s);
            });

            if (this.showOnlyAvailable) {
                return surfaces.filter((s) => s.available);
            }
            return surfaces;
        },
        availableSurfaces() {
            if (this.showOnlyAvailable) {
                return this.allSurfaces.filter((s) => s.available);
            }
            return this.allSurfaces;
        },

        allSurfacesCount() {
            return this.$store.getters['surfaces/getAllSurfacesCount'];
        },
        isAllbbClient() {
            return this.$store.getters['auth/getIsAllBB'];
        },
    },

    methods: {
        refreshShowOnlySelected() {
            // if (this.isAllbbClient) return;
            this.showOnlySelected = !this.showOnlySelected;
            setTimeout(() => {
                this.showOnlySelected = !this.showOnlySelected;
            }, 1);
        },
    },
};
</script>

<style></style>
