<template>
  <div>
    <h2>Movimientos de Productos</h2>
    <Bar :chart-data="chartData" :options="chartOptions"></Bar>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: {
    Bar
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'Entradas',
            backgroundColor: '#1E90FF', // Color azul del logo
            data: []
          },
          {
            label: 'Salidas',
            backgroundColor: '#FF4500', // Color rojo del logo
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  },
  async created() {
    await this.fetchProductMovements();
  },
  methods: {
    async fetchProductMovements() {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const orders = querySnapshot.docs.map(doc => doc.data());

      console.log('Orders:', orders); // Verifica los datos obtenidos

      const productMovements = {};

      orders.forEach(order => {
        order.products.forEach(product => {
          if (!productMovements[product.name]) {
            productMovements[product.name] = { entradas: 0, salidas: 0 };
          }
          if (order.type === 'entrada') {
            productMovements[product.name].entradas += product.quantity;
          } else if (order.type === 'salida') {
            productMovements[product.name].salidas += product.quantity;
          }
        });
      });

      console.log('Product Movements:', productMovements); // Verifica los movimientos de productos

      this.chartData.labels = Object.keys(productMovements);
      this.chartData.datasets[0].data = Object.values(productMovements).map(movement => movement.entradas);
      this.chartData.datasets[1].data = Object.values(productMovements).map(movement => movement.salidas);
    }
  }
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #1E90FF; /* Color azul del logo */
}

div {
  background-color: #F0F8FF; /* Color de fondo claro */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>