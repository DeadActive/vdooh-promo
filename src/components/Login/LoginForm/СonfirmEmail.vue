<template>
  <v-card class="pa-3">
    <v-layout wrap align-center>
      <v-flex xs12 class="text-center headline mt-2 mb-4">
        Подтвeрждение электронной почты
      </v-flex>

      <v-flex xs12>
        <v-alert
          v-if="type"
          class="ma-3"
          outlined
          transition="slide-y-transition"
          :type="type"
          >{{ message }}</v-alert
        >
      </v-flex>

      <v-btn color="primary" class="ml-3 mt-4" to="/login" depressed
        >Вход</v-btn
      >

      <a
        v-if="type === 'error'"
        class="mt-3 ml-3"
        :href="`mailto:${supportEmail}`"
        >Свяжитесь с нами</a
      >
    </v-layout>
  </v-card>
</template>

<script>
import { getSupportEmail } from "@/plugins/themes";

export default {
  name: "ConfirmEmail",

  data: () => ({
    supportEmail: getSupportEmail(location.hostname),
  }),

  async created() {
    const { error, data } = await this.$store.dispatch("auth/confirmEmail", {
      USERID: this.userId.replace(" ", "+"),
      hash: this.hash,
    });

    if (!error) {
      this.type = "success";
      this.message = "Спасибо! Ваша электронная почта подтверждена.";
    } else {
      const { details } = error;
      this.type = "error";

      if (details === "") {
        return (this.message = "");
      }

      return (this.message =
        "Произошла ошибка при подтверждении вашей эл.почты.");
    }
  },

  data: () => ({
    message: "",
    type: "",
  }),

  computed: {
    userId() {
      return this.$route.query.login;
    },
    hash() {
      return this.$route.query.crc;
    },
  },
};
</script>