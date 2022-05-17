<template>
    <v-card
        @drop.prevent="onDrop"
        @dragenter.prevent="active = true"
        @dragleave.prevent="active = false"
        @dragover.prevent
    >
        <v-layout column class="py-6 file-upload">
            <template v-if="!image">
                <v-layout justify-center>
                    <v-icon size="48">mdi-upload</v-icon>
                </v-layout>
                <p class="px-6" style="font-size: 14px; color: #999999">
                    Рекомендуем загружать изображения не более 1400х1400
                    пикселей и размером не более 512 кб. Поддерживаемые форматы:
                    jpg, png и gif.
                </p>
                <v-btn class="mx-6 mt-2" @click="openDialog">
                    <v-icon left>mdi-paperclip</v-icon>
                    <span>Загрузить</span>
                </v-btn>
            </template>
            <template v-else>
                <span class="px-6">Изображение успешно загружено.</span>
            </template>

            <input
                type="file"
                style="display: none"
                ref="input"
                accept="image/jpeg,image/png,image/gif"
                @change="onInputChange"
            />
            <v-subheader v-if="error.length" class="error--text">
                {{ error }}
            </v-subheader>
        </v-layout>
    </v-card>
</template>

<script>
import { mapState } from "vuex";
import api from "../api/api";

export default {
    data() {
        return {
            file: null,
            image: null,
            error: "",
            active: false,
        };
    },
    computed: {
        ...mapState("auth", ["user"]),
    },
    methods: {
        openDialog() {
            this.$refs.input.click();
        },
        checkFile(file) {
            return true;
        },
        async onDrop(e) {
            const files = [...e.dataTransfer.files];

            this.error = "";
            this.image = null;

            if (!files.length) return;

            try {
                if (this.checkFile(files[0])) this.file = files[0];
                this.image = URL.createObjectURL(this.file);
            } catch (e) {
                this.error = e.message;
            }

            const ext = this.file.name.split(".").pop();
            const name = `${this.user.email}.${ext}`;

            if (this.$route.path === "/game")
                await api.uploadgame(this.file, name);
            else await api.uploadphoto(this.file, name);

            setTimeout(() => {
                if (this.$route.path === "/game")
                    this.$router.push({
                        path: "/login",
                        query: { from: "/game" },
                    });
                else {
                    this.$router.push("/login");
                }
            }, 10000);

            this.active = false;
        },
        async onInputChange(e) {
            const files = [...e.target.files];

            this.error = "";
            this.image = null;

            if (!files.length) return;

            try {
                if (this.checkFile(files[0])) this.file = files[0];
                this.image = URL.createObjectURL(this.file);
            } catch (e) {
                this.error = e.message;
            }

            const ext = this.file.name.split(".").pop();
            const name = `${this.user.email}.${ext}`;

            if (this.$route.path === "/game")
                await api.uploadgame(this.file, name);
            else await api.uploadphoto(this.file, name);

            console.log(this.$route);

            setTimeout(() => {
                if (this.$route.path === "/game")
                    this.$router.push({
                        path: "/login",
                        query: { from: "/game" },
                    });
                else {
                    this.$router.push("/login");
                }
            }, 10000);
        },
    },
};
</script>

<style>
.file-upload {
    max-width: 512px !important;
}

.file-upload .overlay {
    position: relative;
    pointer-events: none;
}

.file-upload .overlay::after {
    position: absolute;
    content: "";
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.1;
    pointer-events: none;
}
</style>
