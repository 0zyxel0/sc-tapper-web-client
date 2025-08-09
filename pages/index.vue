<template>
	<!-- v-app equivalent: full screen container -->
	<div class="min-h-screen bg-gray-900 text-white p-4">
		<!-- v-theme-provider theme="dark" with-background (handled by parent div bg-gray-900 and text-white) -->

		<!-- Top Row -->
		<div class="flex flex-col items-center mb-4">
			<div class="w-full">
				<!-- v-card class="top-container" -->
				<div class="bg-gray-800 rounded-lg shadow-lg p-5 w-full">
					<div class="flex flex-wrap justify-center items-center text-center mb-5">
						<div class="w-1/2 sm:w-1/3 md:w-1/6 px-2 mb-4 sm:mb-0">
							<span class="text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase block">
								<NuxtTime :datetime="Date.now()" year="numeric" month="long" day="numeric" />
							</span>
						</div>
						<div class="w-1/2 sm:w-1/3 md:w-1/6 px-2">
							<span class="text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase block">
								<NuxtTime :datetime="date" hourCycle="h12" hour="numeric" minute="numeric" second="numeric" />
							</span>
						</div>
					</div>

					<div class="flex items-center justify-center">
						<!-- v-card v-if="!currentProfile" -->
						<div v-if="!currentProfile" class="bg-gray-800 rounded-lg text-center">
							<img class="w-[60vh] h-[60vh] object-cover rounded-md border-5 border-gray-700 mx-auto"
								src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" alt="Waiting for scan" />
							<h2 class="text-2xl sm:text-3xl md:text-4xl font-semibold mt-5 mb-5 text-center">
								{{ cardMessage }}
							</h2>
						</div>
						<!-- v-card v-else -->
						<div v-else class="bg-gray-800 rounded-lg text-center">
							<img class="w-[60vh] h-[60vh] object-cover rounded-md border-4 border-white mx-auto"
								:src="currentPhoto" alt="Profile Photo" />
							<!-- v-card elevation="0" -->
							<div class="bg-gray-800 mt-4">
								<!-- v-table -->
								<table class="w-full text-left text-white">
									<tbody>
										<tr>
											<td class="px-2 py-1 text-base uppercase">Student No:</td>
											<td class="px-2 py-1 text-lg uppercase font-bold">{{ currentProfile?.profile.studentno }}</td>
										</tr>
										<tr>
											<td class="px-2 py-1 text-base uppercase">Name:</td>
											<td class="px-2 py-1 text-lg uppercase font-bold">{{ currentProfile?.profile.first_name }} {{ currentProfile.profile.last_name }}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Bottom Row -->
		<div class="flex flex-col mt-4">
			<!-- v-card class="bottom-container" -->
			<div class="bg-gray-800 rounded-lg shadow-lg p-4 w-full">
				<div class="mt-2">
					<div class="flex flex-wrap justify-center">
						<div class="w-full text-center" v-if="isSubmitting == false">
							<!-- v-form -->
							<form @submit.prevent="handleSubmit">
								<!-- v-text-field -->
								<input type="text" ref="cardInputRef" v-model="cardid" placeholder="Card ID"
									:disabled="isSubmitting"
									class="w-full p-3 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</form>
						</div>
						<div v-else class="w-full text-center py-4">
							<!-- v-progress-circular -->
							<div class="spinner-circular mx-auto"></div>
							<hr class="my-6 border-t border-gray-600" />
						</div>
					</div>
				</div>
				<div class="flex flex-wrap justify-center">
					<div class="w-full">
						<!-- v-infinite-scroll (manual horizontal scrolling) -->
						<div class="overflow-x-auto whitespace-nowrap py-2">
							<div v-for="item in gateStore.getGateHistoryList" :key="item.id" class="inline-block p-1">
								<div v-if="item" class="w-[120px] bg-gray-700 rounded-lg shadow-sm text-center p-2">
									<img class="h-[90px] w-full object-contain mx-auto" :src="item?.profile_avatar" alt="Profile" />
									<div class="text-sm text-gray-200 mt-2 truncate">{{ item?.profileid }}</div>
								</div>
							</div>
							<!-- Loading indicator for infinite scroll (manual) -->
							<div v-if="gateStore.isLoadingHistory" class="inline-block p-2 text-gray-400">...</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import axios from "axios";
const config = useRuntimeConfig();
// Composable utility function import
const { getBackendUrl, formatCurImageUrl, getImageServerUrl } = useUtils();
const base_url = config.public.apiBase; // Used in original, but formatCurImageUrl usually handles it.
import { useGateStore } from "~/stores/gate";
const gateStore = useGateStore();

const cardid = ref(null);
const currentProfile = ref(null);
const currentPhoto = ref(null);
const isSubmitting = ref(false);
const cooldownTimer = ref(null);
const submitCooldown = 2000; // 2 seconds in milliseconds
const cardInputRef = ref(null); // Ref for the card ID input field
const date = ref(new Date()); // For NuxtTime component
const cardMessage = ref("Scanner Ready");

async function initialize() {
	try {
		await gateStore.getGateHistory();
	} catch (err) {
		console.error("Error initializing gate history:", err);
	}
}

// Function to update the date for NuxtTime (setInterval already handles this)
const changeDate = () => {
	date.value = Date.now();
};

// Function to clear the displayed profile details
async function clearProfileReading() {
	currentProfile.value = null;
	currentPhoto.value = null; // Also clear the photo
}

// Function to search for profile by card ID
async function searchCardProfile(id) {
	try {
		const baseUrl = await getBackendUrl(); // Ensure this returns the correct base URL for your API
		if (baseUrl) {
			const myResult = await axios.get(`${baseUrl}/api/card/search-card/${id}`);
			if (myResult.data && myResult.data.length > 0) {
				return myResult.data[0];
			} else {
				cardMessage.value = "Card Not Registered. Please Try Again";
				return false; // Indicate not found
			}
		}
	} catch (err) {
		console.error("Error searching card profile:", err);
		cardMessage.value = "Error searching card. Please try again."; // General error message
		return false; // Indicate error
	}
}

// Handles form submission (when card ID is entered)
async function handleSubmit() {
	if (isSubmitting.value) return; // Prevent multiple submissions during cooldown

	isSubmitting.value = true;
	clearTimeout(cooldownTimer.value); // Clear any existing cooldown

	if (!cardid.value || cardid.value.trim() === "") {
		cardMessage.value = "Please scan a card.";
		startCooldown();
		return;
	}

	try {
		const myProfileDetails = await searchCardProfile(cardid.value.trim());

		if (myProfileDetails) {
			currentProfile.value = myProfileDetails;
			const baseUrl = await getImageServerUrl(); // Get image server URL
			currentPhoto.value = formatCurImageUrl(baseUrl, myProfileDetails.profile.image_url);
			cardMessage.value = "Welcome!"; // Or a dynamic message based on in/out
			clearInput(); // Clear input field
			
			// Refresh History
			await gateStore.getGateHistory(); // Assuming this updates gateStore.getGateHistoryList

		} else {
			// If myProfileDetails is false (card not registered or error)
			clearProfileReading(); // Clear any previous profile display
			// cardMessage already set by searchCardProfile
		}
	} catch (error) {
		console.error("Submission failed:", error);
		cardMessage.value = "Submission failed. Please try again.";
	} finally {
		startCooldown(); // Always start cooldown after processing
	}
}

// Clears the card ID input field
function clearInput() {
	cardid.value = "";
}

// Starts a cooldown timer before resetting UI state
function startCooldown() {
	clearTimeout(cooldownTimer.value); // Ensure no duplicate timers
	cooldownTimer.value = setTimeout(() => {
		isSubmitting.value = false;
		cooldownTimer.value = null;
		clearInput();
		clearProfileReading();
		cardMessage.value = "Scanner Ready";
	}, submitCooldown);
}

// Watch for isSubmitting to focus the input field when ready
watch(isSubmitting, () => {
	if (!isSubmitting.value) {
		nextTick(() => {
			if (cardInputRef.value) {
				cardInputRef.value.focus();
			} else {
				console.warn('Ref "cardInputRef" is not available for focusing the input field.');
			}
		});
	}
});

// Clear cooldown timer on component unmount
onBeforeUnmount(() => {
	clearTimeout(cooldownTimer.value);
});

// On component mount, start time updates and initialization
onMounted(() => {
	setInterval(() => {
		date.value = new Date(); // Update date ref directly with new Date object
	}, 1000); // Update every second
	initialize();
	nextTick(() => {
		if (cardInputRef.value) {
			cardInputRef.value.focus();
		}
	});
});
</script>

<style scoped>
/* Custom spinner for loading state */
.spinner-circular {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #8B5CF6; /* Tailwind purple-500 */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom styles for image and text based on original Vuetify CSS */
.border-5 {
  border-width: 5px;
}

/* Responsive adjustments using Tailwind's arbitrary values or JIT mode */
/* Equivalent to .nuxt-img */
.w-\[60vh\] {
  width: 60vh;
}
.h-\[60vh\] {
  height: 60vh;
}

/* Media queries from original CSS for smaller screens */
@media only screen and (max-width: 820px) {
  /* .top-container equivalent */
  .bg-gray-800.rounded-lg.shadow-lg.p-5 {
    height: 73vh;
  }

  /* .bottom-container equivalent */
  .bg-gray-800.rounded-lg.shadow-lg.p-4 {
    height: 23vh;
  }

  /* .nuxt-date, .nuxt-time equivalent */
  .text-xl.sm\:text-2xl.md\:text-3xl.lg\:text-4xl {
    font-size: 4vw;
  }

  /* .nuxt-img equivalent */
  .w-\[60vh\] {
    width: 50vh;
  }
  .h-\[60vh\] {
    height: 50vh;
  }

  /* .waiting-title equivalent */
  .text-2xl.sm\:text-3xl.md\:text-4xl {
    font-size: 4vw;
  }

  /* .studentno-title, .studentno-value, .student-name-title, .student-name-value equivalent */
  .text-base, .text-lg { /* Targeting original Vuetify font sizes */
    font-size: 25px; /* Directly setting to 25px for smaller screens */
  }
}
</style>