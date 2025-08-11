<template>
	<div class="p-4">
		<div class="flex flex-col">
			<div class="w-full">
				<button @click="dialog = true"
					class="mb-4 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors normal-case font-semibold">
					Add Record
				</button>

				<div class="bg-white rounded-lg shadow-sm">
					<div class="flex items-center justify-between p-4 border-b border-gray-200">
						<div class="flex items-center">
							<i class="mdi mdi-account text-2xl mr-2"></i>
							<h2 class="text-xl font-semibold">Profiles</h2>
						</div>

						<div class="relative w-64">
							<input type="text" v-model="search" placeholder="Search"
								class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
							<i class="mdi mdi-magnify absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
						</div>
					</div>

					<hr class="border-t border-gray-200" />

					<!-- Custom Data Table -->
					<div class="overflow-x-auto">
						<table class="min-w-full bg-white border-collapse">
							<thead>
								<tr>
									<th v-for="header in headers" :key="header.key"
										:class="['px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', { 'text-right': header.align === 'end' }]">
										{{ header.title }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="item in filteredProfileList" :key="item.publicid"
									class="border-b border-gray-200 hover:bg-gray-50">
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{{ item.studentno }}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<img :src="item.image_url" alt="Profile Photo"
											class="w-11 h-11 rounded-full object-cover border border-gray-200" />
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{{ item.last_name }}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{{ item.first_name }}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{{ item.middle_name }}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<i v-if="item.is_card_assign === false"
											class="mdi mdi-smart-card-off text-gray-400 text-3xl"></i>
										<i v-else class="mdi mdi-smart-card text-purple-600 text-3xl"></i>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<NuxtLink :to="`profiles/${item.publicid}`"
											class="text-purple-600 hover:text-purple-900 mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
											<i class="mdi mdi-open-in-new text-xl"></i>
										</NuxtLink>
										<button @click="showDeleteProfileDialog(item)"
											class="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
											<i class="mdi mdi-delete text-xl"></i>
										</button>
									</td>
								</tr>
								<tr v-if="filteredProfileList.length === 0">
									<td :colspan="headers.length" class="px-6 py-4 text-center text-gray-500">
										No records found.
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<!-- DIALOG BOX (Add Record) -->
		<div v-if="dialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-3xl w-full">
				<div class="p-4 border-b border-gray-200">
					<h3 class="text-lg font-semibold text-gray-800">Add Record</h3>
				</div>
				<hr class="my-4 border-t border-gray-200" />
				<div class="p-6">
					<div class="flex flex-col md:flex-row gap-6">
						<!-- Image Upload Column -->
						<div class="w-full md:w-1/3 flex flex-col items-center">
							<img :src="avatarImage ? imagePreviewURL : 'https://fakeimg.pl/400x400?text=Photo'"
								alt="Profile Photo"
								class="w-full h-40 object-cover rounded-md border border-gray-200" />

							<!-- Custom file input button -->
							<button type="button" @click="onButtonClick" :disabled="isSelecting"
								class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md flex items-center justify-center w-full hover:bg-purple-700 transition-colors normal-case"
								:class="{ 'opacity-50 cursor-not-allowed': isSelecting }">
								<i class="mdi mdi-cloud-upload mr-2"></i>
								{{ buttonText }}
							</button>
							<!-- Hidden file input -->
							<input type="file" ref="uploader" @change="onFileChange"
								accept="image/png, image/jpeg, image/bmp" class="hidden" />
						</div>

						<!-- Text Fields Column -->
						<div class="w-full md:w-2/3 grid grid-cols-1 gap-4">
							<form ref="loginForm" class="grid grid-cols-1 gap-4">
								<div class="relative">
									<label for="studentNoAdd" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Student No</label>
									<input id="studentNoAdd" type="text" v-model="student_no"
										class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
								</div>
								<div class="relative">
									<label for="lastNameAdd" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Last name</label>
									<input id="lastNameAdd" type="text" v-model="last_name"
										class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
								</div>
								<div class="relative">
									<label for="firstNameAdd" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">First name</label>
									<input id="firstNameAdd" type="text" v-model="first_name"
										class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
								</div>
								<div class="relative">
									<label for="middleNameAdd" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Middle name</label>
									<input id="middleNameAdd" type="text" v-model="middle_name"
										class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
								</div>
							</form>
						</div>
					</div>
				</div>
				<div class="p-6 border-t border-gray-200 flex justify-end gap-3">
					<button type="button" @click="onSubmit" :disabled="loading"
						class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors normal-case"
						:class="{ 'opacity-50 cursor-not-allowed': loading }">
						<span v-if="loading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
						Submit
					</button>
					<button type="button" @click="cancelAddRecord"
						class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors normal-case">
						Cancel
					</button>
				</div>
			</div>
		</div>

		<!-- ASSIGN CARD DIALOG -->
		<div v-if="assignCardDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
				<form @submit.prevent="assignCard" ref="assignCardForm" class="p-6">
					<h3 class="text-xl font-semibold text-gray-800 mb-4">Assign Card to {{ studentno }}</h3>
					<div class="relative mb-6">
						<label for="assignCardId" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Assign card</label>
						<div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
							<i class="mdi mdi-card-account-details text-gray-500 ml-3"></i>
							<input id="assignCardId" type="text" v-model="cardid"
								class="flex-grow p-2 rounded-r-md focus:outline-none" />
							<button v-if="cardid" @click="cardid = null" type="button" class="text-gray-500 p-2 hover:text-gray-700">
								<i class="mdi mdi-close-circle"></i>
							</button>
						</div>
					</div>
					<div class="flex justify-end gap-3">
						<button type="submit"
							class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors normal-case">
							Assign
						</button>
						<button type="button" @click="assignCardDialog = false"
							class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors normal-case">
							Close
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Delete Profile Dialog Box -->
		<div v-if="deleteProfileDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-gray-800 text-white rounded-lg shadow-xl p-6 max-w-sm w-full">
				<div class="flex items-center mb-4">
					<i class="mdi mdi-delete-alert text-2xl mr-3"></i>
					<h3 class="text-xl font-semibold">Delete Profile</h3>
				</div>
				<p class="text-gray-200 mb-6">Are you sure you want to delete this profile?</p>
				<div class="flex justify-end gap-3">
					<button @click="deleteItem" :disabled="loading"
						class="px-4 py-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition-colors normal-case"
						:class="{ 'opacity-50 cursor-not-allowed': loading }">
						<i class="mdi mdi-delete mr-2"></i> Delete
					</button>
					<button @click="deleteProfileDialog = false"
						class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors normal-case">
						Cancel
					</button>
				</div>
			</div>
		</div>

		<!-- START SNACKBAR -->
		<transition name="fade">
			<div v-if="snackbar"
				:class="['fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white flex items-center', { 'bg-green-500': snackbar_color === 'success', 'bg-red-500': snackbar_color === 'error' }]">
				<i :class="['mdi mr-2', snackbar_icon]"></i>
				<span>{{ snackbar_msg }}</span>
				<button @click="snackbar = false" class="ml-auto text-white opacity-75 hover:opacity-100">
					<i class="mdi mdi-close text-sm"></i>
				</button>
			</div>
		</transition>
		<!-- END SNACKBAR -->
	</div>
</template>
<script setup>
definePageMeta({
	layout: "admin",
});
import { v4 as uuidv4 } from "uuid";
import { useToast } from "vue-toastification";
import axios from "axios";
import FormData from "form-data"; // Keep this if your backend expects FormData
// Removed fs and path-browserify as they are Node.js specific and not typically used in browser code

// Composable utility function import
const { getBackendUrl, formatCurImageUrl, uploadImage, getImageServerUrl } = useUtils();

const config = useRuntimeConfig();
const toast = useToast();

// Snackbar
const snackbar = ref(false);
const snackbar_color = ref("");
const snackbar_msg = ref("");
const snackbar_icon = ref("");

const loading = ref(false);
const student_no = ref(null);
const last_name = ref(null);
const first_name = ref(null);
const middle_name = ref(null);
const search = ref(null);
const dialog = ref(false); // For Add Record dialog
const assignCardDialog = ref(false);
const deleteProfileDialog = ref(false);
// const imageFile = ref(null); // Redundant with avatarImage
// const previewImage = ref(null); // Redundant with imagePreviewURL
// const showUploader = ref(true); // Vuetify specific, not needed
const baseUrl = config.public.apiBase;
const imageBase = config.public.imageBase; // Not directly used in template, but kept for context
// const form = ref([]); // Unused
const headers = ref([
	{ title: "Student #", align: "start", sortable: true, key: "studentno" },
	{ title: "Photo", key: "image_url", sortable: false },
	{ title: "Lastname", key: "last_name", sortable: false },
	{ title: "Firstname", key: "first_name", sortable: false },
	{ title: "Middlename", key: "middle_name", sortable: false },
	{ title: "Card", key: "is_card_assign", sortable: false },
	{ title: "Actions", key: "actions", sortable: false },
]);
const rules = ref({ // Vuetify specific rules, kept for context but manual validation used
	studentno: [(v) => !!v || "Student no is required"],
	lastname: [(v) => !!v || "Lastname is required"],
	firstname: [(v) => !!v || "Firstname is required"],
	middlename: [(v) => !!v || "Middlename is required"],
	photo: [(v) => !!v || "Upload an image"],
	cardid: [(v) => !!v || "Card ID is required"],
});

const profileList = ref([]);
// const uploadResult = ref(null); // Not directly used in this component after uploadImage call
const newImageName = ref(null); // The File object with a new UUID name
const publicID = ref(""); // The UUID string for the image
const imageID = ref(null); // ID returned from image upload service
const loginForm = ref(null); // Ref for the Add Record form
const assignCardForm = ref(null); // Ref for the Assign Card form
const uploader = ref(null); // Ref for the hidden file input
// const valid = ref(true); // Vuetify form validation state, not automatically updated
// const cardvalid = ref(true); // Vuetify form validation state, not automatically updated
const imagePreviewURL = ref(null); // URL for the image preview
const avatarImage = ref(null); // The selected File object from input, for preview check
const defaultButtonText = ref("Select Image"); // Changed from "Upload Image" to "Select Image"
const selectedFile = ref(null); // The original selected File object
const isSelecting = ref(false); // To manage button loading state during file selection
const cardid = ref(null);
const profile_publicid = ref(null);
const profileid = ref(null);
const studentno = ref(null); // Used in assign card dialog for display

// Computed property for filtered list
const filteredProfileList = computed(() => {
	if (!search.value) {
		return profileList.value;
	}
	const searchTerm = search.value.toLowerCase();
	return profileList.value.filter(profile =>
		profile.studentno.toLowerCase().includes(searchTerm) ||
		profile.last_name.toLowerCase().includes(searchTerm) ||
		profile.first_name.toLowerCase().includes(searchTerm) ||
		(profile.middle_name && profile.middle_name.toLowerCase().includes(searchTerm))
	);
});


async function initialize() {
	try {
		const { data: result } = await useFetch("/api/getProfileList");
		if (result.value) {
			const resultList = await updateImageUrls(result.value);
			if (resultList) {
				profileList.value = resultList;
			}
		}
	} catch (err) {
		console.error("Failed to fetch data: ", err);
		toast.error("Failed to load profiles.");
	}
}

async function onFileChange(event) {
	const file = event.target.files ? event.target.files[0] : null;

	if (!file) {
		clearImagePreview();
		return;
	}

	const originalName = file.name;
	const ext = originalName.split(".").pop();
	const blob = file.slice(0, file.size);
	publicID.value = uuidv4(); // Generate UUID
	newImageName.value = new File([blob], `${publicID.value}.${ext}`, { type: file.type });

	imagePreviewURL.value = URL.createObjectURL(file);
	avatarImage.value = file; // Store the actual File object
	selectedFile.value = file; // For button text
}

function clearImagePreview() {
	if (imagePreviewURL.value) {
		URL.revokeObjectURL(imagePreviewURL.value);
	}
	imagePreviewURL.value = null;
	avatarImage.value = null;
	selectedFile.value = null;
	newImageName.value = null; // Important to clear the file prepared for upload
	if (uploader.value) {
		uploader.value.value = ''; // Clear the actual file input
	}
	defaultButtonText.value = "Select Image";
}

function cancelAddRecord() {
	dialog.value = false;
	clearImagePreview();
	// Manually clear text fields as loginForm.value?.reset() is for Vuetify forms
	student_no.value = null;
	last_name.value = null;
	first_name.value = null;
	middle_name.value = null;
}

async function onSubmit() {
	// Manual validation
	if (!student_no.value || !last_name.value || !first_name.value || !middle_name.value) {
		snackbar_color.value = "error";
		snackbar_icon.value = "mdi-alert-circle";
		snackbar_msg.value = "All text fields are required!";
		snackbar.value = true;
		return;
	}
	if (!newImageName.value) {
		snackbar_color.value = "error";
		snackbar_icon.value = "mdi-alert-circle";
		snackbar_msg.value = "Please select an image!";
		snackbar.value = true;
		return;
	}

	loading.value = true;
	try {
		// Use your uploadImage composable, which should handle the FormData internally
		const imageUploadResult = await uploadImage(newImageName.value);

		if (imageUploadResult && imageUploadResult[0]) {
			const payload = {
				student_no: student_no.value,
				last_name: last_name.value,
				first_name: first_name.value,
				middle_name: middle_name.value,
				publicid: imageUploadResult[0].hash,
				image_url: imageUploadResult[0].url,
				image_id: imageUploadResult[0].id,
			};
			await axios.post(`/api/createProfile`, payload);

			dialog.value = false;
			cancelAddRecord(); // Reusing cancel logic to clear form/image
			toast.success("Profile successfully created!");
			initialize(); // Refresh the list
		} else {
			toast.error("Image upload failed or returned no data.");
		}
	} catch (error) {
		console.error("Error submitting profile: ", error);
		toast.error("Failed to create profile: " + (error.response?.data?.message || error.message));
	} finally {
		loading.value = false;
	}
}

async function updateImageUrls(students) {
	const myBase = await getImageServerUrl();
	return students.map((student) => {
		const updatedUrl = formatCurImageUrl(myBase, student.image_url);
		return {
			...student,
			image_url: updatedUrl,
		};
	});
}

async function onButtonClick() {
	isSelecting.value = true;
	window.addEventListener(
		"focus",
		() => {
			isSelecting.value = false;
		},
		{ once: true }
	);
	uploader.value.click();
}

const buttonText = computed({
	get: () => (selectedFile.value ? selectedFile.value.name : defaultButtonText.value),
	set(val) {
		defaultButtonText.value = val;
	},
});

// Show Assign Card Dialog (Note: This function is present but not called in the provided template. You might have a button for it elsewhere.)
async function showAssignCardDialog(item) {
	assignCardDialog.value = true;
	studentno.value = item.studentno;
	profile_publicid.value = item.publicid;
	profileid.value = item.id;
}

// Assign Card Function
async function assignCard() {
	if (!cardid.value) {
		snackbar_color.value = "error";
		snackbar_icon.value = "mdi-alert-circle";
		snackbar_msg.value = "Card ID is required!";
		snackbar.value = true;
		return;
	}

	loading.value = true;
	try {
		let payload = {
			cardid: cardid.value,
			profileid: profileid.value,
			profile_publicid: profile_publicid.value,
		};
		await $fetch("/api/assignProfileCard", {
			method: "POST",
			body: payload,
		});
		cardid.value = null; // Clear input
		assignCardDialog.value = false;
		toast.success("Successfully assigned a card!");
		initialize();
	} catch (error) {
		console.error(error);
		toast.error("Failed to assign card: " + (error.response?.data?.message || error.message));
	} finally {
		loading.value = false;
	}
}

// Delete Profile Function
async function showDeleteProfileDialog(item) {
	publicID.value = item.publicid; // This is the publicid for the profile, not the image
	imageID.value = item.image_id; // This is the image ID for deletion
	deleteProfileDialog.value = true;
}
async function deleteItem() {
	loading.value = true;
	try {
		const payload = {
			image_id: imageID.value,
		};
		await $fetch(`/api/profile/delete/${publicID.value}`, {
			method: "PUT", // Assuming your API uses PUT for soft delete or update status
			body: payload,
		});
		loading.value = false;
		deleteProfileDialog.value = false;
		toast.success("Profile deleted successfully!");
		initialize(); // Refresh the list
	} catch (error) {
		loading.value = false;
		console.error(error);
		toast.error("Failed to delete profile: " + (error.response?.data?.message || error.message));
	}
}

onMounted(async () => {
	await initialize();
});
</script>
<style scoped>
/* Spinner for loading state on buttons */
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

/* Transition for Snackbar */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>