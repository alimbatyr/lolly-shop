<template>
  <div class="cart">
    <h1 class="mb-5">Корзина</h1>
    <div class="d-flex w100" v-if="is_loading">
      <v-progress-circular
        :size="200"
        :width="20"
        color="black"
        class="mx-auto my-15"
        indeterminate
      ></v-progress-circular>
    </div>
    <h3 v-else-if="!items.length">
      Корзина пуста.
      <router-link to="/products">К товарам.</router-link>
    </h3>
    <v-row class="mb-2" v-else>
      <v-col cols="auto" v-for="product in items" :key="product.cart_id">
        <Card :product="product" :is_cart="true"></Card>
      </v-col>
    </v-row>
    <div class="text-center" v-if="cart.length > page_size">
      <v-pagination
        v-model="page"
        :length="page_count"
        :total-visible="7"
        color="black"
        @input="page_change_handler"
      ></v-pagination>
    </div>
    <div class="cart__actions d-flex mt-15 flex-wrap align-center">
      <v-btn class="ma-3" color="black" dark @click="set_cart([])"> Очистить корзину </v-btn>
      <v-btn class="ma-3" color="black" dark @click="generate_wa_order"> Оформить заказ </v-btn>
      <span class="ma-3 font-weight-bold">
        <span>Общая стоимость: </span>
        <span v-text="cart_total_cost"></span>
      </span>
    </div>
  </div>
</template>

<script>
import Card from '@/components/products/Card.vue';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import pagination_mixin from '@/mixins/pagination.mixin.js';

export default {
  name: 'Cart',

  mixins: [pagination_mixin],

  components: {
    Card,
  },

  data: () => ({
    page_size: 6,
    is_loading: false,
  }),

  computed: {
    ...mapGetters('product', ['cart', 'cart_total_cost']),
  },

  watch: {
    cart() {
      this.setup_pagination(this.cart, this.page_size);
    },
  },

  methods: {
    ...mapActions('product', ['generate_wa_order']),
    ...mapMutations('product', ['set_cart']),
  },
  async mounted() {
    this.is_loading = true;
    if (this.cart.length) {
      this.setup_pagination(this.cart, this.page_size);
    }
    this.is_loading = false;
  },
};
</script>

<style lang="scss">
.v-pagination {
  &__item {
    user-select: none;
  }
}

.cart__actions {
  margin-left: -12px;
  margin-right: -12px;
}
</style>
