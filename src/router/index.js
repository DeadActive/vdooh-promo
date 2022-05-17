import Vue from "vue";
import VueRouter from "vue-router";
import addListener from "./listners";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/TranslationsModify"),
        meta: {
            title: { en: "", ru: "Создание рекламной кампании" },
            requiresAuth: true,
            header: {
                link: "/translations/1",
                withNotification: true,
                isBack: true,
            },
        },
    },
    {
        path: "/game",
        name: "game",
        component: () => import("../views/TranslationsModify/game.vue"),
        meta: {
            title: { en: "", ru: "Создание рекламной кампании" },
            requiresAuth: true,
            header: {
                link: "/translations/1",
                withNotification: true,
                isBack: true,
            },
            layout: "default",
        },
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login"),
        meta: {
            layout: "empty",
        },
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default addListener(router);
