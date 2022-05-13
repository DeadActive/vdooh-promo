import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import ru from "vuetify/es5/locale/ru";

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#4C1DBB",
                secondary: "#18FFC5",
                accent: "#FF0172",
                warning: "#FF7E00",
                success: "#219653",
                error: "#EB5757",
            },
        },
    },
    lang: {
        locales: { ru },
        current: "ru",
    },
});
