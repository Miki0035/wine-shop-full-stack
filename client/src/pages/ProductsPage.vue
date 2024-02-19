<template>
    <h1>Products</h1>
    <ProductsList :products="products" />
</template>

<script>
import ProductsList from '@/components/ProductsList.vue';
// import { products } from '../temp-data.js';
import axios from 'axios';


export default {
    name: 'ProductsPage',
    components: {
        ProductsList,
    },
    data() {
        return {
            products: [],
        }
    },
    async created() {
      const response = await axios.get('/api/products');
      const products = response.data;
      this.products = products;
    }
    
}
</script>