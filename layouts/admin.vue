<template>
  <div class="flex h-screen bg-gray-100">
    <aside
      class="flex w-64 flex-col bg-indigo-800 text-white transition-transform duration-300 ease-in-out"
      :class="drawer ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Sidebar Header -->
      <div class="py-4 text-center">
        <p class="text-xl font-bold">Tapper</p>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-grow px-2">
        <ul>
          <li v-for="item in items" :key="item.text">
            <NuxtLink
              :to="item.route"
              class="flex items-center gap-x-3 rounded-md px-3 py-3 text-sm font-medium text-indigo-200 hover:bg-indigo-700 hover:text-white"
              exact-active-class="bg-indigo-900 text-white"
            >
              <!-- Replaced Icon component with <i> tag -->
              <!-- Dynamically constructs MDI class from item.icon string -->
              <i :class="['text-xl', 'mdi', item.icon.replace('mdi:', '')]"></i>
              <span>{{ item.text }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Area (Header + Page) -->
    <div class="flex flex-1 flex-col">
      <!-- 
        Top Header Bar
        Replaces <v-app-bar>
      -->
      <header class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 shadow-sm">
        <!-- Left side: Hamburger Menu and Title -->
        <div class="flex items-center gap-x-4">
          <!-- 
            Hamburger Icon to toggle the drawer
            Replaces <v-app-bar-nav-icon>
          -->
          <button @click="drawer = !drawer" class="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800">
            <!-- Replaced Icon component with <i> tag -->
            <i class="mdi mdi-menu text-2xl"></i>
          </button>
          <h1 class="text-lg font-semibold text-gray-800">Tapper - ID Management</h1>
        </div>

        <!-- User Dropdown Menu Trigger -->
        <div class="relative" ref="menuContainer">
          <!-- The button that activates the menu -->
          <button @click="isMenuOpen = !isMenuOpen" class="flex items-center justify-center rounded-full h-10 w-10 bg-indigo-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <!-- Replaced Icon component with <i> tag -->
            <i class="mdi mdi-account-circle text-3xl"></i>
          </button>

          <!-- User Dropdown Menu Content -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isMenuOpen"
              class="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="p-4 text-center">
                <!-- Replaced Icon component with <i> tag -->
                <i class="mdi mdi-account-circle mx-auto text-6xl text-indigo-600"></i>
                <h3 class="mt-2 text-lg font-semibold text-gray-900">{{ userInfo.username }}</h3>
                <p class="mt-1 text-sm text-gray-500">{{ userInfo.email }}</p>
                <hr class="my-3" />
                <button
                  @click="logout"
                  class="flex w-full items-center justify-center gap-x-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <!-- Replaced Icon component with <i> tag -->
                  <i class="mdi mdi-logout text-xl"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </header>

      <!-- Main Content Slot -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia";
import { useMyAuthStore } from "~/stores/auth";
import { onClickOutside } from '@vueuse/core';

// --- State from original script ---
const router = useRouter();
const { logUserOut } = useMyAuthStore();
const { authenticated, userData } = storeToRefs(useMyAuthStore());
// Ensure userInfo is reactive and defaults to an object if userData.value is null/undefined
const userInfo = computed(() => userData.value?.user || { username: 'Guest', email: 'N/A' });


// --- State for UI components ---
const drawer = ref(true); // Controls the sidebar visibility
const isMenuOpen = ref(false); // Controls the user dropdown menu visibility
const menuContainer = ref(null); // A template ref for the menu container div

const items = ref([
  // Updated icon names to be just the MDI suffix
  { text: "Dashboard", route: "/admin/", icon: "mdi:view-dashboard" },
  { text: "Cards", route: "/admin/cards", icon: "mdi:credit-card" },
  { text: "Profiles", route: "/admin/profiles", icon: "mdi:badge-account-outline" },
  { text: "Reports", route: "/admin/reporting", icon: "mdi:chart-bar" },
  { text: "Settings", route: "/admin/settings", icon: "mdi:cog-outline" },
]);

// --- Logic ---
async function logout() {
  isMenuOpen.value = false; // Close menu on logout
  logUserOut();
  router.push("/auth/login");
}

// Use VueUse's onClickOutside to close the menu when clicking elsewhere on the page
onClickOutside(menuContainer, () => {
  isMenuOpen.value = false;
});
</script>

<style>
/* 
  No specific styles needed here, as all styling is handled by Tailwind utility classes
  and the MDI font CDN.
*/
</style>