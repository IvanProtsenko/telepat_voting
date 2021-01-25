import Vue from 'vue';
import App from './App.vue';
import store from './store';
import axios from './store/config';
import vuetify from './plugins/vuetify';
import router1 from './routes';

Vue.use(vuetify);

new Vue({
    vuetify,
    router: router1,
    store,
    render: h => h(App)
}).$mount('#app');

