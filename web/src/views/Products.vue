<template>
  <div class="products">
    <h1 class="mb-5">Товары</h1>
    <v-text-field
      outlined
      label="Поиск"
      color="black"
      prepend-inner-icon="mdi-magnify"
      @input="set_search_query($event)"
    ></v-text-field>
    <div class="d-flex w100" v-if="products_loading">
      <v-progress-circular
        :size="200"
        :width="20"
        color="black"
        class="mx-auto my-15"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-row class="mb-2" v-else>
      <v-col cols="auto" v-for="product in items" :key="product.product_id">
        <Card :product="product"></Card>
      </v-col>
    </v-row>
    <div class="text-center" v-if="products.length > page_size">
      <v-pagination
        v-model="page"
        :length="page_count"
        :total-visible="7"
        color="black"
        @input="page_change_handler"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import Card from '@/components/products/Card.vue';
import { mapActions, mapGetters } from 'vuex';
import pagination_mixin from '@/mixins/pagination.mixin.js';

export default {
  name: 'Products',

  mixins: [pagination_mixin],

  components: {
    Card,
  },

  data: () => ({
    page_size: 6,
  }),

  computed: {
    ...mapGetters('product', ['products', 'products_loading']),
  },

  methods: {
    ...mapActions('product', ['set_search_query']),
  },
  watch: {
    products() {
      this.setup_pagination(this.products, this.page_size);
    },
  },
  async mounted() {
    if (this.products.length) {
      this.setup_pagination(this.products, this.page_size);
    }
  },
};
</script>

<style lang="scss">
.v-pagination {
  &__item {
    user-select: none;
  }
}
</style>
