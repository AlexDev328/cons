import Vue from 'vue'
import Router from 'vue-router'
import Consultation from "@/components/Consultation";
import HelloWorld from "@/components/HelloWorld";
import CreatingApplication from "@/components/CreatingApplication";
import App from "@/App";
import Queue from "@/components/Queue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: HelloWorld
        },
        {
            path: '/consultation',
            name: 'Consultation',
            component: Consultation
        },
        {
            path: '/ask',
            name: 'creating_application',
            component:CreatingApplication,
        },
        {
            path: '/login',
            name: 'login',
            component:App,
        },
        {
            path:'/wait',
            name:'queue',
            component: Queue,
            props: (route) => ({applicationId: route.query.applicationId ,webRtcConnector: route.query.webRtcConnector})
        }
    ]
})