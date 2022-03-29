<template>
  <v-app-bar class="app-navbar" app color="white" elevation="1" clipped-left>
    <div class="d-flex align-center">
      <v-btn text to="/">
        <span>ЛОГО</span>
      </v-btn>
    </div>

    <v-spacer></v-spacer>
    <v-btn v-if="user" text to="/product-create" active-class="black theme--dark">
      <span class="mr-2">Добавить товар</span>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn text to="/cart" class="mx-3" active-class="black theme--dark">
      <span class="mr-2">Корзина</span>
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <v-btn text to="/products" class="mx-3" active-class="black theme--dark">
      <span class="mr-2">Товары</span>
      <v-icon>mdi-hanger</v-icon>
    </v-btn>
    <v-btn text :to="user ? '/admin' : '/login'" active-class="black theme--dark">
      <span v-if="user" class="mr-3" v-text="user.userid"></span>
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
  },
};
</script>

<style scoped>
/* .app-navbar /deep/ .v-toolbar__content {
  padding-right: 0;
  padding-left: 0;
} */
</style>
