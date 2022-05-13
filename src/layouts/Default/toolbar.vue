<template>
    <v-app-bar
        :style="toolbarGradient"
        color="primary"
        clipped-left
        dark
        app
        class="elevation-0"
    >
        <!-- <v-dialog v-model="clientChooseDialog" max-width="100%" width="500px">
            <set-client-form
                :clients="clients"
                :agencies="agencies"
                @finished="closeClientForm"
            />
        </v-dialog> -->

        <!-- <v-btn icon text @click.stop="drawer = !drawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn> -->

        <v-toolbar-title class="hidden-sm-and-down ml-5">
            <div :class="logoClass">
                <v-img
                    src="/img/logo/vdooh.svg"
                    class="ml-1 text-left"
                    height="50px"
                    contain
                />
            </div>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
            <!-- <v-btn
                text
                @click="loadClients"
                v-if="!$store.state.auth.theOnlyClient"
            >
                <v-icon>business_center</v-icon>
                &nbsp;
                {{ currentClientName }}
            </v-btn> -->

            <v-menu offset-y>
                <template #activator="{ on }">
                    <v-btn text v-on="on">
                        <v-icon>mdi-account-circle</v-icon>
                        &nbsp;
                        {{ $store.state.auth.username }}
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="logout">
                        <v-icon>mdi-exit-to-app</v-icon>&nbsp;Выйти
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar-items>
    </v-app-bar>
</template>

<script>
import SetClientForm from "@/components/Login/SetClientForm";
import QuestionTooltip from "@/components/QuestionTooltip";
import {
    getLogoClass,
    getTitleLogo,
    getTitle,
    getLogo,
} from "@/plugins/themes";
import { mapGetters } from "vuex";

export default {
    name: "TheToolbarApp",

    props: {
        value: {
            type: Object,
            required: true,
        },
    },

    components: {
        QuestionTooltip,
        SetClientForm,
    },

    data: () => ({
        logoClass: getLogoClass(location.hostname),
        titleLogo: getTitleLogo(location.hostname),
        title: getTitle(location.hostname),
        clientChooseDialog: false,
    }),

    computed: {
        mini: {
            get() {
                return this.value.mini;
            },
            set(mini) {
                this.$emit("input", {
                    mini,
                    drawer: this.drawer,
                    clipped: this.clipped,
                });
            },
        },
        drawer: {
            get() {
                return this.value.drawer;
            },
            set(drawer) {
                this.$emit("input", {
                    drawer,
                    mini: !drawer,
                    clipped: this.clipped,
                });
            },
        },
        clipped: {
            get() {
                return this.value.clipped;
            },
            set(clipped) {
                this.$emit("input", {
                    clipped,
                    mini: this.mini,
                    drawer: this.drawer,
                });
            },
        },

        // ...mapGetters({
        //     storeIsDirectClient: "auth/isDirectClient",
        //     isSuperClient: "auth/isAllMighty",
        //     agencies: "clients/getAgencies",
        //     clients: "clients/getClients",
        //     isReadonly: "auth/isReadonly",
        //     isAllBB: "auth/getIsAllBB",
        //     isGalmed: "auth/getIsGalmed",
        //     inAgency: "auth/inAgency",
        //     isAdmin: "auth/isAdmin",
        // }),

        toolbarGradient() {
            return false;
        },

        projectLogo() {
            return "/img/logo/" + getLogo(location.hostname);
        },

        actionProfile() {
            return (
                (this.isSuperClient && this.inAgency) ||
                (this.isSuperClient && this.storeIsDirectClient) ||
                this.inAgency ||
                this.storeIsDirectClient ||
                this.isGalmed
            );
        },
        isDirectClient() {
            return (
                this.storeIsDirectClient ||
                (this.storeIsDirectClient && this.isSuperClient)
            );
        },
        role() {
            return "Обычный пользователь";
        },
    },

    methods: {
        async loadClients() {
            await this.$store.dispatch("clients/loadClients");
            this.clientChooseDialog = true;
        },
        openTopUpBalance() {
            this.$router.push({
                name: "users.topUpBalance",
            });
        },

        openProfile() {
            this.$router.push({
                name: "company.requisites",
            });
        },
        openProfileSettings() {
            this.$router.push({
                name: "users.settings",
                params: {
                    id: this.$store.getters["auth/userId"],
                },
            });
        },
        logout() {
            if (this.isAllBB) {
                this.$store.dispatch("unsetUserData");
                return window.open(
                    "https://www.all-billboards.ru/logout.php",
                    "_self"
                );
            } else {
                this.$store.dispatch("unsetUserData");
                return this.$router.push({ name: "login" });
            }
        },
        closeClientForm() {
            this.clientChooseDialog = false;
        },
    },
};
</script>

<style></style>
