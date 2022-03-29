<template>
  <v-sheet>
    <v-progress-circular
      v-if="is_loading"
      :size="200"
      :width="20"
      color="black"
      class="mx-auto my-15"
      indeterminate
    ></v-progress-circular>
    <div v-else-if="product">
      <v-row>
        <v-col cols="4">
          <v-carousel hide-delimiters height="500" :show-arrows="product.images.length > 1">
            <v-carousel-item
              v-for="image in product.images"
              :key="image.image_id"
              :src="image.src"
            ></v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col style="display: flex; flex-direction: column">
          <v-card-title class="text-h4">
            <span v-text="product.name"></span>
            <v-spacer></v-spacer>
            <span v-text="product.price + ' тг'"></span>
          </v-card-title>

          <v-divider class="mx-4"></v-divider>
          <v-card-text v-text="product.description"></v-card-text>
          <v-divider class="mx-4"></v-divider>

          <v-row class="my-1 mx-1">
            <!-- <v-col>
              <v-chip-group column>
                <v-chip
                  class="product__v-chip product__v-chip--rounded"
                  v-for="idx in 5"
                  filter
                  :key="idx"
                  color="black"
                ></v-chip>
              </v-chip-group>
            </v-col> -->
            <v-col>
              <v-chip-group v-if="product.sizes.length">
                <v-chip
                  class="product__v-chip"
                  active-class="black white--text"
                  v-for="(size, idx) in product.sizes"
                  :key="idx"
                  v-text="size"
                ></v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <v-card-actions class="mx-2">
            <v-btn v-if="user" color="black" dark :to="'/product-edit/' + product.product_id">
              Редактировать
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="black" dark @click="toggle_to_cart(product)">
              <span v-if="is_product_in_cart(product)">
                <span class="mr-3">Добавлено</span>
                <v-icon>mdi-cart-check</v-icon>
              </span>
              <span v-else>
                <span class="mr-3">Добавить в корзину</span>
                <v-icon>mdi-cart-plus</v-icon>
              </span>
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      <v-row>
        <v-col cols="12" class="text-center">
          <h1 class="display-1">404</h1>
          <h2 class="display-2 my-6">Товар не найден</h2>
          <v-btn color="black" dark to="/products">
            К товарам
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <!-- <v-container>
      <h2>Другие товары</h2>
      <v-row>
        <v-col cols="auto"></v-col>
      </v-row>
    </v-container> -->
  </v-sheet>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Product',
  data: () => ({
    is_loading: false,
  }),
  computed: {
    ...mapGetters('product', {
      product: 'product_selected',
      cart: 'cart',
    }),
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions('product', ['product_get']),
    ...mapMutations('product', ['cart_remove', 'cart_push']),
    toggle_to_cart(product) {
      if (this.is_product_in_cart(product)) {
        this.cart_remove(product);
      } else {
        this.cart_push({ ...product, selected_size: this.selected_size });
      }
    },
    is_product_in_cart(product) {
      return this.cart.some(cart_product => cart_product.product_id === product.product_id);
    },
  },
  async created() {
    this.is_loading = true;
    await this.product_get(this.$route.params.id);
    this.is_loading = false;
  },
};
</script>

<style lang="scss">
.product {
  &__v-chip {
    &--rounded {
      border-radius: 50% !important;
      height: 1.5em !important;
      padding: 0 !important;
      width: 1.5em !important;
    }
  }
}
</style>
