import Vue from 'vue';
import VueRouter from 'vue-router';
const Main = () => import('./components/Main');

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: Main}
    ]
});
