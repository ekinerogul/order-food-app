import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import axios from "axios";

axios.defaults.baseURL =
  "https://order-food-backend-443821973119.europe-west3.run.app";

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount("#app");
