
<template>
	<div class="p-4">
		<div class="flex flex-col md:flex-row md:gap-4">
			<!-- Left Column (Profile Info & Card Details) -->
			<div class="w-full md:w-3/12 flex flex-col gap-4">
				<!-- Profile Card -->
				<div class="bg-white rounded-lg shadow-sm p-4 text-center">
					<div v-if="profileDetails">
						<img class="w-[200px] h-[200px] rounded-full object-cover mx-auto border-2 border-purple-700"
							:src="profileImage" alt="" lazy-src="https://fakeimg.pl/400x400?text=Photo" />
						<button @click="updateImageDialogbox = true"
							class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto hover:bg-purple-700 transition-colors normal-case">
							<i class="mdi mdi-camera mr-2"></i> Update Photo
						</button>

						<div class="mt-5 text-lg font-semibold uppercase">
							<p>{{ profileDetails.first_name }} {{ profileDetails.last_name }}</p>
						</div>
						<div class="text-base font-semibold text-gray-600">
							<p>{{ profileDetails.studentno }}</p>
						</div>
					</div>
					<div v-else>
						<img class="w-[200px] h-[200px] rounded-full object-cover mx-auto border-2 border-gray-300"
							alt="" lazy-src="https://fakeimg.pl/400x400?text=Photo" />
					</div>

					<hr class="my-4 border-t border-gray-200" />
					<div class="flex flex-col md:flex-row gap-2 mx-2 my-2">
						<div class="w-full md:w-1/2">
							<button @click="updateProfileDialog = true"
								class="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-md flex items-center justify-center hover:bg-purple-50 transition-colors normal-case">
								<i class="mdi mdi-pencil mr-2"></i> Edit
							</button>
						</div>
						<div class="w-full md:w-1/2">
							<button @click="deleteProfileDialog = true"
								class="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors normal-case">
								<i class="mdi mdi-delete mr-2"></i> Delete
							</button>
						</div>
					</div>
				</div>

				<!-- Card Details Card -->
				<div class="bg-white rounded-lg shadow-sm p-4">
					<p class="font-bold flex items-center">
						<i class="mdi mdi-card-account-details text-primary text-2xl mr-2"></i> Card Details
					</p>
					<hr class="my-2 border-t border-gray-200" />
					<div class="mt-3" v-if="profileDetails.is_card_assign == true">
						<div class="grid grid-cols-12 gap-y-1">
							<div class="col-span-4 text-sm font-bold">Card #:</div>
							<div class="col-span-8">{{ cardDetails.cardid }}</div>
							<div class="col-span-4 text-sm font-bold">Status:</div>
							<div class="col-span-8 flex items-center">
								<span v-if="cardDetails.is_active == true" class="flex items-center">
									<span class="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>Active
								</span>
								<span v-else class="flex items-center">
									<span class="w-2 h-2 rounded-full bg-red-500 inline-block mr-2"></span>Inactive
								</span>
							</div>
						</div>
					</div>
					<div v-else class="text-center py-4">
						<i class="mdi mdi-smart-card-off text-gray-400 text-5xl"></i>
						<p class="text-xs uppercase mt-2">No Assign Card</p>
					</div>

					<hr class="my-2 border-t border-gray-200" />
					<div class="flex justify-center mt-2">
						<button v-if="profileDetails.is_card_assign == true" @click="showUnlinkDialogBox"
							class="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md flex items-center justify-center hover:bg-red-50 transition-colors normal-case">
							<i class="mdi mdi-link-off mr-2"></i> Unlink
						</button>

						<button v-else @click="assignCardDialog = true"
							class="w-full px-4 py-2 border border-purple-600 text-purple-600 rounded-md flex items-center justify-center hover:bg-purple-50 transition-colors normal-case">
							<i class="mdi mdi-link-plus mr-2"></i> Link Card
						</button>
					</div>
				</div>
			</div>

			<!-- Right Column (Tabs: Info & Emergency Contacts) -->
			<div class="w-full md:w-9/12 mt-4 md:mt-0">
				<div class="bg-white rounded-lg shadow-sm">
					<!-- Tab Navigation -->
					<div class="flex border-b border-gray-200 bg-white rounded-t-lg">
						<button @click="tab = 1"
							:class="['px-6 py-3 text-gray-600 font-semibold', { 'border-b-2 border-purple-600 text-purple-600': tab === 1 }]">
							Info
						</button>
						<button @click="tab = 2"
							:class="['px-6 py-3 text-gray-600 font-semibold', { 'border-b-2 border-purple-600 text-purple-600': tab === 2 }]">
							Emergency Contacts
						</button>
					</div>

					<!-- Tab Content -->
					<div class="p-4">
						<div v-if="tab === 1">
							<div class="bg-white">
								<div class="grid grid-cols-1 gap-4">
									<div class="relative">
										<label for="studentNo" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Student No</label>
										<input id="studentNo" type="text" :value="profileDetails.studentno" readonly
											class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
									</div>
									<div class="relative">
										<label for="lastName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Last name</label>
										<input id="lastName" type="text" :value="profileDetails.last_name" readonly
											class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
									</div>
									<div class="relative">
										<label for="firstName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">First name</label>
										<input id="firstName" type="text" :value="profileDetails.first_name" readonly
											class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
									</div>
									<div class="relative">
										<label for="middleName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Middle name</label>
										<input id="middleName" type="text" :value="profileDetails.middle_name" readonly
											class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
									</div>
								</div>
							</div>
						</div>

						<div v-if="tab === 2">
							<div class="bg-white">
								<div class="grid grid-cols-1 gap-4">
									<div v-if="profileStore.myEmergencyContacts == null">
										<div class="relative">
											<label for="ctName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Emergency Contact Person</label>
											<input id="ctName" type="text" v-model="ctName"
												class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
										</div>
										<div class="relative mt-4">
											<label for="ctRelation" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Contact Relation</label>
											<input id="ctRelation" type="text" v-model="ctRelation"
												class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
										</div>
										<div class="relative mt-4">
											<label for="ctMobileNumber" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Contact Number</label>
											<input id="ctMobileNumber" type="text" v-model="ctMobileNumber"
												class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
										</div>
										<div class="mt-6">
											<button @click="saveContact"
												class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors normal-case">
												Save
											</button>
										</div>
									</div>
									<div v-else>
										<div class="relative">
											<label for="ctNameEdit" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Emergency Contact Person</label>
											<input id="ctNameEdit" type="text" v-model="profileStore.myEmergencyContacts.contactname"
												class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
										</div>
										<div class="relative mt-4">
											<label for="ctRelationEdit" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Contact Relation</label>
											<input id="ctRelationEdit" type="text" v-model="profileStore.myEmergencyContacts.relation"
												class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
										</div>
										<div class="relative mt-4">
											<label for="ctMobileNumberEdit" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Contact Number</label>
											<input id="ctMobileNumberEdit" type="text" v-model="profileStore.myEmergencyContacts.mobilenumber"
												class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
										</div>
										<div class="mt-6 flex gap-4">
											<div class="w-1/2">
												<button
													class="w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors normal-case">
													Edit
												</button>
											</div>
											<div class="w-1/2">
												<button
													class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors normal-case">
													Save
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- START DIALOG BOXES -->

		<!-- Loader Dialog -->
		<div v-if="loader" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg p-6 max-w-sm flex items-center shadow-lg">
				<div class="mr-4">
					<i class="mdi mdi-link-off text-purple-600 text-3xl"></i>
				</div>
				<div class="text-lg text-gray-800">Unlinking card...</div>
				<div class="ml-auto">
					<div class="loader ease-linear rounded-full border-2 border-t-2 border-purple-400 h-6 w-6"></div>
				</div>
			</div>
		</div>

		<!-- Unlink Dialog Box -->
		<div v-if="unlinkDialogbox"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-gray-800 text-white rounded-lg shadow-xl p-6 max-w-sm w-full">
				<div class="flex items-center mb-4">
					<i class="mdi mdi-link-off text-2xl mr-3"></i>
					<h3 class="text-xl font-semibold">Unlink Card</h3>
				</div>
				<p class="text-gray-200 mb-6">Are you sure you want to unlink your card?</p>
				<div class="flex justify-end gap-3">
					<button @click="unlinkCard"
						class="px-4 py-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition-colors normal-case">
						<i class="mdi mdi-link-off mr-2"></i> Unlink
					</button>
					<button @click="unlinkDialogbox = false"
						class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors normal-case">
						Cancel
					</button>
				</div>
			</div>
		</div>

		<!-- Assign Card Dialog -->
		<div v-if="assignCardDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-lg w-full">
				<div class="flex items-center p-4 border-b border-gray-200">
					<i class="mdi mdi-image text-purple-600 text-2xl mr-3"></i>
					<h3 class="text-lg font-semibold text-gray-800">Assign Card to {{ profileDetails.studentno }}</h3>
					<button @click="assignCardDialog = false" class="ml-auto text-gray-500 hover:text-gray-700">
						<i class="mdi mdi-close text-xl"></i>
					</button>
				</div>
				<form @submit.prevent="assignCard" ref="assignCardForm" class="p-6">
					<div class="relative mb-6">
						<label for="cardId" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Assign card</label>
						<div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-500">
							<i class="mdi mdi-card-account-details text-gray-500 ml-3"></i>
							<input id="cardId" type="text" v-model="cardid" :rules="rules.cardid"
								class="flex-grow p-2 rounded-r-md focus:outline-none" />
							<button v-if="cardid" @click="cardid = null" type="button" class="text-gray-500 p-2 hover:text-gray-700">
								<i class="mdi mdi-close-circle"></i>
							</button>
						</div>
					</div>
					<div class="flex justify-end">
						<button type="submit"
							class="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors normal-case">
							Assign
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Update Profile Info Dialog -->
		<div v-if="updateProfileDialog"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-3xl w-full">
				<div class="p-4 border-b border-gray-200">
					<h3 class="text-lg font-semibold text-gray-800">Update Record</h3>
				</div>
				<form @submit.prevent="updateInfo" ref="updateInfoForm" class="p-6">
					<hr class="mb-4 border-t border-gray-200" />
					<div class="flex flex-col md:flex-row gap-6">
						<div class="w-full md:w-1/3 flex justify-center items-start">
							<img v-if="profileDetails"
								class="w-[200px] h-[200px] rounded-full object-cover border-2 border-purple-700"
								:src="profileImage" alt="" lazy-src="https://fakeimg.pl/400x400?text=Photo" />
							<img v-else class="w-[200px] h-[200px] rounded-full object-cover border-2 border-gray-300"
								alt="" lazy-src="https://fakeimg.pl/400x400?text=Photo" />
						</div>
						<div class="w-full md:w-2/3 grid grid-cols-1 gap-4">
							<div class="relative">
								<label for="editStudentNo" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Student No</label>
								<input id="editStudentNo" type="text" v-model="student_no" :rules="rules.studentno"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
							<div class="relative">
								<label for="editLastName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Last name</label>
								<input id="editLastName" type="text" v-model="last_name" :rules="rules.lastname"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
							<div class="relative">
								<label for="editFirstName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">First name</label>
								<input id="editFirstName" type="text" v-model="first_name" :rules="rules.firstname"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
							<div class="relative">
								<label for="editMiddleName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Middle name</label>
								<input id="editMiddleName" type="text" v-model="middle_name" :rules="rules.middlename"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
						</div>
					</div>
					<div class="flex justify-center gap-4 mt-6">
						<button type="submit"
							class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors normal-case">
							Update
						</button>
						<button type="button" @click="updateProfileDialog = false"
							class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors normal-case">
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>

		<!-- Update Image Dialog Box -->
		<div v-if="updateImageDialogbox"
			class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg shadow-xl max-w-sm w-full">
				<div class="flex items-center p-4 border-b border-gray-200">
					<i class="mdi mdi-image text-purple-600 text-2xl mr-3"></i>
					<h3 class="text-lg font-semibold text-gray-800">Update Photo</h3>
					<button @click="closeImageUpload" class="ml-auto text-gray-500 hover:text-gray-700">
						<i class="mdi mdi-close text-xl"></i>
					</button>
				</div>
				<div class="p-6">
					<img :src="avatarImage ? imagePreviewURL : 'https://fakeimg.pl/400x400?text=Photo'" alt="Image Preview"
						class="w-full h-40 object-cover rounded-md mb-4 border border-gray-200" />

					<input type="file" ref="uploader" @change="onFileChange" @click="clearImagePreview()"
						accept="image/png, image/jpeg, image/bmp" class="hidden" />

					<div class="flex justify-center mb-4">
						<button type="button" @click="onButtonClick" :disabled="isSelecting"
							class="px-6 py-2 bg-purple-600 text-white rounded-md flex items-center hover:bg-purple-700 transition-colors normal-case"
							:class="{ 'opacity-50 cursor-not-allowed': isSelecting }">
							<i class="mdi mdi-image mr-2"></i> Select Image
						</button>
					</div>

					<button @click="uploadUpdatedImage"
						class="w-full px-6 py-2 bg-purple-600 text-white rounded-md flex items-center justify-center hover:bg-purple-700 transition-colors normal-case">
						<i class="mdi mdi-cloud-upload mr-2"></i> Upload
					</button>
				</div>
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
					<button @click="deleteProfile" :disabled="loading"
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

		<!-- END DIALOG BOXES -->

		<!-- START SNACKBAR -->
		<transition name="fade">
			<div v-if="snackbar"
				:class="['fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg text-white flex items-center', { 'bg-green-500': snackbar_color === 'success', 'bg-red-500': snackbar_color === 'error', 'bg-blue-500': snackbar_color === 'info' }]">
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

import { useRoute } from "vue-router";
import { useToast } from "vue-toastification"; // Keep this for toast messages if you still want them
import axios from "axios";
import { useProfileStore } from "~/stores/profile";
const profileStore = useProfileStore();
const route = useRoute();
const router = useRouter();
const toast = useToast(); // Using vue-toastification for actual toasts, as snackbar is a custom implementation.
const { getBackendUrl, formatCurImageUrl, uploadUpdateImage, getImageServerUrl } = useUtils();
const config = useRuntimeConfig();
const imageBase = config.public.imageBase;
// Dialog box
const loader = ref(false);
const unlinkDialogbox = ref(false);
const assignCardDialog = ref(false);
const updateProfileDialog = ref(false);
const updateImageDialogbox = ref(false);
const deleteProfileDialog = ref(false);

// Snackbar (custom implementation)
const snackbar = ref(false);
const snackbar_color = ref("");
const snackbar_msg = ref("");
const snackbar_icon = ref("");

// Loader
const loading = ref(false);
const tab = ref(1); // Default to first tab
const profileid = ref(null);
const profile_publicid = ref(null);
const assignCardForm = ref(null); // Used for form validation reference
const cardvalid = ref(true); // Vuetify form validation state, might not be needed directly for Tailwind forms
const cardid = ref(null);
const valid = ref(true); // Vuetify form validation state
const updateInfoForm = ref(null); // Used for form validation reference
const imagePreviewURL = ref(null);
const uploader = ref(null);
const selectedFile = ref(null);
const uploadResult = ref(null);
const newImageName = ref(null);
const publicID = ref("");
const student_no = ref(null);
const last_name = ref(null);
const first_name = ref(null);
const middle_name = ref(null);
const isSelecting = ref(false);
const image_id = ref(null);
const profileDetails = ref({});
const cardDetails = ref({});
const avatarImage = ref(null);
const profileImage = ref(null);
// Profile Contacts
const contactPersonDetails = ref(false);
const ctName = ref(null);
const ctRelation = ref(null);
const ctMobileNumber = ref(null);
const serverBackendBase = ref("");

// Rules for validation (these are Vuetify-style rules, you'd integrate a separate validation library like VeeValidate for a pure Tailwind form setup)
const rules = ref({
	studentno: [(v) => !!v || "Student no is required"],
	lastname: [(v) => !!v || "Lastname is required"],
	firstname: [(v) => !!v || "Firstname is required"],
	middlename: [(v) => !!v || "Middlename is required"],
	photo: [(v) => !!v || "Upload an image"],
	cardid: [(v) => !!v || "Card ID is required"],
});

async function initialize() {
	try {
		const result = await axios.post(`/api/profile/${route.params.id}`);
		if (result) {
			// Construct Image URL
			const myBase = await getImageServerUrl();
			// Add the Backend URL to the const
			serverBackendBase.value = myBase;
			profileImage.value = formatCurImageUrl(myBase, result.data[0].image_url);
			profileDetails.value = result.data[0];
			cardDetails.value = result.data[0].card;
			profileid.value = result.data[0].id;
			profile_publicid.value = result.data[0].publicid;
			student_no.value = result.data[0].studentno;
			last_name.value = result.data[0].last_name;
			first_name.value = result.data[0].first_name;
			middle_name.value = result.data[0].middle_name;
			image_id.value = result.data[0].image_id;
			publicID.value = result.data[0].publicid;
		}
		const myEmergencyContact = await profileStore.getEmergencyContactDetails(route.params.id);
		if (myEmergencyContact) {
			// Logic if contact exists
		}
	} catch (error) {
		console.error("Failed to fetch data: ", error);
		// Consider showing a toast/snackbar for error
	}
}

// Assign Card Function
async function assignCard() {
	// For actual validation without Vuetify, you'd implement logic here or use a library like VeeValidate
	if (!cardid.value) {
		toast.error("Card ID is required!");
		return;
	}

	loader.value = true;
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
		loader.value = false;
		toast.success("Successfully assigned a card!");
		initialize();
	} catch (error) {
		loader.value = false;
		console.error(error);
		toast.error("Failed to assign card: " + error.message);
	}
}

// Update Info Function
async function updateInfo() {
	// Manual validation check for simplicity, replace with a dedicated library for robust validation
	if (!student_no.value || !last_name.value || !first_name.value || !middle_name.value) {
		toast.error("All info fields are required!");
		return;
	}

	try {
		const payload = {
			student_no: student_no.value,
			last_name: last_name.value,
			first_name: first_name.value,
			middle_name: middle_name.value,
		};
		await $fetch(`/api/profile/update/${route.params.id}`, {
			method: "PUT",
			body: payload,
		});
		toast.success("Profile successfully updated!");
		updateProfileDialog.value = false; // Close dialog
		initialize();
	} catch (error) {
		console.error(error);
		toast.error("Failed to update profile: " + error.message);
	}
}

// Show Unlink Dialog Box
function showUnlinkDialogBox() {
	unlinkDialogbox.value = true;
}

// Unlink Card Function
async function unlinkCard() {
	unlinkDialogbox.value = false;
	loader.value = true;
	try {
		let response = await $fetch(`/api/card/unlink-card/${profileid.value}`, {
			method: "DELETE",
		});
		if (response) {
			loader.value = false;
			toast.success("Successfully unlinked the card!");
			initialize();
		}
	} catch (error) {
		loader.value = false;
		console.error("Failed to unlink card: ", error);
		toast.error("Failed to unlink card: " + error.message);
	}
}

async function onFileChange(event) {
	if (event.target.files.length === 0) {
		console.log("Cancel Upload");
		avatarImage.value = null;
		imagePreviewURL.value = null;
	} else {
		const image = event.target.files[0];
		const originalName = event.target.files[0].name;
		const ext = originalName.split(".").pop();
		const blob = image.slice(0, image.size);
		selectedFile.value = event.target.files[0];
		newImageName.value = new File([blob], `${publicID.value}.${ext}`, { type: `${image.type}` });

		if (image) {
			imagePreviewURL.value = URL.createObjectURL(image);
			avatarImage.value = image; // Keep avatarImage for v-if check
		} else {
			imagePreviewURL.value = null;
			avatarImage.value = null;
		}
	}
}

function clearImagePreview() {
	// This is called when the file input's clear button is clicked.
	// It's a Vuetify specific prop, but for a standard input, you'd manage it differently.
	// For now, it simply ensures the preview is cleared if the file is deselected.
	imagePreviewURL.value = null;
	avatarImage.value = null;
	selectedFile.value = null;
	newImageName.value = null;
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
	uploader.value.click(); // Trigger the hidden file input
}

async function closeImageUpload() {
	updateImageDialogbox.value = false;
	imagePreviewURL.value = null;
	avatarImage.value = null;
	newImageName.value = null; // Clear selected file for upload
}

async function uploadUpdatedImage() {
	if (!newImageName.value) {
		toast.error("No image selected!");
		return;
	}

	try {
		// Delete current image then upload the updated image
		const response = await $fetch(`/api/profile/photo/delete/${image_id.value}`);
		if (response) {
			uploadResult.value = await uploadUpdateImage(newImageName.value);
			const payload = {
				image_url: uploadResult.value[0].url,
				image_id: uploadResult.value[0].id,
			};

			await $fetch(`/api/profile/photo/update/${route.params.id}`, {
				method: "PUT",
				body: payload,
			});
			snackbar.value = true; // Use custom snackbar
			snackbar_icon.value = "mdi-check-circle";
			snackbar_color.value = "success";
			snackbar_msg.value = "Profile photo updated successfully!";
			newImageName.value = null;
			updateImageDialogbox.value = false; // Close dialog
			initialize();
		} else {
			toast.error("Error deleting current image.");
		}
	} catch (error) {
		console.error(error);
		toast.error("Failed to upload image: " + error.message);
	}
}

// Delete Profile details and photo
async function deleteProfile() {
	try {
		loading.value = true;
		const payload = {
			image_id: image_id.value,
		};
		await $fetch(`/api/profile/delete/${route.params.id}`, {
			method: "PUT",
			body: payload,
		});
		loading.value = false;
		toast.success("Profile deleted successfully!");
		deleteProfileDialog.value = false; // Close dialog
		await navigateTo("/admin/profiles");
	} catch (error) {
		loading.value = false;
		console.error(error);
		toast.error("Failed to delete profile: " + error.message);
	}
}

async function saveContact() {
	if (!ctName.value || !ctRelation.value || !ctMobileNumber.value) {
		toast.error("All emergency contact fields are required.");
		return;
	}

	try {
		const payload = {
			name: ctName.value,
			relation: ctRelation.value,
			contactNumber: ctMobileNumber.value,
			profile_publicid: route.params.id,
		};
		loading.value = true;
		await axios.post("/api/profile/assignEmergencyContact", payload);
		toast.success("Successfully Saved Profile Contact");
		loading.value = false;
		initialize(); // Re-fetch to update contact details
	} catch (err) {
		loading.value = false;
		console.log(err);
		toast.error("Failed to save contact: " + err.message);
	}
}

onMounted(async () => {
	await initialize();
});
</script>

<style scoped>
/* Custom loader for the dialog */
.loader {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

/* Transition for Snackbar */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>