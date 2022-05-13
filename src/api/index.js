import axios from "axios";

const client = axios.create({
    baseURL: process.env.VUE_APP_BASEURL,
});

export default client;
