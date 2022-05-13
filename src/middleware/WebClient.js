import axios from "axios";
import { store } from "@/store";
import router from "@/router";

class WebClient {
    constructor(baseURL) {
        this.axios = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        this.setInterceptors();
    }

    setInterceptors() {
        this.axios.interceptors.response.use(null, (error) => {
            if (
                (error.response &&
                    error.response.config &&
                    error.response.status === 401) ||
                error.response.status === 403 ||
                error.response.data.error === "CLIENTID_required"
            ) {
                store.dispatch("unsetUserData");

                if (router.history.current.name === "screens") {
                    return router.push({ name: "screens" });
                }

                return router.push({ name: "login" });
            }

            if (
                error.response &&
                error.response.data.api &&
                (error.response.status === 400 || error.response.status === 500)
            ) {
                const { details } = error.response.data.api;
                const result = details.match(/le_/) || [];

                if (details === "agency admin requested to proceed (000)") {
                    window.open(window.origin + "/translations/1", "_self");
                    store.dispatch("unsetUserData", false);
                }

                if (result[0]) {
                    store.dispatch("notification/set", {
                        message: "Не заполнены необходимые реквизиты",
                        type: "error",
                    });
                } else {
                    let message = "Произошла ошибка при выполнении запроса";
                    switch (details) {
                        case "session update error":
                            message =
                                "Ошибка при выборе клиента. Скорее всего, вы его уже выбрали";
                            break;

                        case "password complexity problem":
                            message =
                                "Пароль не соответствует требованиям безопасности. Попробуйте снова";
                            break;

                        case "CLIENTID problem: (empty array)":
                            message =
                                "Необходимо прикрепить хотя бы одного клиента";
                            break;

                        case "CLIENTID_not_allowed":
                            message =
                                "Возникла ошибка при выборе клиента. Возможно, вы не привязали его к своему пользователю";
                            break;
                    }

                    store.dispatch("notification/set", {
                        type: "error",
                        message,
                    });
                }
            }
            return Promise.reject(error.response.data);
        });
    }

    get(url, params, config) {
        return this.axios.get("", {
            params: {
                cmd: url,
                ...params,
            },
            ...config,
        });
    }
    post(url, data, params) {
        return this.axios.post("", data, {
            params: {
                cmd: url,
                ...params,
            },
        });
    }

    request(config) {
        return axios.request(config);
    }
}

const API_URL = "#";
const webclient = new WebClient(API_URL);

export default webclient;
