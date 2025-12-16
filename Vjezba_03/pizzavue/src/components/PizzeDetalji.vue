<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const pizza = ref(null)
const greska = ref('')

onMounted(async () => {
  try {
    const naziv = route.params.naziv
    const res = await axios.get(`http://localhost:3000/pizze/${naziv}`)
    pizza.value = res.data
  } catch (err) {
    greska.value =
      err.response?.data?.message || 'Greška pri dohvaćanju pizze.'
  }
})
</script>

<template>
  <div class="p-8">
    <button
      @click="router.push('/')"
      class="mb-6 inline-flex items-center gap-2
         px-5 py-2 rounded-xl
         bg-orange-500 text-white font-semibold
         shadow-md shadow-black/30
         hover:bg-orange-600 transition-all"
    >
      Natrag na popis
    </button>

    <div v-if="greska" class="text-red-500">
      {{ greska }}
    </div>

    <div v-else-if="pizza">
      <h1 class="text-2xl font-bold">{{ pizza.naziv }}</h1>
      <img :src="pizza.slika_url" class="w-64 my-4" />
           <div class="mt-4">
              <h2 class="text-lg font-semibold text-slate-700 mb-2">
                Sastojci
              </h2>

              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="(sastojak, index) in pizza.sastojci"
                  :key="index"
                  class="px-3 py-1 rounded-full
                        bg-orange-500/20 text-orange-600
                        border border-orange-500/40
                        text-sm font-medium"
                >
                  {{ sastojak }}
                </li>
              </ul>
           </div>
    </div>
  </div>
</template>