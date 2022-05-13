<template>
  <v-form ref="resetPasswordForm" v-model="valid" lazy-validation>
    <v-card class="pa-3" v-if="hash && userId">
      <v-card-title class="px-0 headline">Сброс пароля</v-card-title>

      <v-text-field
        v-model="password"
        :append-icon="show1 ? 'visibility_off' : 'visibility'"
        :rules="[rules.required, rules.min]"
        :type="show1 ? 'text' : 'password'"
        hint="Минимум 7 символов. Обязательно наличие больших и маленьких букв латиницей, цифр."
        label="Новый пароль"
        required
        counter
        @click:append="show1 = !show1"
        @keyup="removeConfirmation"
      />

      <v-text-field
        v-model="repeatPassword"
        :rules="[rules.required, rules.min, rules.passwordMatch]"
        :append-icon="show2 ? 'visibility_off' : 'visibility'"
        :type="show2 ? 'text' : 'password'"
        label="Подтвердите пароль"
        hint="Минимум 7 символов. Обязательно наличие больших и маленьких букв латиницей, цифр."
        required
        counter
        @click:append="show2 = !show2"
        @keyup.enter="resetPassword"
      />

      <v-card-actions>
        <v-btn
          :disabled="!password || !repeatPassword"
          color="primary"
          depressed
          @click="resetPassword"
        >Сбросить пароль</v-btn>
      </v-card-actions>

      <v-alert
        v-if="success"
        transition="slide-y-transition"
        type="success"
        class="ma-2"
        outlined
      >{{ success }}</v-alert>
      <v-alert
        v-if="error"
        transition="slide-y-transition"
        type="error"
        outlined
        dark
      >{{ error }}</v-alert>
      <a v-if="error" :href="`mailto:${supportEmail}`">Свяжитесь с нами</a>
    </v-card>
  </v-form>
</template>

<script>
import { getSupportEmail } from "@/plugins/themes";
export default {
  name: "ConfirmEmail",

  data: vm => ({
    supportEmail: getSupportEmail(location.hostname),
    message: "",
    password: "",
    repeatPassword: "",

    loading: false,
    valid: false,
    show1: false,
    show2: false,

    success: "",
    error: "",

    rules: {
      min: v => v.length >= 7 || "Минимум 7 символов. Обязательно наличие больших и маленьких букв латиницей, цифр.",
      passwordMatch: v => v == vm.password || "Пароли должны совпадать",
      required: value => !!value || "Обязательно к заполнению.",
    }
  }),

  computed: {
    userId() {
      return this.$route.query.login;
    },
    hash() {
      return this.$route.query.crc;
    },
  },

  methods: {
    removeConfirmation() {
      if (this.password !== "") {
        this.repeatPassword = "";
      }
    },
    async resetPassword() {
      if (this.$refs.resetPasswordForm.validate()) {
        const { error } = await this.$store.dispatch('auth/resetPassword', {
          USERID: this.userId.replace(' ', '+'),
          password: this.password,
          hash: this.hash,
        });
        if (!error) {
          this.success = "Пароль изменен. Теперь вы можете войти с новым паролем";
          setTimeout(() => {
            this.$router.replace({ path: '/login' });
          }, 5000);
        }
        else this.error = "Произошла ошибка";
      }
    },
  },
};
</script>
