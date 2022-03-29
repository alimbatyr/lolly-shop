<template>
  <div class="admin">
    <v-tabs v-model="tab" color="black">
      <v-tab v-for="(t, idx) in tabs" :key="idx" v-text="t"></v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <Categories></Categories>
      </v-tab-item>
      <v-tab-item>
        <h1>Таблица Товаров</h1>
      </v-tab-item>
      <v-tab-item>
        <UserCreate></UserCreate>
      </v-tab-item>
    </v-tabs-items>
    <div class="d-flex mt-15">
      <v-spacer></v-spacer>
      <v-btn color="black" dark @click="logout(), $router.push('/products')">Выйти</v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Categories from '@/components/admin/Categories.vue';
import UserCreate from '@/components/admin/UserCreate.vue';

export default {
  name: 'Admin',
  components: {
    Categories,
    UserCreate,
  },
  data: () => ({
    tab: 0,
    tabs: ['Категории', 'Товары', 'Создать пользователя'],
  }),
  computed: {},
  methods: {
    ...mapActions(['logout']),
  },
};
</script>

<style></style>
