<template>
    <v-card class="round pt-8 pb-10" :class="{ 'pb-0': error }">
        <password-recovery v-if="isResetPassword" />
        <confirm-email v-else-if="isConfirmEmail" />

        <v-row justify="center" align="center" v-else>
            <v-col cols="10">
                <login-tab
                    v-if="tabs === 0"
                    :forgot-password="forgotPassword"
                    @needToSetClientAndAgency="needToSetClientAndAgency"
                    @needToSetClient="needToSetClient"
                    @set-error="error = $event"
                />
            </v-col>

            <!-- <register-tab v-if="tabs === 1" /> -->
        </v-row>

        <v-alert
            v-if="error"
            transition="slide-y-transition"
            type="error"
            class="mt-8"
            v-timeoutable="{ value: 'error', timeout: 6000 }"
            >{{ error }}</v-alert
        >
    </v-card>
</template>

<script>
import PasswordRecovery from "./PasswordRecovery";
import ConfirmEmail from "./СonfirmEmail";
import RegisterTab from "./register";
import LoginTab from "./login";
import { getWithoutRegistration } from "@/plugins/themes";

export default {
    name: "LoginForm",

    components: {
        PasswordRecovery,
        ConfirmEmail,
        RegisterTab,
        LoginTab,
    },

    props: {
        currentLogin: Boolean,
    },

    created() {
        this.setCurrentComponent();
    },

    data: (vm) => ({
        error: "",
        tabs: 0,

        forgotPassword: false,
    }),

    computed: {
        currentHost() {
            return process.env.NODE_ENV === "production"
                ? "desk.vdooh.com"
                : "testdesk.vdooh.com";
        },

        withoutRegistration() {
            return getWithoutRegistration(location.hostname);
        },

        isConfirmEmail() {
            return this.$route.meta.type === "confirm";
        },
        isResetPassword() {
            return this.$route.meta.type === "reset";
        },
    },

    methods: {
        setCurrentComponent() {
            if (this.$route.meta.type === "recovery") {
                this.forgotPassword = true;
                return;
            }
            this.resetForm();
            this.tabs = Number(this.$route.meta.type === "register");
        },
        resetForm() {
            this.username = "";
            this.password = "";
            this.recoveryLogin = "";
            this.success = false;
            this.forgotPassword = false;
        },

        needToSetClientAndAgency() {
            this.$emit("needToSetClientAndAgency", ...arguments);
        },
        needToSetClient() {
            this.$emit("needToSetClient", ...arguments);
        },
    },

    watch: {
        $route() {
            this.setCurrentComponent();
        },
        tabs(newVal) {
            if (this.isConfirmEmail || this.isResetPassword) return;

            if (this.$route.meta.type === "recovery" && !newVal) {
                return this.$router.push({ path: `/recovery-password` });
            }

            if (this.$route.meta.type !== `${newVal ? "register" : "login"}`) {
                if (this.withoutRegistration) {
                    return this.$router.push({ path: "/login" });
                }
                this.$router.push({
                    path: `/${newVal ? "register" : "login"}`,
                });
            }
        },
    },
};
</script>

<style>
img {
    max-width: 100%;
}
</style>
