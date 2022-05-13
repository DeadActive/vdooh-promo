<template>
    <v-layout column class="px-4 pt-0 pb-1 mb-3">
        <v-dialog v-model="dialog" max-width="800">
            <v-layout align-end column class="v-sheet theme--light pt-2">
                <v-flex style="margin-bottom: -65px; z-index: 10" shrink>
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-flex>
                <technical-requirements />
            </v-layout>
        </v-dialog>

        <h3 class="title mt-4 mb-3" v-if="!secondVideoNeeded">Фото</h3>
        <div v-if="isNew || replaceVideos">
            <v-container
                calss="container--fluid"
                grid-list-lg
                pl-1
                pr-0
                pb-3
                pt-0
            >
                <v-layout justify-center class="py-4">
                    <upload></upload>
                </v-layout>
            </v-container>
        </div>

        <div v-else>
            <h3>{{ currentTitle }}</h3>
            <v-container
                calss="container--fluid"
                grid-list-lg
                class="px-0 my-0"
            >
                <v-layout style="overflow-x: auto">
                    <v-flex
                        v-for="video in translation.previewVideos"
                        :key="video.id"
                        shrink
                    >
                        <video-card :video="video" without-delete />
                    </v-flex>
                </v-layout>

                <v-btn
                    v-if="mayUploadAgain && !isReadonly"
                    class="ml-0"
                    color="primary"
                    depressed
                    @click="uploadVideosAgain()"
                    >Сменить видео</v-btn
                >
            </v-container>
        </div>
    </v-layout>
</template>

<script>
import TechnicalRequirements from "@/views/TechnicalRequirements";
import TechnicalRequirementsMaer from "@/views/TechnicalRequirementsMaer";
import TechnicalRequirementsGalmed from "@/views/TechnicalRequirementsGalmed";
import VideoCard from "@/components/VideoUpload/VideoCard";
import VideoUpload from "@/components/VideoUpload";
import Upload from "@/components/Upload.vue";

export default {
    name: "ModifyStep2",

    components: {
        TechnicalRequirements,
        TechnicalRequirementsMaer,
        TechnicalRequirementsGalmed,
        VideoUpload,
        VideoCard,
        Upload,
    },

    props: {
        translationIs: Function,
        isGuaranteed: Boolean,
        addedSurfaces: Array,
        isNew: Boolean,
    },

    created() {
        if (!this.replaceVideos) {
            this.replaceVideos = !this.translation.videoID.length;
        }
        this.loadVideos();
    },

    data: () => ({
        videosWithoutResolution: [],
        dialog: false,
    }),

    computed: {
        isMaer() {
            return this.$store.getters["auth/getIsMaer"];
        },
        isGalmed() {
            return this.$store.getters["auth/getIsGalmed"];
        },
        replaceVideos: {
            get() {
                return this.translation.replaceVideos;
            },
            set(replaceVideos) {
                this.$store.dispatch("translation/changeTranslation", {
                    replaceVideos,
                });
            },
        },

        videoList() {
            return this.$store.getters["videos/getVideos"];
        },

        currentTitle() {
            if (!this.translation.previewVideos) return "";
            const { length } = this.translation.previewVideos;
            if (!length) return "Загруженных видео нет";
            return length > 1 ? "Загруженные креативы" : "Загруженный креатив";
        },

        translation() {
            return this.$store.getters["translation/getCurrentTranslation"];
        },
        mayUploadAgain() {
            return this.translationIs([
                "planned",
                "declined",
                "running",
                "stop",
                "stopped",
                "finished",
            ]);
        },

        secondVideoNeeded() {
            const networks = this.addedSurfaces.map(
                (surface) => surface.media_params_strict
            );
            return [...new Set(networks)].length;
        },
        neededVideoInResolutionVariations() {
            const variations = this.addedSurfaces.map(
                (surface) => surface.resolution
            );
            return [...new Set(variations.filter((v) => !!v))];
        },

        notMayEdit() {
            return this.isReadonly;
        },
        isReadonly() {
            return this.$store.getters["auth/isReadonly"];
        },
    },

    methods: {
        currentVideoSource(filename) {
            return this.$appUrl + "/media/" + filename;
        },

        loadVideos() {
            this.$store.dispatch("videos/getVideos", { status: true });
        },

        getSecondsForSurfaceWith(resolution) {
            const foundSurface = this.addedSurfaces.find(
                (surface) => surface.resolution === resolution
            );
            if (foundSurface) {
                return foundSurface.neededDuration;
            }
        },
        getFormatForSurfaceWith(resolution) {
            const foundSurface = this.addedSurfaces.find(
                (surface) => surface.resolution === resolution
            );
            if (foundSurface) {
                return foundSurface.format;
            }
        },
        getVideosByResolution(resolution) {
            return (
                this.translation.previewVideos.filter(
                    (p) => p.resolution === resolution
                ) || []
            );
        },
        addSelectedVideo(video, resolution) {
            this.$store.dispatch(
                "translation/addVideoIDToTranslation",
                video.id
            );
            this.$store.dispatch("translation/addVideoToPreview", {
                ...video,
                resolution,
            });
        },
        removeSelectedVideo(videoID, withoutResolution) {
            if (withoutResolution) {
                this.videosWithoutResolution =
                    this.videosWithoutResolution.filter(
                        (v) => v.id !== videoID
                    );
            }
            this.$store.dispatch("translation/changeTranslation", {
                previewVideos: this.translation.previewVideos.filter(
                    (video) => video.id !== videoID
                ),
            });
            this.$store.dispatch("translation/changeTranslation", {
                videoID: this.translation.videoID.filter(
                    (video) => Number(video) !== Number(videoID)
                ),
            });
        },

        videoWithCurrentResolution(video) {
            if (!video || !video.media_params) return;
            const resolution = video.media_params.split(",")[1];
            return this.neededVideoInResolutionVariations.includes(resolution);
        },
        uploadVideosAgain() {
            this.$emit("change-video");
            this.videosWithoutResolution =
                this.translation.previewVideos.filter(
                    (v) => !this.videoWithCurrentResolution(v)
                );
            const videos = this.translation.previewVideos.filter(
                this.videoWithCurrentResolution
            );

            this.$store.dispatch("translation/changeTranslation", {
                previewVideos: [],
            });
            this.$store.dispatch("translation/changeTranslation", {
                videos: [],
            });
            this.replaceVideos = true;

            if (!this.neededVideoInResolutionVariations.length) return;

            videos.forEach((video) => {
                const resolution = video.media_params.split(",")[1];
                video.filename = video.video_filename;
                this.$store.dispatch("translation/addVideoToPreview", {
                    resolution,
                    ...video,
                });
            });
        },
    },
};
</script>
