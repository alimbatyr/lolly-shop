<template>
  <v-sheet>
    <v-overlay :value="is_overlay" @click="is_overlay = false">
      <v-img :src="overlay_image_src"></v-img>
    </v-overlay>
    <v-row v-if="is_loading">
      <v-progress-circular
        :size="200"
        :width="20"
        color="black"
        class="mx-auto my-15"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <div v-else-if="product">
      <v-row>
        <v-col md="12" lg="4">
          <v-carousel hide-delimiters height="350" :show-arrows="product.images.length > 1">
            <v-carousel-item
              v-for="image in product.images"
              :key="image.image_id"
              :src="image.src"
              @click="open_image(image.src)"
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
          <v-card-text style="font-size: 1rem">
            <span class="font-weight-bold">Описание:</span> <br />
            <span v-text="product.description"></span>
          </v-card-text>
          <v-divider class="mx-4"></v-divider>

          <v-row class="mt-1 mx-1">
            <v-col v-if="product.colors.length" cols="auto">
              <span class="font-weight-bold">Цвета:</span>
              <v-chip-group>
                <v-chip
                  class="product__v-chip"
                  active-class=""
                  v-for="(color, idx) in product.colors"
                  :key="idx"
                  v-text="color"
                ></v-chip>
              </v-chip-group>
            </v-col>
            <v-col v-if="product.sizes.length" cols="auto">
              <span class="font-weight-bold">Размеры:</span>
              <v-chip-group>
                <v-chip
                  class="product__v-chip"
                  active-class=""
                  v-for="(size, idx) in product.sizes"
                  :key="idx"
                  v-text="size"
                ></v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <v-row class="mx-1">
            <v-col>
              <span class="font-weight-bold">Категории:</span>
              <v-chip-group v-if="product.categories.length">
                <v-chip
                  class="product__v-chip"
                  active-class=""
                  v-for="(category, idx) in product.categories"
                  :key="idx"
                  v-text="category.name"
                ></v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <v-card-actions class="flex-wrap">
            <v-btn
              v-if="user"
              class="ma-2"
              color="black"
              dark
              :to="'/product-edit/' + product.product_id"
            >
              Редактировать
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="black" class="ma-2" dark @click="open_cart_dialog(product)">
              <span>
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
          <v-btn color="black" dark to="/products"> К товарам </v-btn>
        </v-col>
      </v-row>
    </div>
    <h2 class="mb-3">Похожие товары</h2>
    <v-slide-group touch show-arrows>
      <v-slide-item class="mx-2" v-for="item in similiar_products.slice(0, 9)" :key="item.product_id">
        <Card :product="item"></Card>
      </v-slide-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import Card from '@/components/products/Card.vue';

export default {
  name: 'Product',
  components: {
    Card,
  },
  data: () => ({
    is_loading: false,
    overlay_image_src: null,
    is_overlay: false,
  }),
  computed: {
    ...mapGetters('product', {
      product: 'product_selected',
      cart: 'cart',
      similiar_products: 'similiar_products',
    }),
    ...mapGetters(['user']),
  },
  methods: {
    ...mapActions('product', ['product_get', 'open_cart_dialog']),
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
    open_image(src) {
      this.is_overlay = true;
      this.overlay_image_src = src;
    },
  },
  watch: {
    // watch at route params id and get product
    $route: {
      async handler(route) {
        this.is_loading = true;
        await this.product_get(route.params.id);
        this.is_loading = false;
      },
      immediate: true,
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
  &__actions {
    margin-left: -12px;
    margin-right: -12px;
  }
}
.v-slide-group__content {
  padding: 2em 0;
}
</style>
