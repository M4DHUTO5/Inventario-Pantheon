<template>
    <div class="create-order-container">
        <h1>Registrar Salida/Entrada de Productos</h1>
        <form @submit.prevent="submitOrder">
            <input v-model="newOrder.orderNumber" placeholder="Order Number" class="input-style" readonly/>
            <select v-model="newOrder.type" class="input-style">
                <option value="" disabled>Seleccione el tipo de movimiento</option>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
            </select>
            
            <table class="product-selection-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Cantidad</th>
                        <th>Registrar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in availableProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>${{ product.price }}</td>
                        <td>{{ product.stock }}</td>
                        <td><input type="number" v-model="product.quantity" min="0" placeholder="Quantity" class="input-style"/></td>
                        <td><button @click="addProductToOrder(product)" class="add-button" :disabled="isProductAdded(product)">Registrar</button></td>
                    </tr>
                </tbody>
            </table>
            
            <h2>Movimiento</h2>
            <ul>
                <li v-for="(item, index) in newOrder.products" :key="index">
                    {{ item.name }} - Cantidad: {{ item.quantity }} - Total: ${{ item.total }}
                    <button @click="editProductInOrder(index)" class="btn-small btn">Editar</button>
                    <button @click="removeProductFromOrder(index)" class="btn-small btn danger">Eliminar</button>
                </li>
            </ul>
            <p>
                <strong> Orden Total: ${{ newOrder.total }}</strong>
            </p>
            <button type="submit" class="submit-button">Registrar</button>
        </form>

        <div v-if="editingProductIndex !== null" class="edit-product-form">
            <h2>Editar Registro</h2>
            <input v-model="editingProduct.name" placeholder="Name" class="input-style" readonly/>
            <input v-model="editingProduct.quantity" placeholder="Quantity" type="number" class="input-style"/>
            <button @click="updateProductInOrder" class="submit-button">Actualizar</button>
            <button @click="cancelEditProduct" class="btn-small btn danger">Cancelar</button>
        </div>
    </div>
</template>

<script>
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';

export default {
    data() {
        return {
            newOrder: {
                orderNumber: '',
                type: '',
                products: [],
                total: 0,
            },
            availableProducts: [],
            editingProductIndex: null,
            editingProduct: {
                name: '',
                quantity: 0,
                total: 0,
            },
        };
    },
    async created() {
        await this.fetchProducts();
        this.newOrder.orderNumber = this.generateOrderNumber();
    },
    methods: {
        async fetchProducts() {
            const querySnapshot = await getDocs(collection(db, 'products'));
            this.availableProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), quantity: 0 }));
        },
        addProductToOrder(selectedProduct) {
            if (selectedProduct.quantity <= 0) {
                alert('La cantidad debe ser mayor a 0');
                return;
            }
            if (this.newOrder.type === 'salida' && selectedProduct.quantity > selectedProduct.stock) {
                alert('No hay suficiente stock disponible');
                return;
            }
            const productTotal = selectedProduct.price * selectedProduct.quantity;
            const productToAdd = {
                ...selectedProduct,
                total: productTotal,
            };
            this.newOrder.products.push(productToAdd);
            this.calculateOrderTotal();
            if (this.newOrder.type === 'salida') {
                selectedProduct.stock -= selectedProduct.quantity; // Actualizar stock localmente para salidas
            }
        },
        isProductAdded(product) {
            return this.newOrder.products.some(item => item.id === product.id);
        },
        removeProductFromOrder(index) {
            const product = this.newOrder.products[index];
            const originalProduct = this.availableProducts.find(p => p.id === product.id);
            if (this.newOrder.type === 'salida') {
                originalProduct.stock += product.quantity; // Restaurar stock localmente para salidas
            }
            this.newOrder.products.splice(index, 1);
            this.calculateOrderTotal();
        },
        editProductInOrder(index) {
            this.editingProductIndex = index;
            this.editingProduct = { ...this.newOrder.products[index] };
        },
        updateProductInOrder() {
            if (this.editingProduct.quantity <= 0) {
                alert('La cantidad debe ser mayor a 0');
                return;
            }
            const originalProduct = this.availableProducts.find(p => p.id === this.editingProduct.id);
            if (this.newOrder.type === 'salida' && this.editingProduct.quantity > originalProduct.stock + this.newOrder.products[this.editingProductIndex].quantity) {
                alert('No hay suficiente stock disponible');
                return;
            }
            if (this.newOrder.type === 'salida') {
                originalProduct.stock += this.newOrder.products[this.editingProductIndex].quantity; // Restaurar stock original para salidas
                originalProduct.stock -= this.editingProduct.quantity; // Actualizar stock con nueva cantidad para salidas
            }
            const productTotal = this.editingProduct.price * this.editingProduct.quantity;
            this.editingProduct.total = productTotal;
            this.$set(this.newOrder.products, this.editingProductIndex, { ...this.editingProduct });
            this.calculateOrderTotal();
            this.cancelEditProduct();
        },
        cancelEditProduct() {
            this.editingProductIndex = null;
            this.editingProduct = {
                name: '',
                quantity: 0,
                total: 0,
            };
        },
        calculateOrderTotal() {
            this.newOrder.total = this.newOrder.products.reduce((sum, product) => sum + product.total, 0);
        },
        generateOrderNumber() {
            const now = new Date();
            return `ORD-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        },
        async submitOrder() {
            if (this.newOrder.products.length === 0) {
                alert('La orden debe tener al menos un producto');
                return;
            }
            if (!this.newOrder.type) {
                alert('Debe seleccionar el tipo de movimiento');
                return;
            }
            await addDoc(collection(db, 'orders'), this.newOrder);
            for (const product of this.newOrder.products) {
                const productRef = doc(db, 'products', product.id);
                if (this.newOrder.type === 'entrada') {
                    await updateDoc(productRef, { stock: product.stock + product.quantity });
                } else if (this.newOrder.type === 'salida') {
                    await updateDoc(productRef, { stock: product.stock - product.quantity });
                }
            }
            alert('Orden registrada exitosamente');
            this.resetOrderForm();
        },
        resetOrderForm() {
            this.newOrder = { orderNumber: this.generateOrderNumber(), type: '', products: [], total: 0 };
            this.availableProducts.forEach(product => product.quantity = 0);
        }
    }
}
</script>

<style scoped>
.create-order-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #faf8e1;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2 {
    text-align: center;
    color: #000000; /* Color negro */
}

.input-style {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.product-selection-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.product-selection-table th, .product-selection-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
}

.add-button {
    background-color: #7e3e18; /* Color rojo oscuro */
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.add-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

.submit-button {
    width: 100%;
    padding: 10px;
    background-color: #7e3e18; /* Color rojo oscuro */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #7e3e18; /* Color rojo oscuro */
}

.edit-product-form {
    margin-top: 20px;
    padding: 20px;
    background-color: #faf8e1;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>