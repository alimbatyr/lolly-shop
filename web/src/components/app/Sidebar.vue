<template>
  <v-navigation-drawer app permanent :mini-variant="mini" clipped>
    <v-list>
      <v-list-group prepend-icon="mdi-view-dashboard" color="black" dark>
        <template v-slot:activator>
          <v-list-item-title color="black">Категории</v-list-item-title>
        </template>

        <v-list-item
          v-for="category in available_categories"
          :key="category.category_id"
          @click="set_filters({ category })"
        >
          <v-list-item-title v-text="category.name"></v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-group prepend-icon="mdi-filter" color="black" :value="true">
        <template v-slot:activator>
          <v-list-item-title>Сортировка</v-list-item-title>
        </template>
        <v-list-item v-for="(item, index) in sort" :key="index" @click="set_sort_order(index)">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-icon>
            <v-icon v-text="item.order == 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'" small></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data: () => ({
    filters: [],
  }),
  computed: {
    ...mapGetters('product', ['available_categories', 'sort']),
    mini() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
  methods: {
    ...mapActions('product', ['set_sort_order', 'set_filters']),
  },
  async created() {
    await this.$store.dispatch('product/categories_get');
  },
};
</script>
