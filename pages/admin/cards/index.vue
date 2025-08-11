<template>
  <div>
    <div class="overflow-hidden rounded-lg bg-white shadow">
      <!-- Card Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-6">
        <div class="flex items-center gap-x-3">
          <i class="mdi mdi-credit-card-multiple text-gray-500 text-xl"></i>
          <h2 class="text-lg font-medium text-gray-900">Cards</h2>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <i class="mdi mdi-magnify text-gray-400 text-lg"></i>
          </div>
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          />
        </div>
      </div>

      <!-- Data Table -->
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
                    <i class="mdi mdi-pencil text-xl"></i>
                  </button>
                  <button @click="deleteItem(item)" class="text-red-600 hover:text-red-900">
                    <i class="mdi mdi-delete text-xl"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Modal -->
    <transition name="fade-modal">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
        <div class="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <!-- Modal Header -->
          <div class="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Edit Card</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="mdi mdi-close text-xl"></i>
            </button>
          </div>

          <!-- Modal Body (Form) -->
          <form @submit.prevent="saveChanges">
            <div class="mb-4">
              <label for="cardId" class="block text-sm font-medium text-gray-700">Card ID</label>
              <input type="text" id="cardId" v-model="editedItem.cardid" readonly
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 cursor-not-allowed">
            </div>
            <div class="mb-4">
              <label for="profilePublicId" class="block text-sm font-medium text-gray-700">Profile Public ID</label>
              <input type="text" id="profilePublicId" v-model="editedItem.profile_publicid"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div class="mb-4">
              <label for="profileId" class="block text-sm font-medium text-gray-700">Profile ID</label>
              <input type="number" id="profileId" v-model.number="editedItem.profileid"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            <div class="mb-4 flex items-center">
              <input type="checkbox" id="isActive" v-model="editedItem.is_active"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
              <label for="isActive" class="ml-2 block text-sm text-gray-900">Is Active</label>
            </div>
            <!-- Display other read-only fields if desired -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Document ID</label>
              <p class="mt-1 text-sm text-gray-900">{{ editedItem.documentId }}</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Created At</label>
              <p class="mt-1 text-sm text-gray-900">{{ new Date(editedItem.createdAt).toLocaleString() }}</p>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Updated At</label>
              <p class="mt-1 text-sm text-gray-900">{{ new Date(editedItem.updatedAt).toLocaleString() }}</p>
            </div>
            <!-- Add other fields (publishedAt, locale) as read-only if you want them visible -->


            <!-- Modal Footer (Buttons) -->
            <div class="flex justify-end gap-x-3 pt-4 border-t border-gray-200">
              <button type="button" @click="closeModal"
                class="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

definePageMeta({
	layout: "admin",
});

// --- STATE ---
const search = ref('');
const headers = ref([
	{ title: "Card ID", key: "cardid" },
	{ title: "Profile Public ID", key: "profile_publicid" },
	{ title: "Profile ID", key: "profileid" },
	{ title: "Actions", key: "actions", sortable: false },
]);
const profileList = ref([]);

// Modal specific state
const isModalOpen = ref(false);
const editedItem = ref(null); // Stores the item data being edited

// --- COMPUTED PROPERTY FOR SEARCHING ---
const filteredList = computed(() => {
  if (!search.value) {
    return profileList.value;
  }
  return profileList.value.filter(item => {
    const searchTerm = search.value.toLowerCase();
    return (
      item.cardid.toLowerCase().includes(searchTerm) ||
      (item.profile_publicid && item.profile_publicid.toLowerCase().includes(searchTerm)) ||
      (item.profileid && item.profileid.toString().toLowerCase().includes(searchTerm))
    );
  });
});

// --- METHODS ---
async function initialize() {
	try {
		// Replace with your actual API endpoint for cards
		const { data: card_list } = await useFetch(`/api/getCardList`);
		if (card_list.value) {
			profileList.value = card_list.value;
		}
	} catch (error) {
		console.error("Failed to fetch data: ", error);
		// You might want to add a snackbar/toast here for the user
	}
}

function editItem(item) {
	// Create a deep copy of the item to prevent direct mutation
	// This is important so changes in the modal don't affect the table
	// until you explicitly save them.
	editedItem.value = { ...item };
	isModalOpen.value = true;
}

async function saveChanges() {
  // This is where you would send the updated data to your backend API
  console.log("Saving changes for:", editedItem.value);

  try {
    // Example API call (you'll need to adjust this to your actual API)
    // Assuming you have an endpoint like /api/cards/:id for PUT requests
    // And assuming you have a way to get your backend URL, e.g., useUtils().getBackendUrl()
    // const backendUrl = await useUtils().getBackendUrl(); // If you have a useUtils
    // const response = await $fetch(`${backendUrl}/api/cards/${editedItem.value.id}`, {
    //   method: 'PUT',
    //   body: editedItem.value, // Send the entire editedItem object
    // });

    // For demonstration, let's simulate an update in the local list
    const index = profileList.value.findIndex(item => item.id === editedItem.value.id);
    if (index !== -1) {
      profileList.value[index] = { ...editedItem.value }; // Update the original item in the list
    }

    console.log("Changes saved successfully (simulated).");
    // Optionally re-fetch data to ensure consistency with backend
    // await initialize();

    closeModal(); // Close the modal after successful save
    // Show a success snackbar/toast
  } catch (error) {
    console.error("Failed to save changes:", error);
    // Show an error snackbar/toast
  }
}

function deleteItem(item){
	console.log("Deleting:", item);
	// Implement actual delete logic (e.g., confirmation dialog, API call)
}

function closeModal() {
  isModalOpen.value = false;
  editedItem.value = null; // Clear edited item data
}

// --- LIFECYCLE HOOK ---
onMounted(async () => {
	await initialize();
});
</script>

<style scoped>
/* Spinner for loading state on buttons (from your signin page) */
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: -0.125em;
  border: 0.125em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: .75s linear infinite spinner-border;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

/* Modal fade transition */
.fade-modal-enter-active, .fade-modal-leave-active {
  transition: opacity 0.3s ease;
}
.fade-modal-enter-from, .fade-modal-leave-to {
  opacity: 0;
}
</style>