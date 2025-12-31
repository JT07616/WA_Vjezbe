<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
  <div class="max-w-5xl mx-auto mb-6 bg-slate-700/70 backdrop-blur-sm border border-slate-600 rounded-xl p-4">
  <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
    <input
      v-model="qNaziv"
      placeholder="Traži po nazivu..."
      class="px-3 py-2 rounded bg-white text-slate-800 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />

    <input
      v-model="qCijenaMin"
      placeholder="Cijena min"
      class="px-3 py-2 rounded bg-white text-slate-800 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />

    <input
      v-model="qCijenaMax"
      placeholder="Cijena max"
      class="px-3 py-2 rounded bg-white text-slate-800 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
    />

    <select
      v-model="qSort"
      class="px-3 py-2 rounded bg-white text-slate-800 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
    >
      <option value="">Bez sortiranja</option>
      <option value="asc">Cijena ↑</option>
      <option value="desc">Cijena ↓</option>
    </select>
  </div>

  <div class="mt-3 flex gap-2">
    <button
      @click="dohvati_pizze()"
      class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl hover:bg-orange-600 transition-all"
    >
      Primijeni
    </button>

    <button
      @click="reset_filter()"
      class="bg-slate-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-slate-500 transition-all"
    >
      Reset
    </button>
  </div>
</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Pizze -->
      <div
        v-for="pizza in pizze"
        :key="pizza.naziv"
        :class="[
          'bg-inherit rounded-xl overflow-hidden cursor-pointer transition-all duration-300',
          odabrana_pizza?.naziv === pizza?.naziv
            ? 'ring-4 ring-orange-300 shadow-lg shadow-orange-300/50 scale-[1.02]'
            : 'hover:scale-[1.01]',
        ]"
        @click="odaberi_pizzu(pizza)"
      >
        <div
          class="w-full h-48 flex items-center justify-center bg-inherit overflow-hidden rounded-xl"
        >
          <img :src="pizza.slika_url" :alt="pizza.slika_url" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <h2 class="text-lg font-bold tracking-wide text-orange-500">{{ pizza.naziv }}</h2>

            <div class="flex space-x-2">
              <div
                v-for="sastojak in pizza.sastojci"
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-slate-50 font-semibold text-xs"
              >
                <v-icon :name="ikoneSastojaka[sastojak]"></v-icon>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              class="flex justify-between text-gray-700"
            >
              <span class="font-medium">{{
                velicina.charAt(0).toUpperCase() + velicina.slice(1)
              }}</span>
              <span>€{{ cijena }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <OrderFooter
      v-if="odabrana_pizza != null"
      :odabrana-pizza="odabrana_pizza"
      @close="odabrana_pizza = null"
    />
  </div>
</template>

<script setup>
import OrderFooter from './OrderFooter.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

import { addIcons } from 'oh-vue-icons'
import {
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  CoHotjar,
  GiMilkCarton,
  GiBellPepper,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  GiHamShank,
} from 'oh-vue-icons/icons'
addIcons(
  GiTomato,
  GiCheeseWedge,
  GiSlicedMushroom,
  IoLeafSharp,
  GiBellPepper,
  GiHamShank,
  LaPepperHotSolid,
  GiCannedFish,
  GiGarlic,
  FaBacon,
  CoHotjar,
  GiMilkCarton,
)

const URL_express = 'http://localhost:3000'

const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton',
}

let odabrana_pizza = ref(null)

let pizze = ref([])

let qNaziv = ref('')
let qCijenaMin = ref('')
let qCijenaMax = ref('')
let qSort = ref('')

function odaberi_pizzu(novaPizza) {
  odabrana_pizza.value = novaPizza
  console.log(`Odabrana pizza je ${odabrana_pizza.value.naziv}`)
}

async function dohvati_pizze() {
  try {
    let params = {}

    if (qNaziv.value) params.naziv = qNaziv.value
    if (qCijenaMin.value) params.cijena_min = qCijenaMin.value
    if (qCijenaMax.value) params.cijena_max = qCijenaMax.value
    if (qSort.value) params.sort = qSort.value

    let response = await axios.get(`${URL_express}/pizze`, { params })
    pizze.value = response.data
  } catch (error) {
    console.error(`Greska: ${error}`)
  }
}

function reset_filter() {
  qNaziv.value = ''
  qCijenaMin.value = ''
  qCijenaMax.value = ''
  qSort.value = ''
  dohvati_pizze()
}

onMounted(() => {
  dohvati_pizze()

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      odabrana_pizza.value = null // poništavamo odabir pizze
    }
  })
})
</script>
