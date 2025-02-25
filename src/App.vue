<template>
  <head>
    <title>Vue.js Pantheon</title>
    <link rel="icon" href="src\assets\logo-pantheon (1).ico">
  </head>
  <div id="app">
    
    <nav class="navbar">
      <img src="@/assets/logo pantheon.png" alt="Logo" class="logo">
      <router-link to="/products" class="nav-link">Productos</router-link>
      <router-link to="/orders" class="nav-link">Movimientos</router-link>
      <router-link to="/create-order" class="nav-link">Resgistrar</router-link>
    </nav>
    <router-view>
    </router-view>
  </div>

  <div class="home">
  <product-movents-chart/>
</div>
</template>

<script>
import ProductMoventsChart from './components/ProductMoventsChart.vue';
export default {
  components: { ProductMoventsChart },
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e08938d5;
  padding: 10px;
  border-radius: 8px;
}

.logo {
  height: 150px;
  margin-right: 200px;
  align-self: left;
}

.nav-link {
  color: white;
  margin: 0 15px;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #ebcfa3;
}

.nav-link.router-link-exact-active {
  background-color: #7e3e18;
}

.h1 {
  font-size: 2em;
  color: #fff;
}
</style>


<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
</style>
