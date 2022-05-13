<template>
    <v-card style="overflow-y: auto" min-height="300px" max-height="400px" mb-3>
        <v-card-title class="mx-1 pa-3 title font-weight-regular">
            <span>{{
                declOfNum(surfaces.length, ['Выбран', 'Выбрано', 'Выбрано'])
            }}</span>
            <span class="font-weight-medium mx-1 primary--text">{{
                surfaces.length
            }}</span>
            <span>{{
                declOfNum(surfaces.length, ['экран', 'экрана', 'экранов'])
            }}</span>
        </v-card-title>

        <v-divider />
        <v-layout justify-center align-center fill-height>
            <v-expansion-panels flat v-if="!isGalmed">
                <v-expansion-panel
                    v-for="item in currentItems"
                    :key="item.NETWORKID"
                >
                    <v-expansion-panel-header>
                        <v-layout wrap>
                            <v-flex xs12 class="mb-4">
                                <span class="font-weight-bold">{{
                                    item.NETWORKID
                                }}</span>
                                ({{ item.items.length }}
                                {{
                                    declOfNum(item.items.length, [
                                        'экран',
                                        'экрана',
                                        'экранов',
                                    ])
                                }})
                            </v-flex>

                            <template v-if="isIndoor">
                                <span class="font-weight-medium">{{
                                    countHorizontal(item.items)
                                }}</span>
                                {{
                                    declOfNum(countHorizontal(item.items), [
                                        'горизонтальный',
                                        'горизонтальных',
                                        'горизонтальных',
                                    ])
                                }},
                                <span class="font-weight-medium">{{
                                    countVertical(item.items)
                                }}</span>
                                {{
                                    declOfNum(countVertical(item.items), [
                                        'вертикальный',
                                        'вертикальных',
                                        'вертикальных',
                                    ])
                                }}
                            </template>

                            <template v-if="isOutdoor">
                                <v-img src="/img/icons/billboard.svg"></v-img>
                                <span class="font-weight-medium mr-1">{{
                                    countBillboard(item.items)
                                }}</span>
                                {{
                                    declOfNum(countBillboard(item.items), [
                                        'билборд',
                                        'билборда',
                                        'билбордов',
                                    ])
                                }},
                                <v-img src="/img/icons/supersite.svg"></v-img>
                                <span class="font-weight-medium mr-1 ml-2">{{
                                    countSuperSite(item.items)
                                }}</span>
                                {{
                                    declOfNum(countSuperSite(item.items), [
                                        'суперсайт',
                                        'суперсайта',
                                        'суперсайтов',
                                    ])
                                }},
                                <span class="font-weight-medium mr-1 ml-2">{{
                                    countMediaFasad(item.items)
                                }}</span>
                                {{
                                    declOfNum(countMediaFasad(item.items), [
                                        'медиафасад',
                                        'медифасада',
                                        'медиафасадов',
                                    ])
                                }}
                                <v-img src="/img/icons/cityboard.svg"></v-img>
                                <span class="font-weight-medium mr-1 ml-2">{{
                                    countCityBoards(item.items)
                                }}</span>
                                {{
                                    declOfNum(countCityBoards(item.items), [
                                        'ситиборд',
                                        'ситиборда',
                                        'ситибордов',
                                    ])
                                }}
                            </template>
                        </v-layout>
                    </v-expansion-panel-header>

                    <v-expansion-panel-content>
                        <v-data-table
                            :items="item.items"
                            :headers="itemsHeaders"
                            hide-default-footer
                            hide-default-header
                        />
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <template v-else>
                <v-layout wrap class="pa-4">
                    <v-flex xs12 class="mb-4">
                        <span class="font-weight-bold">
                            {{ surfaces.length }}

                            {{
                                declOfNum(surfaces.length, [
                                    'экран',
                                    'экрана',
                                    'экранов',
                                ])
                            }}</span
                        >
                    </v-flex>

                    <template v-if="isIndoor">
                        <span class="font-weight-medium">{{
                            countHorizontal(surfaces)
                        }}</span>
                        {{
                            declOfNum(countHorizontal(surfaces), [
                                'горизонтальный',
                                'горизонтальных',
                                'горизонтальных',
                            ])
                        }},
                        <span class="font-weight-medium">{{
                            countVertical(surfaces)
                        }}</span>
                        {{
                            declOfNum(countVertical(surfaces), [
                                'вертикальный',
                                'вертикальных',
                                'вертикальных',
                            ])
                        }}
                    </template>

                    <template v-if="isOutdoor">
                        <v-flex xs12>
                            <span class="font-weight-medium mr-1">{{
                                countBillboard(surfaces)
                            }}</span>
                            {{
                                declOfNum(countBillboard(surfaces), [
                                    'билборд',
                                    'билборда',
                                    'билбордов',
                                ])
                            }},
                            <span class="font-weight-medium mr-1 ml-2">{{
                                countSuperSite(surfaces)
                            }}</span>
                            {{
                                declOfNum(countSuperSite(surfaces), [
                                    'суперсайт',
                                    'суперсайта',
                                    'суперсайтов',
                                ])
                            }},
                            <span class="font-weight-medium mr-1 ml-2">{{
                                countMediaFasad(surfaces)
                            }}</span>
                            {{
                                declOfNum(countMediaFasad(surfaces), [
                                    'медиафасад',
                                    'медифасада',
                                    'медиафасадов',
                                ])
                            }}
                            <span class="font-weight-medium mr-1 ml-2">{{
                                countCityBoards(surfaces)
                            }}</span>
                            {{
                                declOfNum(countCityBoards(surfaces), [
                                    'ситиборд',
                                    'ситиборда',
                                    'ситибордов',
                                ])
                            }}
                        </v-flex>
                        <v-flex xs12 row class="pa-0 ma-0 mt-8">
                            <div
                                class="d-flex flex-column align-center mr-8"
                                v-if="countBillboard(surfaces) > 0"
                            >
                                <v-img
                                    src="/img/icons/billboard.svg"
                                    width="48"
                                ></v-img>
                                <div>
                                    <span class="font-weight-medium mr-1"
                                        ><b>{{
                                            countBillboard(surfaces)
                                        }}</b></span
                                    >
                                    {{
                                        declOfNum(countBillboard(surfaces), [
                                            'билборд',
                                            'билборда',
                                            'билбордов',
                                        ])
                                    }}
                                </div>
                            </div>

                            <div
                                class="d-flex flex-column align-center mr-8"
                                v-if="countSuperSite(surfaces) > 0"
                            >
                                <v-img
                                    src="/img/icons/supersite.svg"
                                    width="48"
                                ></v-img>
                                <div>
                                    <span class="font-weight-medium mr-1"
                                        ><b>{{
                                            countSuperSite(surfaces)
                                        }}</b></span
                                    >
                                    {{
                                        declOfNum(countSuperSite(surfaces), [
                                            'суперсайт',
                                            'суперсайта',
                                            'суперсайтов',
                                        ])
                                    }}
                                </div>
                            </div>

                            <div
                                class="d-flex flex-column align-center"
                                v-if="countCityBoards(surfaces) > 0"
                            >
                                <v-img
                                    src="/img/icons/cityboard.svg"
                                    width="48"
                                ></v-img>
                                <div>
                                    <span class="font-weight-medium mr-1"
                                        ><b>{{
                                            countCityBoards(surfaces)
                                        }}</b></span
                                    >
                                    {{
                                        declOfNum(countCityBoards(surfaces), [
                                            'ситиборд',
                                            'ситиборда',
                                            'ситибордов',
                                        ])
                                    }}
                                </div>
                            </div>
                        </v-flex>
                    </template>
                </v-layout>
            </template>
        </v-layout>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import ToggleElement from '@/components/ToggleElement';

export default {
    name: 'SurfacesTable',

    components: {
        ToggleElement,
    },

    props: {
        doorType: String,
        surfaces: Array,
    },

    computed: {
        currentItems() {
            const networks = new Set(this.surfaces.map((s) => s.NETWORKID));
            let items = [];

            networks.forEach((network) => {
                items.push({
                    NETWORKID: network,
                    items: [
                        ...this.surfaces.filter((s) => s.NETWORKID === network),
                    ],
                });
            });

            // items = items.map(item => ({
            //   ppvDay: (item.items.reduce(summByValue('PPV_day'), 0) / item.items.length).toFixed(2),
            //   ppvNight: (item.items.reduce(summByValue('PPV_night'), 0) / item.items.length).toFixed(2),
            //   ...item,
            // }));
            return items.sort((prev, next) =>
                prev.items.length < next.items.length ? 1 : -1
            );
        },
        isOutdoor() {
            return this.doorType === 'outdoor';
        },
        isIndoor() {
            return this.doorType === 'indoor';
        },

        itemsHeaders() {
            const headers = [
                { value: 'SURFACEID' },
                { value: 'city_id' },
                { value: 'format' },
            ];

            if (this.isIndoor) {
                headers.push({ value: 'type' });
            }
            headers.push({ value: 'address' });
            return headers;
        },
        ...mapGetters({
            isGalmed: 'auth/getIsGalmed',
        }),
    },

    methods: {
        declOfNum(n, titles) {
            return titles[
                n % 10 === 1 && n % 100 !== 11
                    ? 0
                    : n % 10 >= 2 &&
                      n % 10 <= 4 &&
                      (n % 100 < 10 || n % 100 >= 20)
                    ? 1
                    : 2
            ];
        },

        countHorizontal(items) {
            return items.filter((i) => !Number(i.is_vertical)).length;
        },
        countVertical(items) {
            return items.filter((i) => !!Number(i.is_vertical)).length;
        },

        countBillboard(items) {
            return items.filter((i) => i.format === '6x3').length;
        },
        countSuperSite(items) {
            return items.filter(
                (i) => i.format === '12x4' || i.format === '15x5'
            ).length;
        },
        countMediaFasad(items) {
            return items.filter(
                (i) => i.format && i.format.toLowerCase() === 'mf'
            ).length;
        },
        countCityBoards(items) {
            return items.filter(
                (i) => i.format && i.format.toLowerCase() === '3.7x2.7'
            ).length;
        },
    },
};
</script>
