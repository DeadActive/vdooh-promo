<template>
  <v-footer
    :style="`height: ${$vuetify.breakpoint.xs ? 100 : 32}px !important`"
    class="pa-3 text-center body-2"
    v-bind:class="{ 'footer-mobile': $vuetify.breakpoint.xs}"
    color="primary"
    dark
    app
  >
    <v-layout
      align-center
      fill-height
    >
      <div>
        &copy; {{ new Date().getFullYear() }} {{ footerText }}
      </div>
      <div class="ml-6">
        <a :href="hrefPolitics" target="_blank" class="white--text">Политика конфиденциальности</a> | <a class="white--text" :href="`mailto:${supportEmail}`">Поддержка</a>
      </div>
    </v-layout>
  </v-footer>
</template>

<script>
import {
  getHrefPolitics,
  getSupportEmail,
  getFooter
} from '@/plugins/themes';

export default {
  name: 'TheFooterApp',

  data: () => ({
    hrefPolitics: getHrefPolitics(location.hostname),
    supportEmail: getSupportEmail(location.hostname),
    footerText: getFooter(location.hostname),
  }),
};
</script>

<style scoped>
.footer-mobile {
  position: relative !important;
  margin-top: 0 !important;
}
</style>>

</style>
