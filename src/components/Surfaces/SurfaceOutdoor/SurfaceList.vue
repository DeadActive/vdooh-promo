<template>
    <v-layout column>
        <v-layout justify-end class="pb-3">
            <v-flex xs12 md4 lg4 xl3>
                <v-text-field
                    v-model="search"
                    append-icon="search"
                    class="pt-0 pr-4"
                    label="Поиск"
                    single-line
                    hide-details
                    clearable
                />
            </v-flex>
        </v-layout>

        <table-actions
            :total-items="currentSurfaces.length"
            :items-per-page="itemsPerPage"
            :page.sync="page"
        />

        <v-data-table
            :items-per-page.sync="itemsPerPage"
            :footer-props="footerTableProps"
            :headers="currentHeaders"
            :items="currentSurfaces"
            :page.sync="page"
            :search="search"
            no-data-text="Данных нет"
            class="mb-4"
        >
            <template #item.format="{ item }">
                <span v-if="doorType === 'outdoor'">
                    {{
                        doorType === "outdoor"
                            ? currentOutdorFormat(item.format)
                            : item.format
                    }}
                </span>
            </template>

            <template #item.CITYID="{ item }">
                {{ russianCityName(item.city_id) }}
            </template>

            <template #item.ots="{ item }">
                {{
                    Number(parseInt(item.ots))
                        ? Number(parseInt(item.ots)).toLocaleString("ru")
                        : "Нет данных"
                }}
            </template>

            <template #item.last_request_at="{ item }">
                <v-tooltip
                    right
                    :color="surfaceHasHourActivity(item) ? 'green' : 'red'"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon
                            :color="
                                surfaceHasHourActivity(item) ? 'green' : 'red'
                            "
                            dark
                            v-bind="attrs"
                            v-on="on"
                        >
                            info
                        </v-icon>
                    </template>
                    <span
                        >{{
                            surfaceHasHourActivity(item)
                                ? "Есть свободные показы"
                                : "Нет свободных показов"
                        }}
                        {{
                            isAllMighty && item.last_request_at
                                ? `(${item.last_request_at})`
                                : ""
                        }}</span
                    >
                </v-tooltip>
            </template>

            <template #header.actions="{ item }">
                <v-btn
                    color="error"
                    depressed
                    @click="$emit('clear-surfaces')"
                    v-if="addedSurfaces.length === allSurfaces.length"
                >
                    Удалить все
                </v-btn>
                <v-btn color="primary" @click="$emit('select-all')" v-else>
                    Добавить все
                </v-btn>
            </template>

            <template #item.actions="{ item }">
                <v-layout justify-center v-if="!isMaximizeReach">
                    <template v-if="item.available">
                        <v-btn
                            v-if="!checkIfAdded(item.id)"
                            color="primary"
                            block
                            depressed
                            @click="$emit('add-surface', item)"
                            >Добавить</v-btn
                        >

                        <v-btn
                            v-if="checkIfAdded(item.id)"
                            color="error"
                            depressed
                            @click="$emit('remove-surface', item.id)"
                            block
                            >Удалить</v-btn
                        >
                    </template>

                    <v-btn v-else disabled>Недоступно</v-btn>
                </v-layout>
            </template>
        </v-data-table>
    </v-layout>
</template>

<script>
import TableActions from "@/components/TableActions";
import moment from "moment-timezone";
import { mapGetters } from "vuex";

export default {
    name: "SurfaceList",

    components: {
        TableActions,
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
            default: "",
        },
        showOnlySelected: {
            type: Boolean,
            default: false,
        },
        isMaximizeReach: Boolean,
        //isGuaranteed: Boolean,
    },

    data: (vm) => ({
        footerTableProps: vm.$store.getters.getFooterProps.table,

        itemsPerPage: 50,
        page: 1,

        search: "",
    }),

    computed: {
        headers() {
            const headers = [
                { text: "GID", value: "SURFACEID", isSelected: true },
                { text: "ID", value: "id", isSelected: true },
                {
                    text: "Рекламная поверхность",
                    value: "name",
                    isSelected: true,
                },
                { text: "Сторона", value: "side", isSelected: true },
                { text: "Формат", value: "format", isSelected: true },
            ];
            if (!this.isGuaranteed && !this.isGalmed) {
                headers.push({
                    text: "Последний показ",
                    value: "last_request_at",
                    isSelected: true,
                });
            }

            headers.push({
                text: "Оператор",
                value: "NETWORKID",
                isSelected: true,
            });

            headers.push(
                { text: "Тип локации", value: "type", isSelected: true },
                { text: "Город", value: "CITYID", isSelected: true },
                { text: "Адрес", value: "address", isSelected: true },
                {
                    text: "",
                    value: "actions",
                    isSelected: true,
                    sortable: false,
                }
            );
            if (this.isGuaranteed) {
                headers.push({
                    text: "OTS (72 п.час)",
                    value: "ots",
                    isSelected: true,
                });
            }
            return headers;
        },
        currentHeaders() {
            return this.headers.filter((h) => h.isSelected);
        },

        outdoorFormat() {
            return this.$store.getters["types/outdoorFormat"];
        },
        cities() {
            return this.$store.getters["types/getCities"];
        },
        currentSurfaces() {
            const addedSurfaces = this.allSurfaces.filter((surface) =>
                this.addedSurfaces.find(
                    (addedSurface) =>
                        addedSurface.SURFACEID === surface.SURFACEID
                )
            );

            return this.showOnlySelected ? addedSurfaces : this.allSurfaces;
        },
        ...mapGetters({
            isAllMighty: "auth/isAllMighty",
            isGalmed: "auth/getIsGalmed",
            isGuaranteed: "auth/getIsGuaranteedClient",
        }),
    },

    methods: {
        surfaceHasHourActivity(surface) {
            const surfaceLastRequest = moment.tz(
                surface.last_request_at,
                "Europe/Moscow"
            );
            const userTime = moment.tz("Europe/Moscow");
            // console.log(surfaceLastRequest.format());
            // console.log(userTime.format());
            // console.log(moment.duration(surfaceLastRequest.diff(userTime)).asHours());
            if (
                moment.duration(surfaceLastRequest.diff(userTime)).asHours() >
                -1
            ) {
                // console.log("есть свобода");
                return true;
            } else {
                // console.log("нет свободы");
                return false;
            }
        },
        currentOutdorFormat(format) {
            if (!format) return "";
            const find = this.outdoorFormat.find((f) => f.value === format);
            return find ? find.name : "";
        },

        checkIfAdded(id) {
            return (
                this.addedSurfaces.filter((surface) => surface.id == id)
                    .length > 0
            );
        },

        russNetwork(NETWORKID) {
            const network = this.$store.getters["surfaces/getNetworks"].find(
                (s) => s.NETWORKID === NETWORKID
            );
            return network ? network.network_name : NETWORKID;
        },
        russianCityName(CITYID) {
            if (!CITYID) return;
            const city = this.cities.find((c) => c.CITYID === CITYID);
            return city ? city.nameRu : "";
        },
        selectAll() {},
    },

    watch: {
        doorType(newVal) {
            this.headers[5].isSelected = newVal === "indoor";
        },
    },
};
</script>
