<template>
  <div class="home">
    <h1>Inventario Panthoeon</h1>
    <ProductMovementsChart />
  </div>
</template>

<script>
import ProductMovementsChart from '@/components/ProductMoventsChart.vue';

export default {
  components: {
    ProductMovementsChart
  }
};
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #faf8e1;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: black; 
  margin-bottom: 20px;
}
</style>