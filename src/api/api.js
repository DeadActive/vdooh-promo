import client from ".";

export default {
    regform(data) {
        return client.post("regform/", data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    uploadphoto(file, name) {
        const formData = new FormData();
        formData.append("file", file, name);

        return client.post("uploadphoto/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    uploadgame(file, name) {
        const formData = new FormData();
        formData.append("file", file, name);

        return client.post("uploadgame/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
