<template>
  <v-data-table
    class="elevation-1"
    :headers="headers"
    :items="products"
    :items-per-page="10"
    item-key="id"
    :loading="products_loading"
  >
    <template v-slot:[`item.categories`]="{ item }">
      <span v-for="cat in item.categories" :key="cat.category_id" v-text="cat.name + ' '"></span>
    </template>
    <template v-slot:[`item.open`]="{ item }">
      <v-btn icon :to="'/product/' + item.product_id">
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
    headers: [
      { text: 'ID', value: 'product_id' },
      { text: 'Название', value: 'name' },
      { text: 'Категории', value: 'categories' },
      { text: 'Дата', value: 'created_at' },
      { text: 'Цена', value: 'price' },
      { text: 'Действия', value: 'open' },
    ],
  }),
  computed: {
    ...mapGetters('product', ['products', 'products_loading']),
  },
};
</script>

<style></style>
