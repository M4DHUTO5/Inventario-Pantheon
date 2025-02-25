<template>
    <div class="product-list-container">
        <h1> Lista de Productos</h1>
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Descripcion</th>
                    <th>Stock</th>
                    <th>Acciones</th>                    
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>${{ product.price }}</td>
                    <td>{{ product.description }}</td>
                    <td>{{ product.stock }}</td>
                    <td>
                        <button class="btn-small" @click="editProduct(product.id)">Editar</button> 
                        <button class="btn-small btn danger" @click="deleteProduct(product.id)">Eliminar</button> 
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="showAddProduct = true" class="add-button"> Añadir Producto </button>

        <div v-if="showAddProduct || selectedProduct" class="product-form">
            <input v-model="productForm.name" placeholder="Name"/>
            <input v-model="productForm.price" placeholder="Price" type="number"/>
            <textarea v-model="productForm.description" placeholder="Description"></textarea>
            <input v-model="productForm.stock" placeholder="Stock" type="number"/>

            <div class="button-group">
                <button @click="submitProduct" class="submit-button">Guardar</button>
                <button @click="cancelProduct" class="btn danger">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from '@/firebaseConfig';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            products: [],
            showAddProduct: false,
            selectedProduct: null,
            productForm: {
                name: '',
                price: 0,
                description: '',
                stock: 0,
            },
        };
    },
    async created() {
        await this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            const querySnapshot = await getDocs(collection(db, "products"));
            this.products = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => a.name.localeCompare(b.name));
        },
        editProduct(id) {
            const product = this.products.find(product => product.id === id);
            this.productForm = { ...product };
            this.selectedProduct = id;
            this.showAddProduct = true;
        },
        async deleteProduct(id) {
            await deleteDoc(doc(db, "products", id));
            await this.fetchProducts();
        },
        async submitProduct() {
            if (this.selectedProduct) {
                await updateDoc(doc(db, "products", this.selectedProduct), this.productForm);
            } else {
                await addDoc(collection(db, "products"), this.productForm);
            }
            this.cancelProduct();
            await this.fetchProducts();
        },
        cancelProduct() {
            this.showAddProduct = false;
            this.selectedProduct = null;
            this.productForm = {
                name: '',
                price: 0,
                description: '',
                stock: 0,
            };
        }
    }
}
</script>

<style scoped>
.product-list-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #faf8e1;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
    text-align: center;
    color: #000000; 
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
    background-color: #7e3e18; 
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-button {
    background-color: #7e3e18; 
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.add-button:hover {
    background-color: #7e3e18; 
}

.submit-button {
    background-color: #7e3e18; 
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #7e3e18; 
}

.product-form {
    margin-top: 20px;
}

.button-group {
    display: flex;
    justify-content: space-between;
}

input, textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #7e3e18; 
    color: white;
}
</style>