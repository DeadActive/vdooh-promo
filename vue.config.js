const { defineConfig } = require("@vue/cli-service");
const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = defineConfig({
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.resolve.alias
            .set("@services", resolve("src/middleware/services"))
            .set("@dal", resolve("src/middleware/DAL"))
            .set("@mdw", resolve("src/middleware"))
            .set("@cmp", resolve("src/components"))
            .set("@mixin", resolve("/src/mixins"));
    },
});
