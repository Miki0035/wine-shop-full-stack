import { createApp } from 'vue'
import App from './App.vue'
import './main.css';
import * as VueRouter from 'vue-router';
import ProductsPage from './pages/ProductsPage.vue';
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import ProductDetailPage from './pages/ProductDetailPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyChNiUqawelKRi-KNS932oTnNZwa8PyRnQ",
  authDomain: "vue-full-stack-dc1f2.firebaseapp.com",
  projectId: "vue-full-stack-dc1f2",
  storageBucket: "vue-full-stack-dc1f2.appspot.com",
  messagingSenderId: "559271807902",
  appId: "1:559271807902:web:0a49459bb8f29913d4248f"
};

// Initialize Firebase
initializeApp(firebaseConfig);

createApp(App).
use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/products',
        },
        {
            path: '/products',
            component: ProductsPage,
        },
        {
            path: '/cart',
            component: ShoppingCartPage,

        },
        {
            path: '/products/:productId',
            component: ProductDetailPage,
        },
        {
            path: '/:pathMatch(.*)*',
            component: NotFoundPage,
        }
    ],
}))
.mount('#app')
