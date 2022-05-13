import client from ".";

export default {
    regform(data) {
        return client.post("regform/", data, {
            headers: { "Content-Type": "application/json" },
        });
    },
    uploadphoto(file) {
        const formData = new FormData();
        formData.append("file", file);

        return client.post("uploadphoto/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    uploadgame(file) {
        const formData = new FormData();
        formData.append("file", file);

        return client.post("uploadgame/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
