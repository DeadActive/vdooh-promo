<template>
    <v-form
        ref="regForm"
        v-model="valid"
        @submit.prevent="register"
        class="justify-center col-10 pb-0"
    >
        <v-card-title class="px-0 py-0">
            <div class="layout column align-center">
                <div
                    style="font-size: 18px; font-weight: 400"
                    class="d-flex justify-center"
                >
                    Регистрация
                </div>
            </div>
        </v-card-title>

        <template v-if="!success">
            <v-card-text class="pb-0 px-0 pt-8">
                <v-row>
                    <v-col class="py-0" cols="12" sm="6">
                        <v-text-field
                            v-model="regName"
                            :rules="[rules.required]"
                            label="Имя"
                            required
                            outlined
                            dense
                        />
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                        <v-text-field
                            v-model="regEmail"
                            :rules="[rules.required, rules.email]"
                            label="Эл.почта"
                            validate-on-blur
                            required
                            outlined
                            dense
                            @blur="trimEmail"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="py-0" cols="12" sm="6">
                        <v-text-field
                            v-model="regCompany"
                            :rules="[rules.required]"
                            label="Компания"
                            required
                            outlined
                            dense
                        />
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6">
                        <v-text-field
                            v-model="regTel"
                            :rules="[rules.required]"
                            v-mask="phone.mask || '+##############'"
                            label="Телефон"
                            ref="phone"
                            required
                            outlined
                            dense
                        />
                    </v-col>
                </v-row>

                <template v-if="isDirectClient">
                    <v-row>
                        <v-col class="py-0" cols="12" sm="6">
                            <v-text-field
                                v-model="regPassword"
                                :append-icon="
                                    show1 ? 'visibility_off' : 'visibility'
                                "
                                :rules="[rules.required, rules.password]"
                                :type="show1 ? 'text' : 'password'"
                                hint="Минимум 7 символов. Обязательно наличие больших и маленьких букв латиницей, цифр."
                                label="Пароль"
                                required
                                counter
                                @click:append="show1 = !show1"
                                outlined
                                dense
                            />
                        </v-col>
                        <v-col class="py-0" cols="12" sm="6">
                            <v-text-field
                                v-model="regRepeatPassword"
                                :append-icon="
                                    show2 ? 'visibility_off' : 'visibility'
                                "
                                :rules="[rules.required, rules.passwordMatch]"
                                :type="show2 ? 'text' : 'password'"
                                label="Подтвердите пароль"
                                required
                                counter
                                @click:append="show2 = !show2"
                                outlined
                                dense
                            />
                        </v-col>
                    </v-row>
                </template>
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
                            Соглашаюсь на условия публичной оферты об оказании
                            услуг
                        </div>
                    </template>
                </v-checkbox>

                <v-layout justify-space-between>
                    <span>
                        <a
                            href="https://vdooh.com/policy"
                            target="_blank"
                            class="grey--text text--darken-1"
                            >Политика Конфиденциальности</a
                        >
                    </span>

                    <span class="text-right">
                        <a
                            href="https://vdooh.com/terms"
                            target="_blank"
                            class="grey--text text--darken-1"
                            >Публичная оферта</a
                        >
                    </span>
                </v-layout>
            </v-layout>

            <v-card-actions class="pt-4 pb-0">
                <!-- <vue-recaptcha
          ref="recaptcha"
          size="invisible"
          :sitekey="sitekey"
          @verify="register"
          @expired="onCaptchaExpired"
        /> -->
                <v-layout justify-center>
                    <v-btn
                        :loading="loading"
                        class="text-center text-nouppercase"
                        block
                        color="primary"
                        type="submit"
                        :disabled="!valid"
                        @click="register"
                    >
                        {{ isDirectClient ? "Регистрация" : "Подать заявку" }}
                    </v-btn>
                </v-layout>
            </v-card-actions>
        </template>

        <template v-else>
            <v-layout justify-center align-center fill-height wrap pb-2>
                <v-flex xs12>
                    <v-alert
                        v-if="success"
                        transition="slide-y-transition"
                        type="success"
                        class="ma-3"
                        outlined
                        ><span v-html="success"></span
                    ></v-alert>
                </v-flex>

                <v-btn
                    class="text-center"
                    color="primary"
                    type="submit"
                    @click="success = ''"
                    >Ок</v-btn
                >
            </v-layout>
        </template>

        <v-alert
            class="ma-3 mb-2"
            v-if="error"
            outlined
            transition="slide-y-transition"
            type="error"
            >{{ error }}</v-alert
        >
    </v-form>
</template>

<script>
import parsePhoneNumber from "libphonenumber-js";
import VueRecaptcha from "vue-recaptcha";
import { mask } from "vue-the-mask";
import { getHrefPolitics } from "@/plugins/themes";
import { getSupportEmail } from "@/plugins/themes";

const roles = [
    //{ value: 'agency',        text: 'Рекламное агентство' },
    { value: "directClient", text: "Прямой клиент" },
];

const universalMask = (countryCode) => `+${countryCode} (###) ###-##-##`;
const russianPhoneData = () => ({
    mask: universalMask("7"),
    locale: "RU",
    code: "+7",
});

export default {
    name: "RegisterTab",

    components: { VueRecaptcha },

    directives: { mask },

    data: (vm) => ({
        // sitekey: '6Ldg_rEUAAAAALdas5RMcvtD0Cr-nVJIwkVYzrMU',
        supportEmail: getSupportEmail(location.hostname),
        phone: russianPhoneData(),
        roles,
        hrefPolitics: getHrefPolitics(location.hostname),
        success: "",
        error: "",

        loading: false,
        valid: false,
        show1: false,
        show2: false,

        regRepeatPassword: "",
        regRole: "directClient",
        regPassword: "",
        regCompany: "",
        regEmail: "",
        regName: "",
        regTel: "",
        regSite: "",

        rules: {
            passwordMatch: (v) =>
                v === vm.regPassword || "Пароли должны совпадать",
            required: (v) => !!v || "Обязательно к заполнению",
            password: (v) => {
                if (v.length < 8)
                    return "Минимум 7 символов. Обязательно наличие больших и маленьких букв латиницей, цифр.";

                const russianLetters = /[а-я]/;
                if (v.toLowerCase().match(russianLetters))
                    return "Пароль должен быть записан латиницей";

                const aNumber = /[0-9]/;
                if (!v.match(aNumber)) return "Необходимо также наличие цифр";

                const anUpperCase = /[A-Z]/;
                if (!v.match(anUpperCase))
                    return "Необходимо наличие маленьких и больших букв";

                const aLowerCase = /[a-z]/;
                if (!v.match(aLowerCase))
                    return "Необходимо наличие маленьких и больших букв";
                return true;
            },
            email: (value) => {
                const pattern =
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value) || "Неправильный e-mail.";
            },
        },
    }),

    computed: {
        isDirectClient() {
            return this.regRole === "directClient";
        },
        isGalmed() {
            return (
                document.location.hostname == "ui.gallerymedia.com" ||
                document.location.hostname == "gallerymedia.vdooh.com"
            );
        },
    },

    methods: {
        removeConfirmation() {
            if (this.password !== "") {
                this.repeatPassword = "";
            }
        },
        trimEmail() {
            console.log(this.regEmail);
            this.regEmail = this.regEmail.trim();
        },

        async register(recaptchaToken) {
            if (!this.$refs.regForm.validate() || this.loading) return;
            this.loading = true;

            const { error, data } = await this.$store.dispatch(
                "auth/register",
                {
                    comments: `Компания: ${this.regCompany}; Сайт: ${this.regSite}; Телефон: ${this.regTel}`,
                    agency_reg: this.regRole === "directClient" ? "0" : "1",
                    password: this.isDirectClient ? this.regPassword : "",
                    live: this.isDirectClient ? "1" : "0",
                    user_name: this.regName,
                    host: this.currentHost,
                    USERID: this.regEmail,
                    meta_data: {
                        phone: this.regTel.replace(/\D+/g, ""),
                        client_name: this.regCompany,
                    },
                    // recaptchaToken,
                }
            );
            this.loading = false;

            if (!error) {
                this.regName =
                    this.regEmail =
                    this.regCompany =
                    this.regSite =
                    this.regTel =
                    this.regPassword =
                    this.regRepeatPassword =
                        "";
                this.regRole = "directClient";

                if (this.isDirectClient) {
                    this.success = `<strong>Спасибо, что зарегистрировались в личном кабинете рекламодателя Gallery. Чтобы настроить учетную запись, подтвердите свой электронный адрес. Если на почту не пришло письмо, проверьте в папке "Спам" или напишите на</strong> <a href="mailto:${this.supportEmail}">${this.supportEmail}</a>`;
                } else {
                    this.success =
                        "Спасибо! Заявка отправлена. Скоро с вами свяжется наш менеджер.";
                }
                // this.onCaptchaExpired()
                this.error = "";
            } else {
                let errorMessage = "Что-то пошло не так, попробуйте позже";
                const { details, reason } = data;

                if (details === "password complexity problem") {
                    errorMessage =
                        "Пароль не соответствует требованиям безопасности. Попробуйте снова \n";
                } else if (details === "USERID should be e-mail") {
                    errorMessage =
                        "Проверьте, что эл.почта введена неверно. \n";
                } else if (details === "USERID can't be used") {
                    errorMessage =
                        "В системе уже есть пользователь с такими данными. \n";
                } else if (reason === "duplicate") {
                    errorMessage =
                        "В системе уже есть пользователь с такими данными. \n";
                }

                this.error = errorMessage;
            }
        },
    },

    watch: {
        regTel(phone) {
            if (!phone) return;

            const lastSymbol = phone.slice(-1);
            let regexp = /[0-9]/;

            if (phone.length === 1) {
                if (lastSymbol === "+") {
                    regexp = /[0-9\\+]/;

                    this.phone = {
                        locale: "",
                        mask: "",
                        code: "",
                    };
                } else if (+lastSymbol === 8) {
                    this.regTel = "+7 (";
                } else {
                    this.phone = russianPhoneData();
                }
            }

            if (!lastSymbol.match(regexp)) {
                this.$nextTick(() => {
                    this.regTel = phone.slice(0, -1);
                });
                return;
            }

            const parsedPhone = parsePhoneNumber(phone, this.phone.locale);
            if (parsedPhone) {
                this.phone = {
                    mask: universalMask(parsedPhone.countryCallingCode),
                    code: `+${parsedPhone.countryCallingCode}`,
                    locale: parsedPhone.country,
                };
            }
        },
    },
};
</script>
