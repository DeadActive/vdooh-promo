<template>
    <v-card class="elevation-0">
        <v-form
            v-if="!forgotPassword"
            v-model="valid"
            key="loginForm"
            class="login"
            ref="form"
            lazy-validation
            @submit.prevent="login"
        >
            <v-card-title class="px-0 py-0">
                <div class="layout column align-center pt-8">
                    <div
                        style="font-size: 24px; font-weight: 400"
                        class="d-flex justify-center"
                    >
                        Вход в панель партнера
                    </div>
                </div>
            </v-card-title>

            <v-card-text class="pb-0 px-0 pt-8">
                <input type="password" style="opacity: 0; position: absolute" />

                <v-text-field
                    v-model.trim="name"
                    :class="{ 'input-group--dirty': dirtyEmail }"
                    :rules="[rules.required]"
                    label="Имя"
                    name="login"
                    type="text"
                    ref="login"
                    dense
                    outlined
                />
                <v-text-field
                    v-model.trim="username"
                    :class="{ 'input-group--dirty': dirtyEmail }"
                    :rules="[rules.required, rules.email]"
                    label="Email"
                    name="login"
                    type="text"
                    ref="login"
                    dense
                    outlined
                />

                <v-text-field
                    v-model="phone"
                    v-mask="'+##############'"
                    label="Телефон"
                    ref="phone"
                    required
                    outlined
                    dense
                />
                <v-text-field
                    v-model.trim="company"
                    :class="{ 'input-group--dirty': dirtyEmail }"
                    label="Компания"
                    name="login"
                    type="text"
                    ref="login"
                    dense
                    outlined
                />
                <!-- <v-text-field
                    v-model.trim="password"
                    :class="{ 'input-group--dirty': dirtyPwd }"
                    :rules="[rules.required]"
                    name="password"
                    type="password"
                    ref="password"
                    label="Пароль"
                    id="password"
                    outlined
                    dense
                /> -->
            </v-card-text>

            <v-layout column class="px-3 pb-3">
                <v-checkbox
                    :rules="[rules.required]"
                    label=""
                    class="pb-0 mb-0 top"
                >
                    <template #label>
                        <div style="font-size: 12px">
                            Нажимая кнопку «Подать заявку», я даю свое согласие
                            на обработку моих персональных данных, в
                            соответствии с Федеральным законом от 27.07.2006
                            года №152-ФЗ «О персональных данных».
                        </div>
                    </template>
                </v-checkbox>
                <v-checkbox
                    :rules="[rules.required]"
                    class="pb-0 mb-0 mt-0"
                    style="font-size: 12px"
                >
                    <template #label>
                        <div style="font-size: 12px">
                            Согласен на использование своего изображения на
                            экране РИФ.
                        </div>
                    </template>
                </v-checkbox>
            </v-layout>

            <v-card-actions class="px-0">
                <v-layout justify-space-between align-baseline wrap>
                    <v-btn
                        :loading="loading"
                        block
                        color="primary"
                        class="px-5 text-nouppercase"
                        type="submit"
                        :disabled="!valid"
                        height="48"
                        >Войти</v-btn
                    >

                    <!-- <v-layout row class="mt-8 mx-0" justify-space-between>
                        <router-link to="/register" class="primary--text"
                            ><b>Регистрация</b></router-link
                        >
                        <router-link to="/recovery-password" class="error--text"
                            ><b>Не помню пароль</b></router-link
                        >
                    </v-layout> -->
                </v-layout>
            </v-card-actions>
        </v-form>

        <!-- <v-form
            v-else
            v-model="validRecovery"
            key="recoveryPasswordForm"
            @submit.prevent="recovery"
        >
            <v-card-title>
                <div class="layout column align-center">
                    <div
                        style="font-size: 18px; font-weight: 400"
                        class="d-flex justify-center"
                    >
                        Восстановление пароля
                    </div>
                </div>
            </v-card-title>

            <v-card-text class="pb-0 px-4 pt-4">
                <v-text-field
                    v-if="!success"
                    v-model="recoveryLogin"
                    label="Ваш логин в системе"
                    name="recoveryLogin"
                    type="text"
                    outlined
                    dense
                />
                <v-alert
                    v-if="success"
                    transition="slide-y-transition"
                    class="mx-3 mb-2 mt-0"
                    outlined
                    type="success"
                    >{{ success }}</v-alert
                >
            </v-card-text>

            <v-card-actions class="pb-3 px-4">
                <v-layout justify-space-between align-baseline>
                    <v-btn
                        v-if="!success"
                        :disabled="!recoveryLogin"
                        :loading="loading"
                        style="width: 250px"
                        color="primary"
                        type="submit"
                        class="px-5"
                        >Восстановить пароль</v-btn
                    >
                    <v-btn
                        text
                        color="primary"
                        @click="$router.push({ path: '/login' })"
                        >Назад</v-btn
                    >
                </v-layout>
            </v-card-actions>
        </v-form> -->
    </v-card>
</template>

<script>
import { getLogo, getAppTitle } from "@/plugins/themes";
import { mask } from "vue-the-mask";

export default {
    name: "LoginTab",
    directives: { mask },
    props: {
        forgotPassword: { type: Boolean },
    },

    mounted() {
        if (this.$refs.login) {
            this.$nextTick(() => {
                this.$refs.login.focus();
                //this.$refs.form.validate();
            });
        }
    },

    data: () => ({
        appTitle: getAppTitle(location.hostname),

        dirtyEmail: null,
        dirtyPwd: null,

        validRecovery: false,
        loading: false,
        valid: false,

        recoveryLogin: "",
        username: "",
        password: "",
        name: "",
        phone: "",
        company: "",

        success: "",
        rules: {
            required: (v) => !!v || "Обязательно к заполнению.",
            email: (value) => {
                const pattern =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value) || "Некорректный e-mail.";
            },
        },
    }),

    computed: {
        projectLogo() {
            return "/img/logo/" + getLogo(location.hostname);
        },
    },

    methods: {
        async login() {
            this.loading = true;

            try {
                await this.$store.dispatch("auth/login", {
                    email: this.username,
                    fio: this.name,
                    phone: this.phone,
                    company: this.company,
                });

                this.$router.push("/");
            } catch (e) {
                this.$emit("set-error", e.text);
            } finally {
                this.loading = false;
            }

            // if (!error) {
            //     const user_data = {
            //         user_name: data.user_name,
            //         USERID: data.USERID,
            //         n_id: data.n_id,
            //     };

            //     if (Array.isArray(data.CLIENTID)) {
            //         if (data.agencies.length > 0) {
            //             this.$emit(
            //                 "needToSetClientAndAgency",
            //                 data.CLIENTID,
            //                 data.agencies,
            //                 user_data
            //             );
            //         } else {
            //             this.$emit("needToSetClient", data.CLIENTID, user_data);
            //         }
            //     } else if (data.CLIENTID !== "") {
            //         this.$store.dispatch("auth/loginAsDirectClient", {
            //             userData: user_data,
            //             CLIENTID: data.CLIENTID,
            //         });

            //         if (data.agencies.length > 0) {
            //             this.$store.dispatch("auth/setInAgency", true);
            //             console.log("clients.list");
            //             this.$router.push({ name: "clients.list" });
            //         } else {
            //             this.$router.push({ name: "translations.all" });
            //         }
            //     }

            //     this.$store.dispatch("menu/refreshMenu", this.$store);
            // } else {
            //     console.log("Access Denied!");
            //     this.loading = false;
            //     if (data === "access_denied")
            //         this.$emit("set-error", "Неправильный логин или пароль");
            //     else if (data === "CLIENTID")
            //         this.$emit(
            //             "set-error",
            //             "Доступ к кабинету в данный момент невозможен. Свяжитесь с тех.поддержкой"
            //         );
            //     else
            //         this.$emit(
            //             "set-error",
            //             "Ошибки сервера. Проверьте свое интернет-соединение, либо свяжитесь с нашей тех. поддержкой"
            //         );
            // }
        },
        async recovery() {
            this.loading = true;
            const { error } = await this.$store.dispatch(
                "auth/requestToResetPassword",
                {
                    USERID: this.recoveryLogin,
                    host: this.$appUrl.replace("https://", ""),
                }
            );

            if (!error) {
                this.loading = false;
                this.$emit("set-error", "");
                this.success =
                    "Проверьте вашу эл.почту и следуйте инструкциями в письме.";
            } else {
                this.loading = false;
                this.errorMessage = "Что-то пошло не так, попробуйте позже";
                this.$emit("set-error", errorMessage);
            }
        },
    },
};
</script>
