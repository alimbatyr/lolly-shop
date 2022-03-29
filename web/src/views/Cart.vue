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
      Корзина пуста
    </h3>
    <v-row class="mb-2" v-else>
      <v-col cols="auto" v-for="product in items" :key="product.product_id">
        <Card :product="product"></Card>
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
    <div class="cart__actions d-flex mt-15">
      <v-spacer></v-spacer>
      <v-btn color="black" dark class="mr-3" @click="set_cart([])"> Очистить корзину </v-btn>
      <v-btn color="black" dark class="" @click="generate_wa_order">
        Оформить заказ
      </v-btn>
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
    ...mapGetters('product', ['cart']),
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
</style>
