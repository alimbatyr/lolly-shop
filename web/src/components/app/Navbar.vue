<template>
  <v-app-bar class="app-navbar" app color="white" elevation="1" clipped-left>
    <div class="d-flex align-center app-navbar_pointer" v-ripple @click="$router.push('/')">
      <v-img v-if="$vuetify.breakpoint.smAndDown" src="@/assets/images/logo_small.svg"></v-img>
      <v-img v-else src="@/assets/images/logo.svg"></v-img>
    </div>

    <v-spacer></v-spacer>
    <v-btn
      v-if="user"
      class="mr-md-3 mr-2"
      text
      to="/product-create"
      active-class="black theme--dark"
    >
      <span class="mr-2" v-show="!$vuetify.breakpoint.smAndDown">Добавить товар</span>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn text to="/cart" active-class="black theme--dark">
      <v-badge v-if="cart_total" color="black" :content="cart_total">
        <span class="mr-2" v-show="!$vuetify.breakpoint.smAndDown">Корзина</span>
        <v-icon>mdi-cart</v-icon>
      </v-badge>
      <span v-else>
        <span class="mr-2" v-show="!$vuetify.breakpoint.smAndDown">Корзина</span>
        <v-icon>mdi-cart</v-icon>
      </span>
    </v-btn>
    <v-btn text to="/products" class="mx-md-3 mx-2" active-class="black theme--dark">
      <span class="mr-2" v-show="!$vuetify.breakpoint.smAndDown">Товары</span>
      <v-icon>mdi-hanger</v-icon>
    </v-btn>
    <v-btn text :to="user ? '/admin' : '/login'" active-class="black theme--dark">
      <span
        v-if="user"
        v-show="!$vuetify.breakpoint.smAndDown"
        class="mr-3"
        v-text="user.userid"
      ></span>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Navbar',
  computed: {
    ...mapGetters(['user']),
    ...mapGetters('product', ['cart_total']),
  },
};
</script>

<style scoped>
/* .app-navbar /deep/ .v-toolbar__content {
  padding-right: 0;
  padding-left: 0;
} */
.app-navbar_pointer {
  cursor: pointer;
}
</style>
