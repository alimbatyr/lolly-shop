<template>
  <v-app>
    <component :is="layout" />
  </v-app>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';

export default {
  name: 'App',

  components: {
    MainLayout,
  },

  computed: {
    layout() {
      return (this.$route.meta.layout || 'main') + '-layout';
    },
  },

  async mounted() {
    await this.$store.dispatch('verify_token');
  }
};
</script>
