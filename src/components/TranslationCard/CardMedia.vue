<template>
    <div>
        <v-carousel
            v-if="haveVideos"
            :show-arrows="realVideosIn(translation.video_id).length !== 1"
            :cycle="false"
            class="elevation-0 mb-1"
            interval="9999"
            height="100%"
            hide-delimiters
        >
            <v-carousel-item
                v-for="(video, i) in realVideosIn(translation.video_id)"
                :key="video.id"
            >
                <v-layout
                    justify-space-between
                    align-baseline
                    class="ml-3 mr-1 mt-0"
                >
                    <div class="grey--text font-italic">
                        {{ currentVideoInfo }}
                    </div>

                    <p class="grey--text text-right mb-1 mr-3">
                        id видео: {{ video.id }}
                    </p>
                </v-layout>

                <v-responsive class="video-placeholder-black">
                    <v-layout justify-center align-center fill-height>
                        <video
                            :src="currentVideoUrl(video.video_filename)"
                            style="height: 300px"
                            class="mt-3"
                            width="97%"
                            controls
                        />
                    </v-layout>
                </v-responsive>
            </v-carousel-item>
        </v-carousel>

        <v-responsive
            v-else
            class="video-placeholder mt-4"
            :aspect-ratio="16 / 9"
        >
            <v-layout justify-center align-center fill-height>
                <div class="primary--text font-weight-light headline">
                    Здесь будет ваше видео
                </div>
            </v-layout>
        </v-responsive>
    </div>
</template>

<script>
export default {
    name: 'CardMedia',

    props: {
        realVideosIn: Function,
        currentDate: Function,
        translation: Object,
    },

    computed: {
        haveVideos() {
            return !!this.translation.video_id.length;
        },

        lastConfirmedDisplay() {
            return this.last_confirmed_display_at;
        },
        currentVideoInfo() {
            const {
                last_confirmed_display_at: lastConfirmedDisplay,
                review_comments: reason,
                status,
            } = this.translation;

            if (lastConfirmedDisplay) {
                return (
                    'Последний показ ' + this.currentDate(lastConfirmedDisplay)
                );
            }
            if (status === 'running') {
                return 'Показов еще не было';
            }
            if (status === 'planned') {
                return 'Кампания еще не запущена';
            }
            if (status === 'review') {
                return 'Кампания ждет модерации';
            }
            if (status === 'declined') {
                return 'Причина: ' + reason;
            }
        },
    },

    methods: {
        currentVideoUrl(filename) {
            return this.$appUrl + '/media/' + filename;
        },
    },
};
</script>

<style>
.video-placeholder-black {
    background-color: #000;
}
.video-placeholder {
    background-color: #f1f1f1;
}
.without-border {
    border: 0;
}
</style>
