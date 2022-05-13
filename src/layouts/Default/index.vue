<template>
    <div>
        <!-- <the-menu-app v-model="options" /> -->
        <the-toolbar-app v-model="options" />

        <v-content>
            <page-header />

            <v-container class="container--fluid" px-12>
                <v-layout justify-center>
                    <v-flex xl10 lg12 md12 xs12>
                        <v-slide-y-transition mode="out-in">
                            <slot />
                        </v-slide-y-transition>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>

        <notification />
    </div>
</template>

<script>
import TheToolbarApp from "./toolbar";
import TheMenuApp from "./menu";

import Notification from "@/components/Notification";
import PageHeader from "@/components/PageHeader";

const options = {
    mini: true,
    drawer: false,
    clipped: true,
};

export default {
    name: "DefaultLayout",
    components: {
        TheToolbarApp,
        TheMenuApp,
        Notification,
        PageHeader,
    },
    data: () => ({
        options,
    }),
};
</script>

<style></style>
