<template>
  <v-app-bar app color="white">
    <div class="d-flex align-center">
      <v-btn text to="/" class="px-0">
        <span>ЛОГО</span>
      </v-btn>
    </div>

    <v-spacer></v-spacer>

    <v-btn text to="/products">
      <span class="mr-2">Товары</span>
      <v-icon>mdi-hanger</v-icon>
    </v-btn>
    <v-btn text to="/login">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style lang="scss">

</style>