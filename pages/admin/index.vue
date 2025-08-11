<template>
  <div class="p-4 sm:p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

    <!-- Loading State -->
    <div v-if="pending" class="text-center py-10">
      <p class="text-xl text-gray-600">Loading dashboard data...</p>
      <!-- Optional: Add a simple spinner -->
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mt-4"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10 text-red-600">
      <p class="text-xl">Error loading dashboard data: {{ error.message }}</p>
      <p class="text-gray-500">Please try again later.</p>
    </div>

    <!-- No Data State -->
    <div v-else-if="!dashboardData" class="text-center py-10 text-gray-500">
      <p class="text-xl">No dashboard data available.</p>
    </div>

    <!-- Main Content (when data is loaded) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Total Records Cards -->
      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <i class="mdi mdi-account-group text-5xl text-indigo-500 mb-2"></i>
        <p class="text-5xl font-bold text-gray-900">{{ dashboardStats.totalProfiles }}</p>
        <p class="text-lg text-gray-500">Total Profiles</p>
      </div>

      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <i class="mdi mdi-credit-card-multiple text-5xl text-green-500 mb-2"></i>
        <p class="text-5xl font-bold text-gray-900">{{ dashboardStats.totalCards }}</p>
        <p class="text-lg text-gray-500">Total Cards in System</p>
      </div>

      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <i class="mdi mdi-gate text-5xl text-purple-500 mb-2"></i>
        <p class="text-5xl font-bold text-gray-900">{{ dashboardStats.totalRecentGateEntries }}</p>
        <p class="text-lg text-gray-500">Recent Gate Entries</p>
      </div>

      <!-- Recent Gate Activity Card -->
      <div class="md:col-span-2 lg:col-span-1 bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Gate Activity</h2>
        <div v-if="recentGateHistory.length === 0" class="text-center text-gray-500 py-4">
          No recent activity to display.
        </div>
        <ul v-else class="space-y-3">
          <li v-for="entry in recentGateHistory" :key="entry.id"
            class="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <!-- Avatar -->
            <img v-if="entry.avatar && entry.avatar !== '/uploads/'" :src="entry.avatar" alt="Profile Avatar"
              class="w-10 h-10 rounded-full object-cover border border-gray-200" />
            <div v-else
              class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
              <i class="mdi mdi-account text-xl"></i>
            </div>

            <div class="flex-grow">
              <p class="font-medium text-gray-900">{{ entry.name }}</p>
              <p class="text-sm text-gray-500">{{ entry.studentNo }}</p>
            </div>
            <p class="text-sm text-gray-500 text-right">{{ entry.timestamp }}</p>
          </li>
        </ul>
      </div>

      <!-- Card Availability Card -->
      <div class="lg:col-span-2 bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Card Availability</h2>
        <div class="flex flex-col items-center">
          <p class="text-5xl font-bold text-gray-900">{{ cardStats.availableCards }}</p>
          <p class="text-lg text-gray-500">of {{ cardStats.totalCardsInSystem }} Available</p>

          <div class="w-full bg-gray-200 rounded-full h-3 mt-4 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500 ease-out" :class="{
              'bg-green-500': cardAvailabilityPercentage > 50,
              'bg-yellow-500': cardAvailabilityPercentage <= 50 && cardAvailabilityPercentage > 20,
              'bg-red-500': cardAvailabilityPercentage <= 20,
            }" :style="{ width: cardAvailabilityPercentage + '%' }"></div>
          </div>
          <p class="text-sm text-gray-500 mt-2">
            {{ cardAvailabilityPercentage.toFixed(1) }}% Available
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
definePageMeta({
  layout: "admin",
});

// --- Data Fetching with useFetch ---
// For a real API call:
// const { data: dashboardData, pending, error } = await useFetch(API_URL);

// For simulating the provided data directly (remove this if using a real API):
const dashboardData = ref(null);
const pending = ref(true);
const error = ref(null);

onMounted(async () => {
  const { data } = await axios.get('/api/reports/fetchDashboardStats');
  dashboardData.value = data;
  pending.value = false;
});
// End of simulation code. Remove this onMounted block if using a real API.


// --- Reactive State for Display ---
const dashboardStats = ref({
  totalProfiles: 0,
  totalCards: 0,
  totalRecentGateEntries: 0,
});

const recentGateHistory = ref([]);

const cardStats = ref({
  totalCardsInSystem: 0,
  issuedCards: 0,
  availableCards: 0,
});

// --- Watch for fetched data and populate reactive refs ---
watch(dashboardData, (newData) => {
  if (newData) {
    // Populate Dashboard Stats
    dashboardStats.value.totalProfiles = newData.totalProfiles;
    dashboardStats.value.totalCards = newData.totalCards;
    dashboardStats.value.totalRecentGateEntries = newData.gateActivity?.length || 0; // Count of recent entries

    // Populate Recent Gate History
    recentGateHistory.value = newData.gateActivity?.map(entry => ({
      id: entry.id, // Use actual ID from data
      name: `Card ID: ${entry.cardid}`, // Use card ID as the main name
      studentNo: `Profile ID: ${entry.profileid} (${entry.profile_publicid.substring(0, 8)}...)`, // Use profile ID and a snippet of public ID
      timestamp: new Date(entry.createdAt).toLocaleString(),
      avatar: entry.profile_avatar,
    })) || [];

    // Populate Card Availability Stats
    cardStats.value.totalCardsInSystem = newData.totalCards;
    cardStats.value.issuedCards = newData.usedCards;
    cardStats.value.availableCards = newData.totalCards - newData.usedCards;
  }
}, { immediate: true }); // `immediate: true` runs the watch callback immediately on component mount

// --- Computed Property for Card Availability Percentage ---
const cardAvailabilityPercentage = computed(() => {
  if (cardStats.value.totalCardsInSystem === 0) return 0;
  return (cardStats.value.availableCards / cardStats.value.totalCardsInSystem) * 100;
});
</script>
