import store from "../store";

export default function (router, title) {
    router.beforeEach((to, from, next) => {
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            if (!store.state.auth.signedIn) {
                router.push({ name: "login" });
            } else {
                if (
                    to.matched.some((record) => record.meta.adminOnly) &&
                    !store.state.auth.isAdmin
                ) {
                    router.push({ name: "error.404" });
                } else {
                    // this route requires auth, check if logged in
                    // if not, redirect to login page.
                    checkMetaTags();
                    //store.dispatch("auth/loadClientBalance");
                }
            }
        } else {
            checkMetaTags();
        }

        function checkMetaTags() {
            next();
        }
    });

    return router;
}
