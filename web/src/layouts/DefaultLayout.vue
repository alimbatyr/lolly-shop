<template>
  <div>
    <Navbar />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar.vue';
export default {
  components: { Navbar },
  name: 'DefaultLayout',
};
</script>
