<template>
    <v-container pa-0 ma-0 grid-list-xl>
        <v-layout wrap>
            <!-- <v-flex xs12 v-if="isGuaranteedClient">
                <v-btn-toggle
                    :value="translation.translationType"
                    borderless
                    mandatory
                    @change="changeGuaranteed"
                >
                    <v-btn
                        :disabled="!isNew && !translationIs('planned')"
                        value="auction"
                        text
                    >
                        <v-icon>gavel</v-icon>
                        <span class="pl-2">Аукцион</span>
                    </v-btn>

                    <v-btn
                        :disabled="!isNew && !translationIs('planned')"
                        value="guaranteed"
                        text
                    >
                        <v-icon>security</v-icon>
                        <span class="pl-2">Гарантид</span>
                    </v-btn>
                </v-btn-toggle>
            </v-flex> -->

            <v-flex xs12 md4>
                <h3 style="font-size: 18px" class="pb-4">Название кампании</h3>
                <v-text-field
                    v-model="translation.title"
                    :rules="[rules.required]"
                    ref="title"
                    required
                    mb-2
                    outlined
                    dense
                    append-icon="mdi-face-man"
                />
            </v-flex>

            <v-col cols="12" class="pa-0 ma-0"></v-col>

            <!-- <v-fade-transition>
                <v-flex v-if="isGuaranteed" xs12 md3 offset-md1>
                    <v-select
                        v-model="limitControlMode"
                        :disabled="!isNew && !translationIs('planned')"
                        :rules="[rules.required]"
                        :items="purchaseTypes"
                        label="Тип закупки"
                        item-value="value"
                        item-text="name"
                        required
                    />
                </v-flex>
            </v-fade-transition> -->

            <!-- <v-fade-transition>
        <v-flex v-if="!isGuaranteed" xs12 md3 offset-md1>
          <v-select
            v-model="doorType"
            :disabled="!isNew && !translationIs('planned')"
            :rules="[rules.required]"
            :items="doorTypes"
            label="Тип поверхности"
            item-value="value"
            item-text="name"
            required
          />
        </v-flex>
      </v-fade-transition> -->

            <!-- <v-fade-transition> -->
            <!-- <v-flex v-if="!isGuaranteed" key="auctionMode" xs12> -->
            <!-- <v-select
                        v-model="auctionMode"
                        :disabled="!isNew && !translationIs('planned')"
                        :rules="[rules.required]"
                        :items="isGalmed ? auctionModesGallery : auctionModes"
                        label="Тип аукциона"
                        item-value="value"
                        item-text="name"
                        required
                    /> -->
            <!-- <h3 style="font-size: 18px">Тип аукциона</h3>
                    <v-radio-group v-model="auctionMode" row>
                        <v-radio
                            v-for="mode in auctionModesGallery"
                            :key="mode.value"
                            :label="mode.name"
                            :value="mode.value"
                            class="top"
                            style="max-width: 300px"
                        >
                            <template #label>
                                <div class="d-flex flex-column">
                                    <div class="d-flex flex-row align-center">
                                        <v-img
                                            :src="`/img/icons/${mode.value}.svg`"
                                            class="mr-2"
                                            max-width="40"
                                        ></v-img>
                                        <span
                                            class="primary--text"
                                            style="
                                                fonst-size: 14px;
                                                font-weight: 700;
                                            "
                                        >
                                            {{ mode.name }}
                                        </span>
                                    </div>
                                    <div class="pt-2">
                                        <p class="small" v-html="mode.text"></p>
                                    </div>
                                </div>
                            </template>
                        </v-radio>
                    </v-radio-group>
                </v-flex> -->
            <!-- </v-fade-transition> -->

            <!-- <template v-if="isSuperAdmin">
                <v-flex xs12 />

                <v-flex xs12 md3>
                    <v-text-field
                        v-model="translation.group"
                        label="deal_group"
                        mb-2
                    />
                </v-flex>

                <v-flex xs12 md3 offset-md1>
                    <v-checkbox v-model="translation.dummy" label="dummy" />
                </v-flex>

                <v-flex xs12 md3 offset-md1>
                    <v-checkbox
                        v-model="translation.billExactPrice"
                        label="billExactPrice"
                    />
                </v-flex>
            </template>
            <v-flex xs12 />
            <v-flex xs4 v-if="isGuaranteedClient">
                <v-checkbox
                    v-model="translation.withURLTracking"
                    label="Нужен трекинг URL"
                />

                <template v-if="translation.withURLTracking">
                    <template v-if="urlsLength > 1">
                        <v-layout
                            v-for="(
                                trackingURL, index
                            ) in translation.trackingURLs"
                            :key="index"
                            class="px-3"
                            column
                        >
                            <v-text-field
                                v-model="translation.trackingURLs[index]"
                                label="tracking URL"
                                append-icon="close"
                                @click:append="deleteURL(index)"
                            />
                        </v-layout>
                    </template>
                    <v-text-field
                        v-else
                        v-model="translation.trackingURLs[0]"
                        label="tracking URL"
                        append-icon="close"
                        @click:append="deleteURL(0)"
                    />

                    <v-btn color="primary" class="pa-0" text @click="addURL">
                        Добавить еще
                    </v-btn>

                    <div class="mt-4">
                        <div class="mt-1">${OTS} - значение OTS</div>
                        <div class="mt-1">${TID} - ID рекламной кампании</div>
                        <div class="mt-1">${VID} - ID видео</div>
                        <div class="mt-1">
                            ${GID} - ID рекламной поверхности
                        </div>
                        <div class="mt-1">
                            ${NID} - название рекламной сети (оператора)
                        </div>
                    </div>
                </template>
            </v-flex> -->
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from "vuex";

const purchaseTypes = [
    { value: 0, name: "Контакты" },
    { value: 1, name: "Показы" },
];

export default {
    name: "ModifyStep1",

    props: {
        translationIs: Function,
        checkSurfaces: Function,
        isGuaranteed: Boolean,
        translation: Object,
        isNew: Boolean,
        rules: Object,
    },

    data: () => ({
        purchaseTypes,
        newTrackingURL: "",
    }),

    mounted() {
        this.$store.dispatch("translation/changeTranslation", {
            title: "РИФ 2022",
        });
    },

    computed: {
        title: {
            get() {
                return this.translation.title;
            },
            set(title) {
                this.$store.dispatch("translation/changeTranslation", {
                    title,
                });
            },
        },
        doorType: {
            get() {
                return this.translation.doorType;
            },
            set(doorType) {
                this.checkSurfaces("doorType", doorType);
            },
        },
        auctionMode: {
            get() {
                return this.translation.auctionMode;
            },
            set(auctionMode) {
                this.checkSurfaces("auctionMode", auctionMode);
            },
        },
        limitControlMode: {
            get() {
                return this.translation.limitControlMode;
            },
            set(limitControlMode) {
                if (!!Number(limitControlMode)) {
                    this.auctionMode = "PPV";
                } else {
                    this.auctionMode = "CPT";
                }
                this.$store.dispatch("translation/changeTranslation", {
                    limitControlMode,
                });
            },
        },

        urlsLength() {
            return this.translation.trackingURLs.length;
        },

        // ...mapGetters({
        //     isGuaranteedClient: "auth/getIsGuaranteedClient",
        //     auctionModes: "types/auctionModes",
        //     auctionModesGallery: "types/auctionModesGallery",
        //     isSuperAdmin: "auth/isAllMighty",
        //     isGalmed: "auth/getIsGalmed",
        //     doorTypes: "types/doorTypes",
        // }),
    },

    methods: {
        changeGuaranteed(translationType) {
            this.translation.translationType = translationType;
            if (translationType === "guaranteed") {
                this.translation.group = "gallery!";
                this.doorType = "outdoor";
                this.auctionMode = "CPT";
            } else {
                this.translation.group = "";
            }
        },

        deleteURL(index) {
            this.translation.trackingURLs.splice(index, 1);
        },
        addURL() {
            if (this.translation.trackingURLs[this.urlsLength - 1]) {
                this.translation.trackingURLs.push("");
            }
        },
    },
};
</script>
