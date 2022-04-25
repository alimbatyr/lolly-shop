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
      <v-chip-group v-if="product.colors.length" v-model="product.selected_color">
        <v-chip
          :disabled="is_cart"
          class="product-card__v-chip"
          v-for="color, idx in product.colors"
          :active-class="is_cart ? 'black white--text' : ''"
          :key="idx"
          v-text="color"
        ></v-chip>
      </v-chip-group>
      <v-chip-group v-if="product.sizes.length" v-model="product.selected_size">
        <v-chip
          :disabled="is_cart"
          class="product-card__v-chip"
          :active-class="is_cart ? 'black white--text' : ''"
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
      <v-spacer></v-spacer>
      <v-text-field
        v-if="is_cart"
        class="mt-0 pt-0 card__quantity-input"
        max-width="20px"
        :value="product.quantity"
        color="black"
        hide-details
        single-line
        type="number"
        min="1"
        @blur="set_cart_product_quantity({ cart_id: product.cart_id, quantity: +$event.target.value })"
      />
      <v-btn class="px-0" color="black" text icon @click="cart_remove(product.cart_id)" v-if="is_cart">
        <v-icon>mdi-cart-remove</v-icon>
      </v-btn>
      <v-btn class="px-0" color="black" text icon @click="open_cart_dialog(product)" v-else>
        <v-icon>mdi-cart-plus</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'Card',
  props: ['product', 'is_cart'],
  data: () => ({
    in_cart: false,
    selected_size: null,
  }),

  computed: {
    ...mapGetters('product', ['cart']),
  },

  methods: {
    ...mapActions('product', ['product_select', 'set_cart_product_quantity', 'open_cart_dialog']),
    ...mapMutations('product', ['cart_remove', 'cart_push']),
    test_blur(obj) {
      console.log(obj);
    }
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
.card__quantity-input {
  max-width: 50px;
}

// .v-chip--active {
//   transform: scale(1.2) !important;
//   transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
// }
</style>
