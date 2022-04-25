<template>
  <v-app>
    <component :is="layout" />
    <Add2CartDialog></Add2CartDialog>
  </v-app>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import Add2CartDialog from '@/components/products/Add2CartDialog.vue';

export default {
  name: 'App',

  components: {
    MainLayout,
    Add2CartDialog,
  },

  computed: {
    layout() {
      return (this.$route.meta.layout || 'main') + '-layout';
    },
  },

  async mounted() {
    await this.$store.dispatch('verify_token');
    await this.$store.dispatch('product/init');
  }
};
</script>
