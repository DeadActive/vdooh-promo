<template>
    <v-layout column class="mr-3">
        <template v-if="haveRequisites && hasMoney && !isReadonly">
            <vue-dropzone
                :duplicateCheck="true"
                ref="myVueDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                @vdropzone-removed-file="removeUploadedVideo"
                @vdropzone-sending="beforeSending"
                @vdropzone-success="uploadFile"
                @vdropzone-error="errorUpload"
                upload-video
            />
            <v-btn
                color="primary"
                class="mx-0"
                depressed
                @click="approvedDialog = true"
                height="48"
                >Выбрать из одобренных ранее</v-btn
            >
        </template>

        <div v-else-if="isReadonly" class="error--text">
            Нельзя загружать видео с права только на чтение
        </div>
        <div v-else-if="haveRequisites" class="error--text">
            Для загрузки видео, пожалуйста,
            <a class="error--text" href="/users/top-up-balance"
                >пополните ваш баланс</a
            >
        </div>
        <div v-else class="error--text">
            Для загрузки видео, пожалуйста, заполните
            <a class="error--text" href="/company/requisites"
                >реквизиты вашей компании</a
            >
        </div>

        <v-layout v-if="chosenVideoFromList" column align-center>
            <video-card
                v-for="video in chosenVideoFromList"
                :key="video.id"
                :video="video"
                @delete="removeVideo(video.id)"
            />
        </v-layout>

        <approved-dialog
            v-model="approvedDialog"
            :selected-video="chosenVideoFromList"
            :videos="previousVideos"
            @select-video="selectVideo"
        />
    </v-layout>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

import ApprovedDialog from './ApprovedDialog';
import VideoCard from './VideoCard';

export default {
    name: 'VideoUpload',

    props: {
        previousVideos: Array,
        resolution: String,
        duration: Number,
        videos: Array,
        screens: Array,
    },

    components: {
        vueDropzone: vue2Dropzone,
        ApprovedDialog,
        VideoCard,
    },

    created() {
        this.chosenVideoFromList = this.videos.slice();
    },

    data: (vm) => ({
        chosenVideoFromList: [],
        approvedDialog: false,

        dropzoneOptions: {
            paramName: 'video',
            acceptedFiles: 'video/mp4,image/jpeg',
            url:
                process.env.VUE_APP_APIURL.replace('?cmd=', '') +
                '?cmd=upload_video',

            // maxFiles: 1,
            maxFilesize: 50,
            thumbnailWidth: 100,
            thumbnailHeight: 50,

            timeout: 90000,

            addRemoveLinks: true,
            withCredentials: true,
            createImageThumbnails: false,

            headers: { 'Cache-Control': null, 'X-Requested-With': null },

            dictRemoveFile: 'Удалить',
            dictCancelUpload: 'Отменить загрузку',
            dictInvalidFileType: 'Нужно загрузить файл в формате mp4',

            dictDefaultMessage:
                "<i class='material-icons grey--text darken-2'>cloud_upload</i><br/><span style='position:relative;top:-6px;'> Кликните или просто перетащите в это поле видеофайл MP4 или изображение JPEG</span>",
            dictResponseError:
                'Возникла проблема на сервере. Свяжитесь с нами или попробуйте позже',
            dictMaxFilesExceeded:
                'Можно загрузить только один файл. Удалите лишний',
            dictFileTooBig:
                'Размер файла больше 50 мегабайт, мы не сможем его использовать',

            accept: vm.imageDimensionsCheck,
        },
    }),

    computed: {
        haveRequisites() {
            return this.$store.getters['auth/getRequisitesOk'];
        },
        hasMoney() {
            return this.$store.getters['auth/getHasMoney'];
        },
        isReadonly() {
            return this.$store.getters['auth/isReadonly'];
        },
    },

    methods: {
        beforeSending(file, xhr, formData) {
            formData.append('dimensions', this.resolution);
            formData.append('secs', this.duration);
            formData.append('surfaces', JSON.stringify(this.screens));
        },
        imageDimensionsCheck(file, done) {
            const extension = file.name.split('.').pop();
            if (extension.toLowerCase() === 'mp4') {
                return done();
            }

            const reader = new FileReader();

            reader.onload = (entry) => {
                const [width, height] = this.resolution
                    .toLowerCase()
                    .split('x');
                const image = new Image();

                image.src = entry.target.result;
                image.onload = function () {
                    if (this.width != width || this.height != height) {
                        return done(
                            JSON.stringify({
                                details: `file: ${this.width}x${this.height}`,
                                error: 'dimensions mismatch',
                                status: 'error',
                            })
                        );
                    }
                    return done();
                };
            };

            reader.readAsDataURL(file);
        },

        addVideo(video) {
            this.chosenVideoFromList.push(video);
            this.$emit('add-video', Object.assign({}, video));
            this.$refs.myVueDropzone.removeAllFiles();
        },

        selectVideo(videos) {
            videos.forEach((video) => {
                if (
                    !this.chosenVideoFromList.find((v) => +v.id === +video.id)
                ) {
                    this.addVideo(video);
                }
            });
            this.approvedDialog = false;
        },
        uploadFile(file, response) {
            const videoResponse = JSON.parse(response);

            const video = {};
            video.src =
                process.env.VUE_APP_APPURL +
                '/media/' +
                videoResponse.media_filename;
            video.media_params = videoResponse.media_params;
            video.id = videoResponse.video_id;
            video.filename = file.name;
            // video.src = window.URL.createObjectURL(file);

            this.addVideo(video);
        },

        errorUpload(file, response, xhr) {
            let message = 'На сервере произошла ошибка. Повторите позже';
            if (response) {
                const { details, status, error, error_details } =
                    JSON.parse(response);
                if (!status === 'error') return;
                console.log('errorUpload');

                const result = error.match(/le_/) || [];
                if (result[0]) {
                    message = 'Не заполнены необходимые реквизиты';
                }
                if (error === 'no surface selected matching the media_params') {
                    message = `Ролик не соответствует техническим требованиям для выбранных экранов: ${error_details}`;
                }
                if (error === 'dimensions mismatch') {
                    const [_, expectedResolution] = details.split('file: ');
                    message = `Неверное разрешение файла. Необходимо: ${this.resolution.toLowerCase()}, загружено: ${expectedResolution}`;
                }
            }

            this.$store.dispatch('notification/set', {
                type: 'error',
                message,
            });
            this.$refs.myVueDropzone.removeAllFiles();
        },

        removeVideo(id) {
            this.$emit('removeVideo', id);
            this.chosenVideoFromList = this.chosenVideoFromList.filter(
                (video) => video.id !== id
            );
        },
        removeUploadedVideo() {
            this.$refs.myVueDropzone.removeAllFiles();
            if (this.uploadedVideoFile) {
                this.$emit('removeVideo', this.uploadedVideoFile.videoID);
                this.uploadedVideoFile = null;
            }
        },
    },
};
</script>

<style>
#dropzone {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border: none;
    background-color: #eeeeee;
}

.dropzone[upload-video] .dz-preview {
    display: block;
    min-height: 70px;
}
.vue-dropzone[upload-video] .dz-preview .dz-image img:not([src]) {
    width: auto;
    height: 70px;
}
.vue-dropzone[upload-video] .dz-max-files-reached {
    pointer-events: none;
    cursor: default;
}

.vue-dropzone[upload-video] .dz-preview {
    pointer-events: all !important;
}

.vue-dropzone[upload-video]:hover {
    border: 2px solid #00b782;
    transition: all 0.5s;
}

.vue-dropzone[upload-video] .dz-preview .dz-details {
    padding: 0.9em 1em;
}

.vue-dropzone[upload-video] .dz-preview .dz-remove {
    right: 15px;
}

/* .videoList {
  justify-content: right;
} */
</style>
