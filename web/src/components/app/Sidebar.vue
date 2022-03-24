<template>
  <v-navigation-drawer permanent app fixed :mini-variant="mini">
    <v-list height="64">
      <v-list-item>
        <v-list-item-icon class="mr-4">

        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">Lolly-Shop</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list dense nav>
      <!-- <v-list-item-group v-model="selectedItem" color="primary">
        <v-list-item v-for="item in items" :key="item.title" link exact :to="item.to">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
  }),
  computed: {
    mini() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
};
</script>
