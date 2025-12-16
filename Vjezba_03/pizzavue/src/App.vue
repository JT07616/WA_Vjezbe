<script setup>
import PizzaList from './components/PizzaList.vue'
import AppHeader from './components/AppHeader.vue'

</script>

<template>
  <AppHeader />
  <router-view />
  <OrderFooter />
</template>
