<template>
    <v-layout v-resize="reloadMap" column>
        <v-divider />
        <map-sort-bar
            v-if="withSortBar"
            v-model="mapSelectionMode"
            :selected-many-surfaces="selectedManySurfaces"
            :show-only-selected="showOnlySelected"
            @clear-selection="clearSelection"
        />

        <v-layout>
            <v-responsive :aspect-ratio="2 / 1">
                <div class="relative">
                    <v-slide-x-transition>
                        <surface-card
                            ref="surfaceCard"
                            v-show="markerInfoWindow"
                            :selected-many-surfaces="selectedManySurfaces"
                            :show-only-selected="showOnlySelected"
                            :is-maximize-reach="isMaximizeReach"
                            :selected-surface="selectedSurface"
                            :added-surfaces="addedSurfaces"
                            :map-mode="mapSelectionMode"
                            :with-sort-bar="withSortBar"
                            :all-surfaces="allSurfaces"
                            :is-editing="isEditing"
                            :door-type="doorType"
                            @remove-only-added-surfaces="
                                $emit('remove-only-added-surfaces', $event)
                            "
                            @add-many-surfaces="addManySurfaces"
                            @remove-surface="removeSurface"
                            @start-editing="startEditing"
                            @end-editing="endEditing"
                            @add-surface="addSurface"
                            @select-all="selectAll"
                            @close="close"
                            @clear-selection="clearSelection"
                        />
                    </v-slide-x-transition>
                </div>

                <yandex-map
                    :controls="['zoomControl']"
                    :coords="getLocation"
                    style="width: 100%; max-width: 100%; height: 100%"
                    zoom="10"
                    @map-was-initialized="mapInit"
                />
            </v-responsive>
        </v-layout>
    </v-layout>
</template>

<script>
import { yandexMap, ymapMarker } from "vue-yandex-maps";
import MapSortBar from "./MapSortBar";
import SurfaceCard from "./SurfaceCard";
import { mapGetters } from "vuex";

const jsts = require("@/components/jsts.min.js");

export default {
    name: "SurfacesMap",
    components: {
        SurfaceCard,
        MapSortBar,
        ymapMarker,
        yandexMap,
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
        showOnlySelected: {
            type: Boolean,
            default: false,
        },
        doorType: {
            type: String,
            default: "",
        },
        withSortBar: {
            type: Boolean,
            default: false,
        },
        isMaximizeReach: Boolean,
    },
    created() {
        this.setMarkerOptionsBasedOn(this.doorType);
    },
    updated() {
        this.setMarkerOptionsBasedOn(this.doorType);
    },
    computed: {
        ...mapGetters("settings", ["getLocation"]),
    },
    data: (vm) => ({
        searchTimeout: null,

        map: null,
        yMap: null,
        geoObjects: null,
        reZoomButton: null,
        objectManager: null,
        objectsInsideCircle: null,

        circleStateMonitor: null,
        polygonStateMonitor: null,

        isEditing: false,
        mapLoaded: false,
        addedSurface: false,
        markerInfoWindow: false,

        mapSelectionMode: "single",

        selectedSurface: {},
        selectedGeoObject: {},
        availableSurfaces: {
            features: [],
        },
        selectedManySurfaces: [],
        coords: [55.753806, 37.621783],

        myCircle: {},
        myPolygon: {},
        multiRoute: {},
        myHiddenPolygon: {},

        notAvailableColor: "#8f8f8f",
        availableColor: "#4C1DBB",
        selectedColor: "#c05c5c",
        addedColor: "#4caf50",

        defaultLayout: {
            layout: "default#image",
            imageSize: [30, 40],
            contentOffset: [0, 0],
        },

        optionsUnAvailable: {
            ...vm.defaultLayout,
        },
        optionsAvailable: {
            ...vm.defaultLayout,
        },
        optionsSelected: {
            ...vm.defaultLayout,
        },
        optionsAdded: {
            ...vm.defaultLayout,
        },
    }),
    methods: {
        markerImageFor(format) {
            switch (format) {
                case "6x3":
                    return "/img/billboard_marker_dbb.png";
                    break;

                case "15x5":
                    return "/img/billboard_marker_dss.png";
                    break;

                case "3.7x2.7":
                    return "/img/billboard_marker_dsb.png";
                    break;

                default:
                    return "/img/billboard_marker_dbb.png";
                    break;
            }
        },
        reloadMap() {
            if (this.mapLoaded && this.withSortBar) {
                this.map.container.fitToViewport();
            }
        },

        getAvailableSurfaces() {
            let currentSurfaces = this.allSurfaces;
            if (this.showOnlySelected) {
                const filteredSurfacesWithoutPlayers = this.allSurfaces.filter(
                    (surface) => {
                        const { SURFACEID, NETWORKID } = surface;
                        return !!this.addedSurfaces.find(
                            (item) =>
                                item.SURFACEID === SURFACEID &&
                                item.NETWORKID === NETWORKID
                        );
                    }
                );
                let filteredSurfacesWithPlayers = this.allSurfaces.filter(
                    (surface) => surface.players
                );

                filteredSurfacesWithPlayers =
                    filteredSurfacesWithPlayers.filter((surface) => {
                        let foundPlayers = surface.players.filter((player) => {
                            const { SURFACEID, NETWORKID } = player;
                            return !!this.addedSurfaces.find(
                                (addedSurface) =>
                                    addedSurface.SURFACEID === SURFACEID &&
                                    addedSurface.NETWORKID === NETWORKID
                            );
                        });
                        return !!foundPlayers.length;
                    });
                currentSurfaces = [
                    ...filteredSurfacesWithoutPlayers,
                    ...filteredSurfacesWithPlayers,
                ];
            }

            const surfaces = currentSurfaces.map((surface) => {
                let addedSurface = !!this.addedSurfaces.find(
                    (s) =>
                        s.SURFACEID === surface.SURFACEID &&
                        s.NETWORKID === surface.NETWORKID
                );
                const isMulti = !!surface.players;

                if (isMulti) {
                    addedSurface = surface.players.some((player) =>
                        this.addedSurfaces.find(
                            (s) =>
                                s.SURFACEID === player.SURFACEID &&
                                s.NETWORKID === player.NETWORKID
                        )
                    );
                }

                return {
                    type: "Feature",
                    id: surface.id,
                    options: {
                        id: surface.id,
                        iconLayout: "default#image",
                        iconColor: addedSurface
                            ? this.addedColor
                            : surface.available
                            ? this.availableColor
                            : this.notAvailableColor,
                        iconImageHref: addedSurface
                            ? this.optionsAdded.imageHref
                            : surface.available
                            ? this.markerImageFor(surface.format)
                            : this.optionsUnAvailable.imageHref,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: surface.coords,
                    },
                    properties: {
                        available: surface.available,
                        network: surface.NETWORKID,
                        added: addedSurface,
                        selected: false,
                        id: surface.id,
                        format: surface.format,
                        isMulti: isMulti,
                        players: isMulti
                            ? surface.players.map((p) => p.id)
                            : [],
                    },
                };
            });
            this.availableSurfaces = {
                type: "FeatureCollection",
                features: surfaces,
            };

            this.reloadMarkers(true);
        },

        mapInit(map) {
            this.mapLoaded = true;
            this.yMap = ymaps;
            this.map = map;

            this.map.behaviors.disable("scrollZoom");
            this.map.options.set("suppressMapOpenBlock", true);

            this.objectManager = new ymaps.ObjectManager({
                clusterize: true,
                geoObjectHasBalloon: false,
                hideIconOnBalloonOpen: false,
                clusterIconLayout: "default#pieChart",
            });

            this.objectManager.clusters.options.set({
                // preset: 'islands#invertedNightClusterIcons',
            });

            if (this.availableSurfaces.features.length) {
                this.objectManager.add(this.availableSurfaces);
                this.setSingleSelection();
            }

            this.map.geoObjects.add(this.objectManager);
            this.map.events.add("boundschange", this.onMapUpdate);

            this.getAvailableSurfaces();

            this.reZoomButton = new ymaps.control.Button({
                data: {
                    image: window.location.origin + "/img/centered-map.png",
                    title: "Автомасштабирование карты",
                    imageSize: [],
                },
                options: {
                    selectOnClick: false,
                },
            });
            this.reZoomButton.events.add("click", () => {
                this.reloadMarkers(true);
            });

            map.controls.add(this.reZoomButton, { float: "left" });
        },

        onMapUpdate(e) {
            this.objectManager.options.set({
                clusterize: e.get("newZoom") < 12,
            });
        },
        refreshClusters() {
            // if (this.map.getZoom() >= 12) return;
            // this.map.setZoom(this.map.getZoom() + 1);
            // this.map.setZoom(this.map.getZoom() - 1);
        },

        onSingleClick(e) {
            if (this.mapSelectionMode !== "single") return;

            const id = e.get("objectId"),
                geoObject = this.objectManager.objects.getById(id);
            const { properties } = this.selectedGeoObject;

            if (properties) {
                this.objectManager.objects.setObjectOptions(properties.id, {
                    iconImageHref: properties.added
                        ? this.optionsAdded.imageHref
                        : properties.available
                        ? this.markerImageFor(this.selectedSurface.format)
                        : this.optionsUnAvailable.imageHref,
                    iconColor: properties.added
                        ? this.addedColor
                        : properties.available
                        ? this.availableColor
                        : this.notAvailableColor,
                });
            }

            if (geoObject.properties.id !== this.selectedSurface.id) {
                geoObject.properties.selected = true;
                this.objectManager.objects.setObjectOptions(id, {
                    iconImageHref: this.optionsSelected.imageHref,
                    iconColor: this.selectedColor,
                });

                this.$nextTick(() => {
                    this.selectedSurface = Object.assign(
                        {},
                        this.getSurfaceData(geoObject.properties.id)
                    );
                });
                this.selectedGeoObject = geoObject;
                this.markerInfoWindow = true;
            } else {
                this.markerInfoWindow = false;
                this.selectedGeoObject = {};
                this.selectedSurface = {};
            }
            this.refreshClusters();
        },
        onMultipleClick(e) {
            if (!this.withSortBar) return;
            const id = e.get("objectId"),
                geoObject = this.objectManager.objects.getById(id);

            if (!geoObject.properties.selected) {
                geoObject.properties.selected = true;
                this.objectManager.objects.setObjectOptions(id, {
                    iconImageHref: this.optionsSelected.imageHref,
                    iconColor: this.selectedColor,
                });

                if (geoObject.properties.available) {
                    this.selectedManySurfaces.push(
                        this.getSurfaceData(geoObject.properties.id)
                    );
                }
            } else {
                geoObject.properties.selected = false;
                console.log(geoObject);

                this.objectManager.objects.setObjectOptions(
                    geoObject.properties.id,
                    {
                        iconImageHref: geoObject.properties.added
                            ? this.optionsAdded.imageHref
                            : geoObject.properties.available
                            ? this.markerImageFor(geoObject.properties.format)
                            : this.optionsUnAvailable.imageHref,
                        iconColor: geoObject.properties.added
                            ? this.addedColor
                            : geoObject.properties.available
                            ? this.availableColor
                            : this.notAvailableColor,
                    }
                );

                this.selectedManySurfaces = this.selectedManySurfaces.filter(
                    (surface) =>
                        surface.id !== geoObject.properties.id &&
                        surface.available
                );
            }
            this.markerInfoWindow = true;
            this.refreshClusters();
        },

        setSingleSelection() {
            if (!this.objectManager) return;
            this.objectManager.objects.events.add("click", this.onSingleClick);
            this.objectManager.objects.events.remove(
                "click",
                this.onMultipleClick
            );
        },
        setMultiSelection() {
            if (!this.objectManager) return;
            this.objectManager.objects.events.add(
                "click",
                this.onMultipleClick
            );
            this.objectManager.objects.events.remove(
                "click",
                this.onSingleClick
            );
        },
        setAllSelection() {
            this.markerInfoWindow = true;

            this.selectAll();
            this.setMultiSelection();
        },

        createPolygon() {
            this.isEditing = true;

            this.myPolygon = new ymaps.Polygon(
                [],
                {},
                {
                    editorDrawingCursor: "crosshair",
                    fillColor: "#0000FF80",
                    strokeColor: "#0000FF",
                    strokeOpacity: 0.8,
                    draggable: true,
                    strokeWidth: 5,
                }
            );

            this.map.geoObjects.add(this.myPolygon);

            this.polygonStateMonitor = new ymaps.Monitor(
                this.myPolygon.editor.state
            );

            this.polygonStateMonitor.add("drawing", (newValue) => {
                this.myPolygon.options.set(
                    "strokeColor",
                    newValue ? "#FF0000" : "#0000FF"
                );

                if (this.myPolygon.geometry.getLength())
                    this.selectManyInside(this.myPolygon);
            });

            this.myPolygon.editor.events.add(
                ["vertexdragend", "vertexadd"],
                () => {
                    this.selectManyInside(this.myPolygon);
                }
            );

            this.myPolygon.events.add("drag", () => {
                this.selectManyInside(this.myPolygon);
            });

            this.myPolygon.editor.startDrawing();
        },
        createCircle() {
            this.isEditing = true;

            this.myCircle = new ymaps.Circle(
                [this.map.getCenter(), 10000],
                {},
                {
                    fillColor: "#0000FF80",
                    strokeOpacity: 0.8,
                    strokeColor: "#0000FF",
                    draggable: true,
                    strokeWidth: 5,
                }
            );

            this.map.geoObjects.add(this.myCircle);

            this.myCircle.events.add(["editorstatechange", "drag"], () => {
                this.selectManyInside(this.myCircle);
            });

            this.myCircle.editor.startEditing();
            this.markerInfoWindow = true;
        },

        startEditing() {
            this.isEditing = true;
            if (this.mapSelectionMode === "circle") {
                this.myCircle.editor.startEditing();
            } else if (this.mapSelectionMode === "polygon") {
                this.myPolygon.editor.startDrawing();
            }
        },
        endEditing() {
            this.isEditing = false;
            if (this.mapSelectionMode === "circle") {
                this.myCircle.editor.stopEditing();
            } else if (this.mapSelectionMode === "polygon") {
                this.myPolygon.editor.stopDrawing();
            }
        },

        createRoute() {
            let numberOfWayPoints = 0;
            this.multiRoute = new ymaps.multiRouter.MultiRoute(
                { referencePoints: [] },
                {
                    editorMidPointsType: "via",
                    editorDrawOver: false,
                }
            );
            this.map.geoObjects.add(this.multiRoute);

            this.multiRoute.editor.start({
                addWayPoints: true,
                removeWayPoints: true,
            });

            this.multiRoute.events.add(["update"], () => {
                if (
                    numberOfWayPoints !==
                    this.multiRoute.getWayPoints().getLength()
                ) {
                    if (this.multiRoute.getWayPoints().getLength() >= 2) {
                        this.multiRoute.editor.stop();
                        this.multiRoute.editor.start({
                            addWayPoints: false,
                            removeWayPoints: true,
                        });
                    } else {
                        this.multiRoute.editor.stop();
                        this.multiRoute.editor.start({
                            addWayPoints: true,
                            removeWayPoints: true,
                        });
                    }
                }
                numberOfWayPoints = this.multiRoute.getWayPoints().getLength();
            });

            this.multiRoute.events.add(
                "activeroutechange",
                this.selectInActiveRoute
            );
            this.multiRoute.model.events.add(
                "requestsuccess",
                this.selectInActiveRoute
            );
        },
        selectInActiveRoute() {
            if (this.multiRoute.getRoutes().getLength() > 0) {
                this.prepareHiddenPolygonAndSelectFrom(
                    this.multiRoute.getActiveRoute()
                );
            } else {
                if (this.myHiddenPolygon) {
                    this.map.geoObjects.remove(this.myHiddenPolygon);
                    this.objectManager.objects.options.set(
                        "iconImageHref",
                        this.optionsAvailable.imageHref
                    );
                    this.objectManager.objects.options.set(
                        "iconColor",
                        this.availableColor
                    );

                    this.markerInfoWindow = false;
                    this.refreshClusters();
                }
            }
        },

        createHiddenPolygonWith(coords) {
            const distance = 0.08 / 111.12, // Примерно 80 метров
                geoInput = {
                    type: "LineString",
                    coordinates: coords,
                };

            const geoReader = new jsts.io.GeoJSONReader();
            const geoWriter = new jsts.io.GeoJSONWriter();

            const geometry = geoReader.read(geoInput).buffer(distance);
            const jstsPolygon = geoWriter.write(geometry);

            const hiddenPolygon = new ymaps.GeoObject(
                {
                    geometry: jstsPolygon,
                    properties: {},
                },
                {
                    visible: false,
                }
            );
            return hiddenPolygon;
        },
        prepareHiddenPolygonAndSelectFrom(route) {
            const coords = route
                .getPaths()
                .get(0)
                .properties.getAll().coordinates;

            if (this.myHiddenPolygon) {
                this.map.geoObjects.remove(this.myHiddenPolygon);
            }
            this.myHiddenPolygon = this.createHiddenPolygonWith(coords);
            this.map.geoObjects.add(this.myHiddenPolygon);
            this.selectManyInside(this.myHiddenPolygon);
        },

        selectManyInside(mapObject, mode) {
            clearTimeout(this.searchTimeout);

            this.searchTimeout = setTimeout(() => {
                const geoObjects = ymaps.geoQuery(this.availableSurfaces),
                    objectsInsideCircle = geoObjects.searchInside(mapObject);

                this.clearSelection();

                this.selectedManySurfaces = objectsInsideCircle._objects
                    .map((object) => {
                        const id = object.properties._data.id;

                        this.objectManager.objects.setObjectOptions(id, {
                            iconImageHref: this.optionsSelected.imageHref,
                            iconColor: this.selectedColor,
                        });
                        object.properties._data.selected = true;

                        return this.getSurfaceData(id);
                    })
                    .filter((s) => s.available);

                this.markerInfoWindow = true;
                clearTimeout(this.searchTimeout);
                this.refreshClusters();
            }, 100);
        },
        selectAll() {
            const addedIds = this.addedSurfaces.map((s) => s.id);
            this.selectedManySurfaces = this.allSurfaces.filter(
                (s) => s.available
            );

            this.objectManager.objects.each(
                (obj) => (obj.properties.selected = true)
            );
            this.objectManager.objects.options.set(
                "iconImageHref",
                this.optionsSelected.imageHref
            );
            this.objectManager.objects.options.set(
                "iconColor",
                this.availableColor
            );
            this.refreshClusters();
        },
        clearSelection() {
            (this.selectedSurface = {}),
                (this.selectedGeoObject = {}),
                (this.selectedManySurfaces = []);

            this.objectManager.objects.options.set(
                "iconImageHref",
                this.optionsAvailable.imageHref
            );
            this.objectManager.objects.each((obj) => {
                if (obj.properties.selected) {
                    this.objectManager.objects.setObjectOptions(
                        obj.properties.id,
                        {
                            iconImageHref: obj.properties.added
                                ? this.optionsAdded.imageHref
                                : obj.properties.available
                                ? this.markerImageFor(obj.properties.format)
                                : this.optionsUnAvailable.imageHref,
                            iconColor: obj.properties.added
                                ? this.addedColor
                                : obj.properties.available
                                ? this.availableColor
                                : this.notAvailableColor,
                        }
                    );
                }
                obj.properties.selected = false;
            });
            this.refreshClusters();
        },

        removeSurface(e) {
            this.$emit("remove-surface", e.id);

            if (e.site_id) {
                const site = this.allSurfaces.find((s) => s.id === e.site_id);
                this.selectedGeoObject.properties.added = site.players.some(
                    (player) =>
                        this.addedSurfaces.find(
                            (s) => s.id === player.id && player.id !== e.id
                        )
                );
            } else {
                this.selectedGeoObject.properties.added = false;
            }

            this.objectManager.objects.setObjectOptions(
                this.selectedGeoObject.properties.id,
                {
                    iconImageHref: this.optionsSelected.imageHref,
                    iconColor: this.selectedColor,
                }
            );
            this.refreshClusters();
        },
        deleteUnselect(now, last) {
            let deleted = {};

            last.map((s) => s.id).forEach((id) => {
                if (!now.map((s) => s.id).includes(id))
                    deleted = last.find((s) => s.id === id);
            });
            if (!deleted) return;

            deleted.properties.added = false;
            this.objectManager.objects.setObjectOptions(deleted.properties.id, {
                iconImageHref: deleted.properties.available
                    ? this.markerImageFor(deleted.properties.format)
                    : this.optionsUnAvailable.imageHref,
                iconColor: deleted.properties.available
                    ? this.availableColor
                    : this.notAvailableColor,
            });

            if (this.showOnlySelected) {
                this.$emit("refresh-show-only-selected");
            }
            this.refreshClusters();
        },

        addSurface(e) {
            const id = e.site_id || e.id;

            const geoObject = this.objectManager.objects.getById(id);
            this.markerInfoWindow = false;
            this.addedSurface = true;

            this.$emit("add-surface", e);

            geoObject.properties.added = true;
            this.objectManager.objects.setObjectOptions(
                geoObject.properties.id,
                {
                    iconImageHref: this.optionsAdded.imageHref,
                    iconColor: this.addedColor,
                }
            );
            this.refreshClusters();

            this.selectedSurface = {};
            this.selectedGeoObject = {};
        },
        addManySurfaces() {
            this.markerInfoWindow = false;
            this.selectedGeoObject = {};
            this.selectedSurface = {};

            this.objectManager.objects.each((obj) => {
                if (this.selectedManySurfaces.find((s) => s.id === obj.id)) {
                    obj.properties.added = true;
                    this.objectManager.objects.setObjectOptions(obj.id, {
                        iconImageHref: this.optionsAdded.imageHref,
                        iconColor: this.addedColor,
                    });
                }
            });
            this.refreshClusters();

            this.$emit("add-surface", this.selectedManySurfaces);
            this.selectedManySurfaces = [];
        },

        getSurfaceData(id) {
            return this.allSurfaces.find((surface) => surface.id === id);
        },

        setMarkerOptionsBasedOn(value) {
            if (value === "outdoor") {
                this.optionsUnAvailable.imageHref =
                    "/img/billboard_marker_unavailable.png";
                this.optionsAvailable.imageHref =
                    "/img/billboard_marker_dbb.png";
                this.optionsSelected.imageHref =
                    "/img/billboard_marker_selected.png";
                this.optionsAdded.imageHref = "/img/billboard_marker_added.png";
            }
            if (value === "indoor") {
                // if (this.orientationVertical === "1") {
                // this.optionsAvailable.imageHref = "/img/indoor_marker.png";
                // this.optionsSelected.imageHref = "/img/indoor_marker_selected.png";
                // this.optionsAdded.imageHref = "/img/indoor_marker_added.png";
                // } else {
                this.optionsUnAvailable.imageHref =
                    "/img/indoor_horizontal_marker.png";
                this.optionsAvailable.imageHref =
                    "/img/indoor_horizontal_marker.png";
                this.optionsSelected.imageHref =
                    "/img/indoor_horizontal_marker_selected.png";
                this.optionsAdded.imageHref =
                    "/img/indoor_horizontal_marker_added.png";
                // }
            }
        },
        reloadMarkers(withBounds = false) {
            if (this.objectManager) {
                this.objectManager.removeAll();
            }

            setTimeout(() => {
                if (!this.objectManager) return;
                this.objectManager.add(this.availableSurfaces);
                this.setSingleSelection();

                if (withBounds) {
                    if (
                        this.map &&
                        !this.addedSurface &&
                        this.objectManager.getBounds()
                    ) {
                        this.map.setBounds(this.objectManager.getBounds());
                    }
                }
            }, 0);
        },

        close() {
            this.markerInfoWindow = false;
            const { properties } = this.selectedGeoObject;
            properties.selected = false;

            this.objectManager.objects.setObjectOptions(properties.id, {
                iconImageHref: properties.added
                    ? this.optionsAdded.imageHref
                    : properties.available
                    ? this.markerImageFor(this.selectedSurface.format)
                    : this.optionsUnAvailable.imageHref,
                iconColor: properties.added
                    ? this.addedColor
                    : properties.available
                    ? this.availableColor
                    : this.notAvailableColor,
            });
            this.refreshClusters();
        },
    },
    watch: {
        doorType(value) {
            this.setMarkerOptionsBasedOn(value);
            this.markerInfoWindow = false;
            this.mapSelectionMode = "single";
        },

        addedSurfaces(newVal, oldVal) {
            if (!this.addedSurface || !oldVal) {
                if (!(oldVal.length - newVal.length)) return;
                this.getAvailableSurfaces();
            }
            this.addedSurface = false;
        },

        selectedManySurfaces(newVal) {
            if (!newVal.length && this.mapSelectionMode === "all") {
                this.mapSelectionMode = "single";
            }
        },
        availableSurfaces(newVal, oldVal) {
            const now = newVal.features.filter((s) => s.properties.added);
            const last = oldVal.features.filter((s) => s.properties.added);

            if (
                this.map &&
                !this.addedSurface &&
                this.objectManager.getBounds()
            ) {
                this.map.setBounds(this.objectManager.getBounds());
                this.reloadMarkers();
            }

            if (now.length || last.length) {
                if (!~(now.length - last.length)) {
                    this.deleteUnselect(now, last);
                } else if (!this.addedSurface) {
                    this.reloadMarkers();
                    if (this.objectManager && this.objectManager.getBounds()) {
                        this.map.setBounds(this.objectManager.getBounds());
                    }
                    this.markerInfoWindow = false;
                    this.selectedSurface = {};
                    this.selectedGeoObject = {};
                }
            }

            this.mapSelectionMode = "single";
            this.addedSurface = false;
        },

        allSurfaces() {
            this.getAvailableSurfaces();
        },
        showOnlySelected() {
            this.getAvailableSurfaces();
        },

        mapSelectionMode(value, oldValue) {
            this.markerInfoWindow = false;

            this.selectedManySurfaces = [];
            const { properties } = this.selectedGeoObject;
            if (properties) {
                properties.selected = false;
                this.objectManager.objects.setObjectOptions(properties.id, {
                    iconImageHref: properties.added
                        ? this.optionsAdded.imageHref
                        : properties.available
                        ? this.markerImageFor(properties.format)
                        : this.optionsUnAvailable.imageHref,
                    iconColor: properties.added
                        ? this.addedColor
                        : properties.available
                        ? this.availableColor
                        : this.notAvailableColor,
                });
                this.selectedGeoObject = {};
            }

            this.clearSelection();

            switch (oldValue) {
                case "polygon":
                    this.myPolygon.editor.stopDrawing();

                    this.myPolygon.events.remove("drag");
                    this.myPolygon.editor.events.remove("vertexadd");
                    this.myPolygon.editor.events.remove("vertexdragend");

                    this.polygonStateMonitor.removeAll();
                    this.map.geoObjects.remove(this.myPolygon);
                    break;

                case "circle":
                    this.myCircle.editor.stopEditing();
                    this.myCircle.events.remove("drag");
                    this.map.geoObjects.remove(this.myCircle);
                    break;

                case "route":
                    this.map.geoObjects.remove(this.multiRoute);
                    this.map.geoObjects.remove(this.myHiddenPolygon);
                    break;

                case "single":
                    this.objectManager.objects.events.remove(
                        "click",
                        this.onSingleClick
                    );
                    break;

                case "all":
                case "multiple":
                    this.objectManager.objects.events.remove(
                        "click",
                        this.onMultipleClick
                    );
                    break;
            }

            switch (value) {
                case "single":
                    return this.setSingleSelection();

                case "all":
                    return this.setAllSelection();

                case "multiple":
                    this.markerInfoWindow = true;
                    return this.setMultiSelection();

                case "polygon":
                    return this.createPolygon();

                case "circle":
                    return this.createCircle();

                case "route":
                    return this.createRoute();

                default:
                    break;
            }
        },
    },
};
</script>

<style scoped>
.relative {
    position: relative;
    width: 100%;
}
.relative > div {
    position: absolute;
    width: 100%;
}
</style>
