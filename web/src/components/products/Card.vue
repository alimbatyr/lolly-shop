<template>
  <v-card width="357">
    <v-carousel
      hide-delimiters
      show-arrows-on-hover
      height="250"
      :show-arrows="product.images.length > 1"
    >
      <v-carousel-item
        v-for="image in product.images"
        :key="image.image_id"
        :src="image.src"
      ></v-carousel-item>
    </v-carousel>

    <v-card-title class="product-card__title">
      <span class="product-card__title-text" v-text="product.name"></span>
      <div class="ml-auto text-subtitle-1" v-text="product.price + ' тг'"></div>
    </v-card-title>

    <v-card-text class="pb-0">
      <!-- <v-chip-group column>
        <v-chip
          class="product-card__v-chip product-card__v-chip--rounded"
          v-for="idx in 5"
          filter
          :key="idx"
          :color="get_color(idx)"
        ></v-chip>
      </v-chip-group> -->
      <v-chip-group v-if="product.sizes.length" v-model="selected_size">
        <v-chip
          class="product-card__v-chip"
          active-class="black white--text"
          v-for="(size, idx) in product.sizes"
          :key="idx"
          v-text="size"
        ></v-chip>
      </v-chip-group>
    </v-card-text>

    <v-divider class="mx-4"></v-divider>

    <v-card-text>
      <div class="product-card__description" v-text="product.description"></div>
    </v-card-text>

    <v-card-actions>
      <v-btn text :to="'/product/' + product.product_id"> Подробнее </v-btn>
      <v-btn class="ml-auto px-0" color="black" text icon @click="toggle_to_cart(product)">
        <v-icon v-if="is_product_in_cart(product)">mdi-cart-check</v-icon>
        <v-icon v-else>mdi-cart-plus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Card',
  props: ['product'],
  data: () => ({
    in_cart: false,
    selected_size: null,
  }),

  computed: {
    ...mapGetters('product', ['cart']),
  },

  methods: {
    ...mapActions('product', ['product_select']),
    ...mapMutations('product', ['cart_remove', 'cart_push']),
    get_color(idx) {
      switch (idx) {
        case 0:
          return '#f44336';
        case 1:
          return '#e91e63';
        case 2:
          return '#9c27b0';
        case 3:
          return '#673ab7';
        case 4:
          return '#3f51b5';
        default:
          break;
      }
    },
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
};
</script>

<style lang="scss">
.product-card {
  &__title {
    align-items: baseline !important;
    line-height: 1.3 !important;
    &-text {
      max-width: 80%;
    }
  }

  &__description {
    text-overflow: ellipsis;
    display: -moz-box;
    display: -webkit-box;
    max-height: 5.5em;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__v-chip {
    &--rounded {
      border-radius: 50% !important;
      height: 1.5em !important;
      padding: 0 !important;
      width: 1.5em !important;
    }
  }
}

.v-chip .v-icon {
  font-size: 16px !important;
}

.v-chip .v-icon--left {
  margin-left: 2px !important;
}

// .v-chip--active {
//   transform: scale(1.2) !important;
//   transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
// }
</style>
