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
          <v-btn @click="logout()" class="logout-btn" color="red" block><v-icon
              start>mdi-power</v-icon> Sign out</v-btn>
        </div>
      </template> -->
    </v-navigation-drawer>
    <v-app-bar prominent elevation="0">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        Tapper - ID Management
      </v-toolbar-title>
      <div class="mr-2">
        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" variant="tonal">
              <v-avatar color="deep-purple" size="large">
                <v-icon icon="mdi-account-circle" color="white"></v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="deep-purple">
                  <v-icon icon="mdi-account-circle"></v-icon>
                </v-avatar>
                <h3 class="mt-2">{{ userInfo.username }}</h3>
                <p class="text-caption mt-1">{{ userInfo.email }}</p>
                
                <v-divider class="my-3"></v-divider>
                <v-btn
                  prepend-icon="mdi-logout"
                  variant="text"
                  class="text-capitalize"
                  rounded
                  @click="logout()"
                >
                  Logout
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
        </div>
    </v-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

  </v-app>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
const router = useRouter();
const { logUserOut } = useMyAuthStore();
const { authenticated } = storeToRefs(useMyAuthStore());
const { userData } = storeToRefs(useMyAuthStore());

const userInfo = ref(userData?.value.user);
const drawer = ref(true);
const items = ref([
  { text: "Dashboard", route: "/admin/", icon: "mdi-view-dashboard" },
  { text: "Cards", route: "/admin/cards", icon: "mdi-credit-card" },
  { text: "Profiles", route: "/admin/profiles", icon: "mdi-badge-account-outline" },
  { text: "Settings", route: "/admin/settings", icon: "mdi-cog-outline" },
]);

async function logout() {
  logUserOut();
  router.push("/auth/signin");
}
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