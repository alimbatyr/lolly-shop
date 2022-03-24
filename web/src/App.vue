<template>
  <v-app>
    <component :is="layout" />
  </v-app>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

export default {
  name: 'App',

  components: {
    MainLayout,
    DefaultLayout,
  },

  computed: {
    layout() {
      return (this.$route.meta.layout || 'default') + '-layout';
    },
  },
};
</script>
