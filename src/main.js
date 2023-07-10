import { createApp } from "vue";
import "./style.sass";

// Import the root component 'App.vue'
import App from "./App.vue";

// Create a new Vue app using the 'createApp' function
const app = createApp(App);

// Mount the app to the element with the ID 'app' in the HTML file
app.mount("#app");
