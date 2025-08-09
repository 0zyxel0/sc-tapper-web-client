<template>
  <div class="p-4 sm:p-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Total Records Cards -->
      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <i class="mdi mdi-account-group text-5xl text-indigo-500 mb-2"></i>
        <p class="text-5xl font-bold text-gray-900">{{ dashboardStats.totalStudents }}</p>
        <p class="text-lg text-gray-500">Total Students</p>
      </div>

      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <i class="mdi mdi-credit-card-multiple text-5xl text-green-500 mb-2"></i>
        <p class="text-5xl font-bold text-gray-900">{{ dashboardStats.totalCards }}</p>
        <p class="text-lg text-gray-500">Total Cards</p>
      </div>

      <div class="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center">
        <i class="mdi mdi-gate text-5xl text-purple-500 mb-2"></i>
        <p class="text-5xl font-bold text-gray-900">{{ dashboardStats.totalGateEntries }}</p>
        <p class="text-lg text-gray-500">Total Gate Entries</p>
      </div>

      <!-- Recent Gate Activity Card -->
      <div class="md:col-span-2 lg:col-span-1 bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Gate Activity</h2>
        <div v-if="recentGateHistory.length === 0" class="text-center text-gray-500 py-4">
          No recent activity to display.
        </div>
        <ul v-else class="space-y-3">
          <li v-for="(entry, index) in recentGateHistory" :key="index"
              class="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
            <div>
              <p class="font-medium text-gray-900">{{ entry.name }}</p>
              <p class="text-sm text-gray-500">Student No: {{ entry.studentNo }}</p>
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
            <div
              class="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              :style="{ width: cardAvailabilityPercentage + '%' }"
            ></div>
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
import { ref, onMounted, computed } from 'vue';

definePageMeta({
  layout: "admin",
});

// --- Sample Data (Replace with API Calls) ---

// Dashboard Stats
const dashboardStats = ref({
  totalStudents: 0,
  totalCards: 0,
  totalGateEntries: 0,
});

// Recent Gate History
const recentGateHistory = ref([]);

// Card Availability Stats
const cardStats = ref({
  totalCardsInSystem: 0,
  issuedCards: 0, // Cards that have been assigned to a profile
  availableCards: 0, // Calculated: totalCardsInSystem - issuedCards
});

// --- Computed Properties ---

const cardAvailabilityPercentage = computed(() => {
  if (cardStats.value.totalCardsInSystem === 0) return 0;
  return (cardStats.value.availableCards / cardStats.value.totalCardsInSystem) * 100;
});

// --- Data Fetching / Initialization ---
onMounted(async () => {
  // Simulate fetching data
  // In a real application, you would make API calls here:
  // const { data: statsData } = await useFetch('/api/dashboard/stats');
  // const { data: historyData } = await useFetch('/api/dashboard/recent-history');
  // const { data: cardData } = await useFetch('/api/dashboard/card-stats');

  // Assign simulated data
  dashboardStats.value = {
    totalStudents: 1250,
    totalCards: 1500,
    totalGateEntries: 58763,
  };

  recentGateHistory.value = [
    { name: 'John Doe', studentNo: '20230001', timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleString() },
    { name: 'Jane Smith', studentNo: '20230005', timestamp: new Date(Date.now() - 12 * 60 * 1000).toLocaleString() },
    { name: 'Michael Lee', studentNo: '20230010', timestamp: new Date(Date.now() - 25 * 60 * 1000).toLocaleString() },
    { name: 'Emily Chen', studentNo: '20230012', timestamp: new Date(Date.now() - 40 * 60 * 1000).toLocaleString() },
    { name: 'David Kim', studentNo: '20230018', timestamp: new Date(Date.now() - 70 * 60 * 1000).toLocaleString() },
  ];

  cardStats.value.totalCardsInSystem = 2000; // Total inventory of cards
  cardStats.value.issuedCards = 1450; // How many are currently assigned/in use
  cardStats.value.availableCards = cardStats.value.totalCardsInSystem - cardStats.value.issuedCards;
});
</script>

<style scoped>
/* No specific styles needed here, as all styling is handled by Tailwind utility classes. */
/* The spinner-border class is assumed to be defined globally or in a common stylesheet */
</style>