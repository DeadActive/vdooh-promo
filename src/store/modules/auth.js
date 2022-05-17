import api from "../../api/api";

export default {
    namespaced: true,
    name: "auth",
    state: {
        signedIn: false,
        username: "Пользователь",
        hasMoney: true,
        isReadonly: false,
        requisitesOk: true,
        user: {},
    },
    getters: {
        signedIn: (state) => state.signedIn,
        username: (state) => state.username,
    },
    mutations: {
        SET_SIGNED_IN: (state, payload) => (state.signedIn = payload),
        SET_USERNAME: (state, payload) => (state.username = payload),
        SET_USER: (state, payload) => (state.user = payload),
    },
    actions: {
        async login({ commit }, payload) {
            console.log("Userdata: ", payload);

            await api.regform(payload);

            commit("SET_SIGNED_IN", true);
            commit("SET_USER", payload);
        },
        setUsername({ commit }, payload) {
            commit("SET_USERNAME", payload);
        },
    },
};
