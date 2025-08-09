import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import i18n from './i18n';
import { useSettingsStore } from './stores/settings';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(i18n);

// Initialize persisted settings early
const settings = useSettingsStore(pinia);
settings.initFromStorage();

app.mount('#app');
