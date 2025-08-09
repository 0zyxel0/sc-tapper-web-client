<template>
  <div>
    <!-- 
      Card Container
      Replaces <v-card>. We use standard div with background, shadow, and rounded corners.
    -->
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <!-- 
        Card Header
        Replaces <v-card-title>. We use flexbox to align and distribute items.
      -->
      <div class="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6">
        <div class="flex items-center gap-x-3">
          <Icon name="mdi:credit-card-multiple" class="h-6 w-6 text-gray-500" />
          <h2 class="text-lg font-medium text-gray-900">Cards</h2>
        </div>

        <!-- 
          Search Input
          Replaces <v-text-field>. We build it with a wrapper for the icon.
          - `relative`: Allows absolute positioning of the icon inside.
          - `pl-10`: Input padding on the left to make space for the icon.
        -->
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="mdi:magnify" class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          />
        </div>
      </div>

      <!-- 
        Data Table
        Replaces <v-data-table>. We build this manually.
        `overflow-x-auto` makes the table scroll horizontally on small screens if needed.
      -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table Head -->
          <thead class="bg-gray-50">
            <tr>
              <th
                v-for="header in headers"
                :key="header.key"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {{ header.title }}
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-gray-200 bg-white">
            <!-- No Data State -->
            <tr v-if="filteredList.length === 0">
              <td :colspan="headers.length" class="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
                <div class="flex flex-col items-center gap-2">
                  <span>No data available.</span>
                  <button @click="initialize" class="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Reset
                  </button>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr v-for="item in filteredList" :key="item.cardid" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {{ item.cardid }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ item.profile_publicid }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {{ item.profileid }}
              </td>
              <!-- Actions Column -->
              <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                <div class="flex items-center gap-x-4">
                  <button @click="editItem(item)" class="text-indigo-600 hover:text-indigo-900">
                    <Icon name="mdi:pencil" class="h-5 w-5" />
                  </button>
                  <button @click="deleteItem(item)" class="text-red-600 hover:text-red-900">
                    <Icon name="mdi:delete" class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

definePageMeta({
	layout: "admin",
});

// --- STATE (Unchanged) ---
const search = ref(''); // Initialize with an empty string for safety
const headers = ref([
	{ title: "Card ID", key: "cardid" },
	{ title: "Profile Public ID", key: "profile_publicid" },
	{ title: "Profile ID", key: "profileid" },
	{ title: "Actions", key: "actions", sortable: false },
]);
const profileList = ref([]);

// --- COMPUTED PROPERTY FOR SEARCHING ---
// This is the replacement for v-data-table's built-in search.
const filteredList = computed(() => {
  if (!search.value) {
    return profileList.value;
  }
  return profileList.value.filter(item => {
    // Search across all relevant fields. Convert to lowercase for case-insensitive search.
    const searchTerm = search.value.toLowerCase();
    return (
      item.cardid.toLowerCase().includes(searchTerm) ||
      (item.profile_publicid && item.profile_publicid.toLowerCase().includes(searchTerm)) ||
      (item.profileid && item.profileid.toString().toLowerCase().includes(searchTerm))
    );
  });
});

// --- METHODS (Unchanged) ---
async function initialize() {
	try {
		const { data: card_list } = await useFetch(`/api/getCardList`);
		if (card_list.value) {
			profileList.value = card_list.value;
		}
	} catch (error) {
		console.error("Failed to fetch data: ", error);
	}
}

function editItem(item) {
	console.log("Editing:", item);
}

function deleteItem(item){
	console.log("Deleting:", item);
}

// --- LIFECYCLE HOOK (Unchanged) ---
onMounted(async () => {
	await initialize();
});
</script>
