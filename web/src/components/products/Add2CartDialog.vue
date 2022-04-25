<template>
  <v-dialog
    :value="is_cart_dialog_visible"
    width="300"
    @click:outside="close_cart_dialog"
    v-if="cart_product"
  >
    <v-card>
      <v-container>
        <v-card-title class="text-h5 mb-3 px-0" v-text="cart_product.name"></v-card-title>

        <span class="font-weight-bold" v-if="cart_product.colors.length">Цвета:</span>
        <v-chip-group v-if="cart_product.colors.length" class="mb-3" v-model="selected_color">
          <v-chip
            class="product__v-chip"
            active-class="black white--text"
            v-for="(size, idx) in cart_product.colors"
            :key="idx"
            v-text="size"
          ></v-chip>
        </v-chip-group>

        <span class="font-weight-bold" v-if="cart_product.sizes.length">Размеры:</span>
        <v-chip-group v-if="cart_product.sizes.length" class="mb-3" v-model="selected_size">
          <v-chip
            class="product__v-chip"
            active-class="black white--text"
            v-for="(size, idx) in cart_product.sizes"
            :key="idx"
            v-text="size"
          ></v-chip>
        </v-chip-group>

        <span class="font-weight-bold">Количество:</span>
        <v-text-field
          class="mt-0 pt-0"
          v-model="quantity"
          color="black"
          hide-details
          single-line
          type="number"
          min="1"
        />

        <v-card-actions>
          <span v-if="error" class="error" v-text="error"></span>
          <v-spacer></v-spacer>
          <v-btn color="black" dark @click="add_to_cart_dialog">Добавить</v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    quantity: 1,
    selected_size: null,
    selected_color: null,
    error: null,
  }),
  computed: {
    ...mapGetters('product', ['cart_product', 'is_cart_dialog_visible']),
  },
  methods: {
    ...mapActions('product', ['add_to_cart', 'close_cart_dialog']),
    add_to_cart_dialog() {
      if (this.cart_product.sizes.length) {
        if (this.selected_size == null) {
          console.log(this.selected_size);
          this.error = 'Выберите размер';
          return;
        }
      }
      if (this.quantity < 1) {
        this.error = 'Введите количество';
        return;
      }
      if (this.cart_product.colors.length) {
        if (this.selected_color == null) {
          console.log(this.selected_color);
          this.error = 'Выберите цвет';
          return;
        }
      }
      this.error = null;
      this.add_to_cart({
        ...this.cart_product,
        quantity: this.quantity,
        selected_size: this.selected_size,
        selected_color: this.selected_color,
      });
    },
  },
  destroy() {
    this.quantity = 1;
    this.selected_size = null;
    this.error = null;
    this.selected_color = null;
  },
};
</script>
