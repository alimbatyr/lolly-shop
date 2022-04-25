<template>
  <v-navigation-drawer
    app
    permanent
    :mini-variant="mini"
    clipped
    :expand-on-hover="mini"
  >
    <v-list>
      <v-list-group prepend-icon="mdi-view-dashboard" color="black" dark>
        <template v-slot:activator>
          <v-list-item-title color="black">Категории</v-list-item-title>
        </template>

        <v-list-item @click="clear_filter_categories">
          <v-list-item-title>Все</v-list-item-title>
          <v-list-item-icon v-if="filter_categories.length == 0">
            <v-icon small>mdi-check</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          v-for="category in available_categories"
          :key="category.category_id"
          @click="toggle_category(category.category_id)"
        >
          <v-list-item-title v-text="category.name"></v-list-item-title>
          <v-list-item-icon v-if="filter_categories.includes(category.category_id)">
            <v-icon small>mdi-check</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>

      <v-list-group prepend-icon="mdi-filter" color="black" :value="true">
        <template v-slot:activator>
          <v-list-item-title>Сортировка</v-list-item-title>
        </template>
        <v-list-item v-for="(item, index) in sort" :key="index" @click="sort_by_field(item.field)">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-title v-text="item.name"></v-list-item-title>
          <v-list-item-icon v-if="current_sort_field == item.field">
            <v-icon
              v-text="current_sort_direction == 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down'"
            ></v-icon>
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
    drawer: false,
  }),
  computed: {
    ...mapGetters('product', [
      'available_categories',
      'sort',
      'current_sort_field',
      'current_sort_direction',
      'filter_categories',
    ]),
    mini() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
  methods: {
    ...mapActions('product', ['sort_by_field', 'toggle_category', 'clear_filter_categories']),
  },
};
</script>
