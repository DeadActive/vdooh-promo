<template>
    <v-layout fill-height>
        <v-img :src="`/img/bg/bg.png`" aspect-ratio="16/9">
            <v-container fill-height>
                <v-layout align-center fill-height>
                    <!-- <v-col
                        md="6"
                        cols="10"
                        class="d-none d-md-flex fill-height"
                    >
                        <h1 class="white--text mt-16 pt-6">
                            <b>Outdoor-реклама для вашего бизнеса</b>
                        </h1>
                    </v-col> -->

                    <v-spacer class="fill-height">
                        <h1
                            class="white--text mt-16 pt-6 d-none d-md-block col-12 col-md-10"
                        >
                            <b>Outdoor-реклама для вашего бизнеса</b>
                        </h1>
                    </v-spacer>

                    <v-flex v-bind="attributes">
                        <h1 class="white--text pb-8 d-block d-md-none">
                            <b>Outdoor-реклама для вашего бизнеса</b>
                        </h1>

                        <component
                            :current-login="allbbLogin"
                            :clients="currentClients"
                            :is="currentComponent"
                            :agencies="agencies"
                            :userdata="userdata"
                            class="mb-5"
                            @needToSetClientAndAgency="needToSetClientAndAgency"
                            @needToSetClient="needToSetClient"
                        />
                    </v-flex>

                    <v-spacer class="d-flex d-md-none"></v-spacer>
                </v-layout>
            </v-container>
        </v-img>
    </v-layout>
</template>

<script>
import LoginForm from "@/components/Login/LoginForm";
import SetClientForm from "@/components/Login/SetClientForm";
import { getImage } from "@/plugins/themes";

export default {
    components: { LoginForm, SetClientForm },

    data() {
        return {
            currentComponent: "LoginForm",
            loadPage: false,
            clients: [],
            agencies: [],
            userdata: {},
        };
    },

    created() {
        if (
            !this.allbbLogin &&
            (document.location.host === "allbb.vdooh.com" ||
                document.location.host === "digital.all-billboards.ru")
        ) {
            return window.open(
                "https://www.all-billboards.ru/route/registration/index",
                "_self"
            );
        }
        this.loadPage = true;

        if (this.isSignedIn) {
            if (this.isInAgency) {
                this.$router.replace({ name: "clients.list" });
            } else {
                this.$router.replace("/translations/1");
            }
        }
    },
    methods: {
        needToSetClient(clients, userdata) {
            this.currentComponent = "SetClientForm";
            this.clients = clients;
            this.userdata = userdata;
        },
        needToSetClientAndAgency(clients, agencies, userdata) {
            this.currentComponent = "SetClientForm";
            this.clients = clients;
            this.agencies = agencies;
            this.userdata = userdata;
        },
    },
    computed: {
        isSignedIn() {
            return this.$store.getters["auth/isSigned"];
        },
        isInAgency() {
            return this.$store.getters["auth/inAgency"];
        },

        projectBackground() {
            return getImage(location.hostname);
        },
        currentClients: function () {
            return this.clients;
        },

        allbbLogin() {
            return (
                this.$route.path === "/agency/login/" ||
                this.$route.path === "/agency/login"
            );
        },

        attributes() {
            if (this.$route.path === "/register") {
                return {
                    xs12: true,
                    sm10: true,
                    md8: true,
                    lg6: true,
                };
            }
            return {
                xs12: true,
                sm8: true,
                md6: true,
                lg5: true,
            };
        },
    },
    name: "Login",
};
</script>

<style scoped lang="css">
#login {
    background: url("../assets/img/bg/bg.png") 100% no-repeat;
    background-size: cover;
}
#login > div {
    height: 100vh;
}
a {
    text-decoration: none;
    font-weight: 500;
}
</style>
