<template>
    <v-card class="px-4 elevation-0">
        <alert-dialog
            text="Данное действие приведет к удалению всех несохраненных данных"
            title="Вы уверены?"
            ref="alertDialog"
            type="warning"
            @approve="goBack"
        />

        <v-layout class="px-4" justify-center>
            <v-flex xl10 lg12 md12 xs12>
                <v-layout justify-center align-center fill-height>
                    <v-flex grow class="py-3">
                        <v-layout align-center justify-start>
                            <h1
                                v-if="$route.meta.title"
                                class="font-weight-regular"
                            >
                                {{ $route.meta.title.ru }}
                            </h1>

                            <h1
                                class="font-weight-light ml-6"
                                v-if="
                                    isTranslationPage &&
                                    translation.stepper !== 1
                                "
                            >
                                «{{ translation.title }}»
                            </h1>

                            <!-- <v-spacer /> -->
                            <!-- <template v-if="!isReadOnly">
                                <v-btn
                                    v-if="isAction"
                                    :to="$route.meta.header.to"
                                    color="primary"
                                    class="ml-2"
                                    depressed
                                    height="48"
                                    >{{ $route.meta.header.action }}</v-btn
                                >
                            </template>

                            <v-tooltip v-else-if="isAction" bottom>
                                <template #activator="{ on }">
                                    <div v-on="on">
                                        <v-btn
                                            color="primary"
                                            class="ml-2"
                                            depressed
                                            disabled
                                            >{{
                                                $route.meta.header.action
                                            }}</v-btn
                                        >
                                    </div>
                                </template>
                                Эта функция недоступна с правами только на
                                чтение
                            </v-tooltip> -->
                        </v-layout>
                    </v-flex>

                    <!-- <v-flex shrink fill-height>
              <v-btn
                class="ma-0"
                depressed
                @click="$store.dispatch('changeIsRusLang')"
              >
                {{ isRus ? 'ru' : 'en' }}
              </v-btn>
            </v-flex> -->
                </v-layout>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
import AlertDialog from "@/components/AlertDialog";
import { mapGetters } from "vuex";

export default {
    name: "PageHeader",

    components: {
        AlertDialog,
    },

    computed: {
        header() {
            return this.$route.meta.header;
        },
        isBack() {
            return this.header && this.header.isBack;
        },
        isAction() {
            return this.header && this.header.to && this.header.action;
        },
        isTranslationPage() {
            return [
                "translation.edit",
                "translation.edit.allbb",
                "translation.new",
            ].includes(this.$route.name);
        },

        ...mapGetters({
            translation: "translation/getCurrentTranslation",
            isRus: "settings/getIsRusLang",
            isReadOnly: "auth/isReadonly",
        }),
    },

    methods: {
        handleClick() {
            if (this.header.withNotification && !this.isReadOnly) {
                return this.$refs.alertDialog.alert();
            }
            return this.goBack();
        },

        goBack() {
            if (this.isBack && this.header.link) {
                return this.$router.push(this.header.link);
            }
            return this.$router.back();
        },
    },
};
</script>

<style></style>
