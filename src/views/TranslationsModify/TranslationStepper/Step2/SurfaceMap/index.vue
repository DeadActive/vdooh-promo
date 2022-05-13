<template>
    <v-card class="pt-1 mb-4 elevation-0">
        <ImportCSVDialog
            v-model="importCSVDialog"
            :is-guaranteed="isGuaranteed"
            @import="importCSV"
        />

        <templates-dialog
            v-model="templatesDialog"
            :templates="templates"
            @load-template="loadTemplate"
            @delete-template="deleteTemplate"
        />

        <title-dialog v-model="titleDialog" @save="saveTemplate" />

        <v-layout class="pt-3" justify-space-between align-center>
            <v-flex xs12 md8 class="title pb-3">
                <h3>
                    Доступно
                    <span class="primary--text">{{
                        currentSurfaceLength
                    }}</span>
                    {{
                        declOfNum(notAvailableSurfaces.length, [
                            'экран',
                            'экрана',
                            'экранов',
                        ])
                    }}
                    <span v-if="addedSurfaces.length > 0">
                        (выбрано
                        <span class="primary--text">{{
                            addedSurfaces.length
                        }}</span
                        >)
                    </span>
                </h3>
            </v-flex>

            <v-flex xs12 md4 class="text-right">
                <v-layout justify-end>
                    <v-btn
                        depressed
                        color="primary"
                        class="mr-6"
                        @click="templatesDialog = true"
                        text
                        >Импорт из своих шаблонов</v-btn
                    >
                    <v-btn
                        depressed
                        color="success"
                        class="mr-2"
                        @click="importCSVDialog = true"
                        text
                        >Импорт из CSV</v-btn
                    >
                </v-layout>
            </v-flex>
        </v-layout>

        <surface-outdoor
            v-if="!surfacesLoaded"
            :orientation-vertical="currentOrientationVertical"
            :doorType="translation.doorType"
            :addedSurfaces="addedSurfaces"
            :is-guaranteed="isGuaranteed"
            :all-surfaces="surfaces"
            :is-new="isNew"
            :is-maximize-reach.sync="isMaximizeReachComp"
            :maximize-reach.sync="maximizeReachComp"
            @remove-only-added-surfaces="removeOnlyAddedSurfaces"
            @remove-surface="removeSelectedSurface"
            @add-surface="addSurface"
            @select-all="selectAll"
            @clear-surfaces="$emit('clear-surfaces')"
        />

        <v-responsive v-else :aspect-ratio="2 / 1">
            <v-layout justify-center align-center fill-height>
                <v-progress-circular color="primary" size="400" indeterminate>
                    <div class="headline text-center grey--text">
                        Данные загружаются
                    </div>
                </v-progress-circular>
            </v-layout>
        </v-responsive>

        <v-layout column class="px-2 pt-0" v-if="addedSurfacesComp.length > 0">
            <!-- <v-flex class="px-4">
                <h3 class="pb-2 mt-3 ml-0">
                    {{
                        declOfNum(addedSurfacesComp.length, [
                            'Добавлен',
                            'Добавлено',
                            'Добавлено',
                        ])
                    }}
                    {{ addedSurfaces.length }}
                    {{
                        declOfNum(addedSurfaces.length, [
                            'экран',
                            'экрана',
                            'экранов',
                        ])
                    }}
                </h3>
            </v-flex> -->

            <v-layout mb-3 mx-3>
                <v-flex xs12 md8 xl6 class="mt-3">
                    <v-btn
                        v-if="!url"
                        :loading="urlLoading"
                        color="primary"
                        text
                        @click="generateLink"
                    >
                        Поделиться ссылкой <v-icon class="ml-3">share</v-icon>
                    </v-btn>

                    <v-layout v-if="url">
                        <v-text-field
                            v-model="url"
                            hint="Для копирования ссылки нажмите на соответствующую иконку"
                            label="Ссылка на поверхности"
                            class="hint-big ml-2"
                            ref="urlInput"
                            readonly
                            @click="selectUrlInput"
                        >
                            <template slot="append">
                                <v-tooltip top>
                                    <v-btn
                                        slot="activator"
                                        color="primary"
                                        text
                                        icon
                                        class="mb-0"
                                    >
                                        <v-icon
                                            class="cursor--pointer"
                                            @click="copyToClipboard"
                                            >file_copy</v-icon
                                        >
                                    </v-btn>
                                    <span>Скопировать</span>
                                </v-tooltip>
                            </template>
                            <!-- <template slot="append-outer">
                <v-tooltip top>
                  <v-btn slot="activator" color="primary" text icon class="mb-0">
                    <v-icon
                      class="cursor--pointer"
                      @click="generateLink"
                    >autorenew</v-icon>
                  </v-btn>
                  <span>Сгенерировать заново</span>
                </v-tooltip>
              </template> -->
                        </v-text-field>
                    </v-layout>
                </v-flex>

                <v-spacer />
                <v-btn
                    color="primary"
                    class="mt-3"
                    text
                    @click="titleDialog = true"
                    >Сохранить как шаблон</v-btn
                >
                <v-btn color="primary" class="mt-3" text @click="downloadCSV"
                    >Экспорт в CSV</v-btn
                >
                <v-btn color="error" class="mt-3" text @click="clearSurfaces"
                    >Очистить</v-btn
                >
            </v-layout>
        </v-layout>
        <v-layout v-if="isStopped && notAvailableSurfaces.length">
            <toggle-element>
                <template #title>
                    <h3
                        class="pb-2 mt-3 ml-0 body-1 font-weight-bold error--text text--darken-1"
                    >
                        {{
                            declOfNum(notAvailableSurfaces.length, [
                                'Недоступен',
                                'Не доступно',
                                'Не доступно',
                            ])
                        }}
                        {{ notAvailableSurfaces.length }}
                        {{
                            declOfNum(notAvailableSurfaces.length, [
                                'экран',
                                'экрана',
                                'экранов',
                            ])
                        }}
                    </h3>
                </template>

                <template>
                    <v-data-table
                        :headers="notAvailableSurfaceHeaders"
                        :items="notAvailableSurfaces"
                    />
                </template>
            </toggle-element>
        </v-layout>
    </v-card>
</template>

<script>
import ImportCSVDialog from './ImportCSVDialog';
import TitleDialog from '@/components/TitleDialog';
import TemplatesDialog from '@/components/TemplatesDialog';
import SurfaceOutdoor from '@/components/Surfaces/SurfaceOutdoor';
import ToggleElement from '@/components/ToggleElement';

const notAvailableSurfaceHeaders = [
    { text: 'GID', value: 'SURFACEID', isSelected: true },
    { text: 'ID', value: 'id', isSelected: true },
    { text: 'Рекламная поверхность', value: 'name', isSelected: true },
    { text: 'Сторона', value: 'side', isSelected: true },
    { text: 'Формат', value: 'format', isSelected: true },
    { text: 'Тип локации', value: 'type', isSelected: true },
    { text: 'Город', value: 'city_id', isSelected: true },
    { text: 'Адрес', value: 'address', isSelected: true },
];

export default {
    name: 'SurfaceMap',

    components: {
        TitleDialog,
        ToggleElement,
        SurfaceOutdoor,
        TemplatesDialog,
        ImportCSVDialog,
    },

    props: {
        surfaces: {
            type: Array,
            default: () => [],
        },
        addedSurfaces: {
            type: Array,
            default: () => [],
        },
        selectedSurfaces: {
            type: Array,
            default: () => [],
        },
        returnSingleSurfaces: Function,
        notAvailableSurfaces: {
            type: Array,
            default: () => [],
        },
        maximizeReach: [Number, String],
        isMaximizeReach: Boolean,
        surfacesLoaded: Boolean,
        isGuaranteed: Boolean,
        isNew: Boolean,
    },

    data: (vm) => ({
        templatesDialog: false,
        importCSVDialog: false,
        titleDialog: false,
        urlLoading: false,
        titleValid: false,

        notAvailableSurfaceHeaders,

        templateTitle: '',
        url: '',
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

        templates() {
            return this.$store.getters['settings/getSurfaceTemplates'];
        },
        translation() {
            return this.$store.getters['translation/getCurrentTranslation'];
        },

        isStopped() {
            return (
                this.translation.status === 'stop' ||
                this.translation.status === 'stopped'
            );
        },

        addedSurfacesComp: {
            get() {
                return this.addedSurfaces;
            },
            set(addedSurfaces) {
                this.$emit('update:added-surfaces', addedSurfaces);
            },
        },

        currentSurfacesLength() {
            const withSites = this.surfaces.filter((s) => !!s.players),
                withoutSites = this.surfaces.filter(
                    (s) => !s.players && !!s.available
                );
            return (
                withoutSites.length +
                withSites.reduce(
                    (summ, current) => summ + current.players.length,
                    0
                )
            );
        },
        currentAvailableSurfacesLength() {
            const surfaces = this.returnSingleSurfaces(this.surfaces);
            return surfaces.filter((s) => s.available).length;
        },

        currentSurfaceLength() {
            return this.isGuaranteed
                ? this.currentAvailableSurfacesLength
                : this.currentSurfacesLength;
        },

        currentOrientationVertical() {
            return this.translation.orientationVertical;
        },
    },
    methods: {
        async copyToClipboard() {
            await navigator.clipboard.writeText(this.url);
            this.$store.dispatch('notification/set', {
                message: 'Ссылка скопирована в буфер обмена',
                type: 'info',
            });
        },

        async generateLink() {
            this.urlLoading = true;
            const basketId = (
                await this.$store.dispatch('translation/generateLink')
            ).data;
            this.url = `${window.location.origin}/screens/mediaplan-for=${basketId}`;
            this.urlLoading = false;
        },

        selectUrlInput(e) {
            e.target.select();
            this.copyToClipboard();
        },

        importCSV(surfaces) {
            const selected = this.addedSurfaces.slice();
            surfaces.forEach((surface) => {
                if (!selected.find((s) => s.id === surface.id)) {
                    selected.push(surface);
                }
            });

            this.$emit('clear-added-surfaces');
            this.$emit('add-surface', selected);
        },

        convertArrayOfObjectsToCSV({
            surfaces,
            columnDelimiter = ';',
            lineDelimiter = '\n',
        }) {
            if (!surfaces) return;
            const parseData = ['SURFACEID'];

            let result = parseData.join(columnDelimiter);
            result += lineDelimiter;

            surfaces.forEach((item) => {
                const values = parseData.map((key) =>
                    item[key].replace('#', '/0x23/')
                );
                result += values.join(columnDelimiter);
                result += lineDelimiter;
            });

            return result;
        },
        downloadCSV({ filename = 'Выбранные экраны РК.csv' }) {
            let data, link;
            let csv = this.convertArrayOfObjectsToCSV({
                surfaces: this.addedSurfaces,
            });
            try {
                if (csv == null) return;

                if (!csv.match(/^data:text\/csv/i)) {
                    csv = 'data:text/csv;charset=utf-8,' + csv;
                }
                data = encodeURI(csv);

                link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename);
                link.click();
            } catch (e) {
                console.error(e);
            }
        },

        saveTemplate(title) {
            this.$store.dispatch('settings/saveAsSurfaceTemplate', {
                surfaces: this.addedSurfaces.slice(),
                title,
            });
            this.titleDialog = false;
        },
        loadTemplate(id) {
            this.$emit('clear-surfaces');
            const surfaces =
                this.$store.getters['settings/getSurfaceTemplatesById'](
                    id
                ).template;
            const allSurfaces = this.returnSingleSurfaces(this.surfaces);

            const filteredSurfaces = surfaces.filter((surface) => {
                const { NETWORKID, SURFACEID } = surface;
                return allSurfaces.find(
                    (s) =>
                        s.SURFACEID === SURFACEID && s.NETWORKID === NETWORKID
                );
            });
            console.log(filteredSurfaces.length);

            this.$emit('add-surface', filteredSurfaces);
            this.$emit('load-settings');
            this.$emit('load-forecast');
            this.templatesDialog = false;
        },
        deleteTemplate(id) {
            this.$store.dispatch('settings/deleteSurfaceTemplate', id);
        },

        removeSelectedSurface(id) {
            this.$emit('remove-added-surfaces', [{ id }]);
        },

        removeOnlyAddedSurfaces(surfaces) {
            this.$emit('remove-added-surfaces', surfaces);
        },
        clearSurfaces() {
            this.$emit('clear-surfaces');
        },
        addSurface(surface) {
            this.$emit('add-surface', surface);
        },
        selectAll() {
            this.$emit('select-all');
        },

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
    },
    watch: {
        'translation.addedSurfaces'() {
            if (!this.url) return;
            this.generateLink();
        },
    },
};
</script>

<style>
.hint-big .v-messages {
    height: 14px;
}
</style>
