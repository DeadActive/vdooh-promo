<template>
    <v-app>
        <component :is="layout">
            <router-view :key="$route.params.id"></router-view>
        </component>
        <!-- <the-footer-app /> -->
    </v-app>
</template>

<script>
import TheFooterApp from "./layouts/Default/footer";

export default {
    name: "App",

    components: {
        TheFooterApp,
    },
    computed: {
        layout() {
            let currentLayout = "empty";
            const { meta } = this.$route;

            if (meta && meta.requiresAuth) {
                currentLayout = "default";
            }

            return currentLayout + "-layout";
        },
    },
};
</script>
