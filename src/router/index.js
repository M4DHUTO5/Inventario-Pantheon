
import {createRouter, createWebHistory} from 'vue-router';
import OrdersList from '@/components/OrdersList.vue';
import ProductList from '@/components/ProductList.vue';
import CreateOrder from '@/components/CreateOrder.vue';
import Home from '@/view/LandingPage.vue'
const routes = [
    { path: '/products', component: ProductList},
    { path: '/orders', component: OrdersList},
    { path: '/create-order', component: CreateOrder},
    { path: '/', component: Home}
];

const router = createRouter({ history: createWebHistory(), routes, });

export default router;