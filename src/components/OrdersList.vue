<template>
    <div class="orders-list-container">
        <h1>Lista de Movimientos de Productos</h1>
        <table>
            <thead>
                <tr>
                    <th>Número de Orden</th>
                    <th>Total</th>
                    <th>Tipo de Movimiento</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.id">
                    <td>{{ order.orderNumber }}</td>
                    <td>${{ order.total }}</td>
                    <td>{{ order.type }}</td>
                    <td>
                        <button class="btn-small btn" @click="viewOrderDetails(order)">Ver Detalles</button>
                        <button class="btn-small btn danger" @click="deleteOrder(order.id)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <router-link to="/create-order" class="add-order-link">Registrar Movimiento</router-link>

        <div v-if="selectedOrder" class="order-details">
            <h2>Detalles de la Orden</h2>
            <p><strong>Número de Orden:</strong> {{ selectedOrder.orderNumber }}</p>
            <p><strong>Total:</strong> ${{ selectedOrder.total }}</p>
            <p><strong>Tipo de Movimiento:</strong> {{ selectedOrder.type }}</p>
            <h3>Productos</h3>
            <ul>
                <li v-for="product in selectedOrder.products" :key="product.id">
                    {{ product.name }} - Cantidad: {{ product.quantity }} - Total: ${{ product.total }}
                </li>
            </ul>
            <button @click="closeOrderDetails" class="btn-small btn">Cerrar</button>
        </div>
    </div>
</template>

<script>
import { db } from '@/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default {
    data() {
        return {
            orders: [],
            selectedOrder: null,
        };
    },
    async created() {
        await this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            const querySnapshot = await getDocs(collection(db, 'orders'));
            this.orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        },
        async deleteOrder(id) {
            await deleteDoc(doc(db, 'orders', id));
            await this.fetchOrders();
        },
        viewOrderDetails(order) {
            this.selectedOrder = order;
        },
        closeOrderDetails() {
            this.selectedOrder = null;
        },
    },
};
</script>

<style scoped>
.orders-list-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #faf8e1; /* Color de fondo claro */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #000000; /* Color negro */
    margin-bottom: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

th, td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
}

.btn-small {
    padding: 5px 10px;
    margin-left: 10px;
}

.btn.danger {
    background-color: #7e3e18; /* Color rojo oscuro */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-order-link {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #7e3e18; /* Color rojo oscuro */
    color: white;
    text-decoration: none;
    border-radius: 4px;
    text-align: center;
}

.add-order-link:hover {
    background-color: #7e3e18; /* Color rojo oscuro */
}

.order-details {
    margin-top: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
