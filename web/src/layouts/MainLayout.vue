<template>
  <div class="wrapper">
    <Navbar />
    <v-main>
      <v-container>
        <Sidebar />
        <router-view />
      </v-container>
    </v-main>
  </div>
</template>

<script>
import Sidebar from '@/components/app/Sidebar';
import Navbar from '@/components/app/Navbar';

export default {
  name: 'MainLayout',
  components: {
    Navbar,
    Sidebar,
  },
};
</script>

<style>
.wrapper {
  height: 100vh;
  width: 100%;
}

.main-container {
  padding: 1.5em 2em;
}
</style>
