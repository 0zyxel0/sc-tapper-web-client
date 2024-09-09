<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" class="bg-deep-purple" color="primary" permanent>
      <div>
        <p class="nav-title">Tapper</p>
        <!-- <v-img
          src="/img/sample_logo@2x.png"
          :width="150"
          class="mt-10 ml-4 mb-5"
        ></v-img> -->
<!-- 
        <v-list>
          <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.png" title="Almar Gomez"
            subtitle="active"></v-list-item>
        </v-list>

        <v-divider></v-divider> -->

        <v-list density="compact" nav>
          <v-list-item v-for="(item, i) in items" :key="i" :value="item" :to="item.route" exact>
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
      <!-- <template v-slot:append>
        <div class="mx-5">
          <p class="nav-footer-title">System Name</p>
          <v-btn @click="signOut({ callbackUrl: '/auth/signin' })" class="logout-btn" color="red" block><v-icon
              start>mdi-power</v-icon> Sign out</v-btn>
        </div>
      </template> -->
    </v-navigation-drawer>
    <v-app-bar prominent elevation="0">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        Tapper - ID Management
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup>
const drawer = ref(true);
const items = ref([
  { text: "Dashboard", route: "/admin/", icon: "mdi-view-dashboard" },
  { text: "Cards", route: "/admin/cards", icon: "mdi-credit-card" },
  { text: "Profiles", route: "/admin/profiles", icon: "mdi-badge-account-outline" },
  { text: "Settings", route: "/admin/settings", icon: "mdi-cog-outline" },
]);
</script>

<style scoped>
.nav-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 10px 0;
}

.nav-footer-title {

  font-size: 14px;
  padding: 15px 0;
}

.v-list-item-title {
  font-size: 17px;
  padding: 10px 5px;
}

.logout-btn {
  margin: 0 0 20px 0;
  text-transform: capitalize;
}
</style>