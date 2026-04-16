const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    allowedHosts: "all",
    client: {
      webSocketURL: "ws://localhost:8080/ws",
    },
  },
});
