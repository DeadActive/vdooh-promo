import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Empty from "./layouts/Empty.vue";
import Default from "./layouts/Default";

Vue.component("default-layout", Default);
Vue.component("empty-layout", Empty);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
