<template>
	<div>
		<v-row dense>
			<v-col cols="12" md="3" sm="12">
				<v-row dense>
					<v-col cols="12" class="text-center">
						<v-card elevation="0">
							<v-card-text v-if="profileDetails">
								<v-img class="image_url mx-auto" :src="profileImage" alt=""
									lazy-src="https://fakeimg.pl/400x400?text=Photo" />
								<v-btn variant="tonal" color="primary" class="text-none mt-2" pre
									@click="updateImageDialogbox = true" round depressed>
									<v-icon>mdi-camera</v-icon></v-btn>

								<div class="profile-name">
									<p>{{ profileDetails.first_name }} {{ profileDetails.last_name }}</p>
								</div>
								<div class="profile-studentno">
									<p>{{ profileDetails.studentno }}</p>
								</div>
							</v-card-text>
							<v-card-text v-else>
								<v-img class="image_url mx-auto" alt=""
									lazy-src="https://fakeimg.pl/400x400?text=Photo" />
							</v-card-text>

							<v-divider class="mt-4"></v-divider>
							<v-card-actions class="mx-2 my-2">
								<v-row>
									<v-col cols="12" md="6">
										<v-btn prepend-icon="mdi-pencil" color="primary" variant="outlined"
											@click="updateProfileDialog = true" block>Edit</v-btn>
									</v-col>
									<v-col cols="12" md="6">
										<v-btn prepend-icon="mdi-delete" color="red" variant="outlined" block
											@click="deleteProfileDialog = true">Delete</v-btn>
									</v-col>
								</v-row>
							</v-card-actions>
						</v-card>
					</v-col>
					<v-col cols="12">
						<v-card elevation="0">
							<v-card-text>
								<p class="font-weight-bold"><v-icon aria-hidden="false" size="30"
										color="primary">mdi-card-account-details</v-icon> Card Details</p>
								<v-divider class="my-2"></v-divider>
								<div class="mt-3" v-if="profileDetails.is_card_assign == true">
									<v-row dense>
										<v-col cols="4">
											<p class="text-caption font-weight-bold">Card #:</p>
										</v-col>
										<v-col cols="8">
											<p class="">{{ cardDetails.cardid }}</p>
										</v-col>
										<v-col cols="4">
											<p class="text-caption font-weight-bold">Status:</p>
										</v-col>
										<v-col cols="8">
											<p v-if="cardDetails.is_active == true"><v-badge dot color="success"
													inline></v-badge>Active</p>
											<p v-else><v-badge dot color="error" inline></v-badge>Inactive</p>
										</v-col>
									</v-row>
								</div>
								<div v-else class="text-center">
									<v-icon size="50" color="grey">mdi-smart-card-off</v-icon>
									<p class="text-overline">No Assign Card</p>
								</div>
							</v-card-text>
							<v-divider></v-divider>
							<v-card-actions>
								<v-btn v-if="profileDetails.is_card_assign == true" prepend-icon="mdi-link-off"
									class="my-2" color="red" variant="outlined" block
									@click="showUnlinkDialogBox">Unlink</v-btn>

								<v-btn v-else prepend-icon="mdi-link-plus" class="my-2" color="primary"
									variant="outlined" block @click="assignCardDialog = true">Link Card</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</v-row>
			</v-col>
			<!-- <v-col cols="12" md="1">
              <v-divider style="height: 100%;" inset vertical></v-divider>
            </v-col> -->
			<v-col cols="12" md="9" sm="12">
				<v-card elevation="0">
					<v-tabs v-model="tab" align-tabs="start" bg-color="white" color="primary">
						<v-tab :value="1">Info</v-tab>
						<v-tab :value="2">Emergency Contacts</v-tab>
					</v-tabs>
					<v-tabs-window v-model="tab">
						<v-tabs-window-item :value="1">
							<v-card elevation="0">
								<v-card-text>
									<v-text-field :model-value="profileDetails.studentno" label="Student No"
										readonly></v-text-field>
									<v-text-field :model-value="profileDetails.last_name" label="Last name"
										readonly></v-text-field>
									<v-text-field :model-value="profileDetails.first_name" label="First name"
										readonly></v-text-field>
									<v-text-field :model-value="profileDetails.middle_name" label="Middle name"
										readonly></v-text-field>
								</v-card-text>
							</v-card>
						</v-tabs-window-item>

						<v-tabs-window-item :value="2">
							<v-card elevation="0" v-if="profileStore.myEmergencyContacts == null">
								<v-card-text>
									<v-text-field v-model="ctName" label="Emergency Contact Person"></v-text-field>
									<v-text-field v-model="ctRelation" label="Contact Relation"></v-text-field>
									<v-text-field v-model="ctMobileNumber" label="Contact Number"></v-text-field>
								</v-card-text>
								<v-card-actions>
									<v-btn block variant="flat" color="green" @click="saveContact">Save</v-btn>
								</v-card-actions>
							</v-card>
							<v-card elevation="0" v-else>
								<v-card-text>
									<v-text-field v-model="profileStore.myEmergencyContacts.contactname"
										label="Emergency Contact Person"></v-text-field>
									<v-text-field v-model="profileStore.myEmergencyContacts.relation"
										label="Contact Relation"></v-text-field>
									<v-text-field v-model="profileStore.myEmergencyContacts.mobilenumber"
										label="Contact Number"></v-text-field>
								</v-card-text>
								<v-card-actions>
									<v-row>
										<v-col><v-btn variant="flat" block color="orange">Edit</v-btn></v-col>
										<v-col> <v-btn variant="flat" block color="green">Save</v-btn></v-col>
									</v-row>
								</v-card-actions>
							</v-card>
						</v-tabs-window-item>
					</v-tabs-window>
				</v-card>
			</v-col>
		</v-row>

		<!----------------------------- START DIALOG BOX ---------------------------------->
		<!-- Loader -->
		<v-dialog v-model="loader" max-width="320" persistent>
			<v-list class="py-2" color="primary" elevation="12" rounded="lg">
				<v-list-item prepend-icon="mdi-link-off" title="Unlinking card...">
					<template v-slot:prepend>
						<div class="pe-4">
							<v-icon color="primary" size="x-large"></v-icon>
						</div>
					</template>

					<template v-slot:append>
						<v-progress-circular color="primary" indeterminate="disable-shrink" size="16"
							width="2"></v-progress-circular>
					</template>
				</v-list-item>
			</v-list>
		</v-dialog>

		<!-- Start Unlink Dialog Box -->
		<v-dialog v-model="unlinkDialogbox" width="auto">
			<v-card max-width="400" prepend-icon="mdi-link-off" color="blue-grey-darken-4"
				text="Are you sure you want to unlink your card?" title="Unlink Card">
				<template v-slot:actions>
					<v-btn variant="tonal" text="Unlink" prepend-icon="mdi-link-off" color="red"
						@click="unlinkCard"></v-btn>
					<v-btn variant="tonal" text="Cancel" @click="unlinkDialogbox = false"></v-btn>
				</template>
			</v-card>
		</v-dialog>
		<!-- End Unlink Dialog Box -->

		<!-- Start Assign Card Dialog -->
		<v-dialog v-model="assignCardDialog" persistent max-width="500">
			<v-card>
				<v-toolbar color="transparent">
					<template v-slot:prepend>
						<v-icon class="ml-4" color="primary">mdi-image</v-icon>
					</template>
					<v-toolbar-title class="text-h6">Assign Card to {{ profileDetails.studentno }}</v-toolbar-title>

					<template v-slot:append>
						<v-btn icon="mdi-close" @click="assignCardDialog = false"></v-btn>
					</template>
				</v-toolbar>
				<v-form v-model="cardvalid" @submit.prevent ref="assignCardForm" lazy-validation>
					<!-- <v-card-title>
            Assign Card to {{ profileDetails.studentno }}
          </v-card-title> -->
					<v-card-text>
						<v-text-field :rules="rules.cardid" v-model="cardid" label="Assign card"
							prepend-inner-icon="mdi-card-account-details" clearable></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" variant="elevated" @click="assignCard()">Assign</v-btn>
						<!-- <v-btn variant="elevated" @click="assignCardDialog = false">Close</v-btn> -->
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
		<!-- End Assign Card Dialog -->

		<!-- Update Profile Info Dialog -->
		<v-dialog width="auto" v-model="updateProfileDialog" persistent>
			<v-card title="Update Record" width="800">
				<v-form v-model="valid" ref="updateInfoForm" lazy-validation>
					<v-divider></v-divider>
					<v-card-text>
						<v-row>
							<v-col cols="4" v-if="profileDetails">
								<v-img class="image_url mx-auto"
									:src="formatCurImageUrl(serverBackendBase, profileDetails.image_url)" alt=""
									lazy-src="https://fakeimg.pl/400x400?text=Photo" />
							</v-col>
							<v-col cols="4" v-else>
								<v-img class="image_url mx-auto" alt=""
									lazy-src="https://fakeimg.pl/400x400?text=Photo" />
							</v-col>
							<v-col cols="8">
								<v-text-field v-model="student_no" :rules="rules.studentno"
									label="Student No"></v-text-field>
								<v-text-field v-model="last_name" :rules="rules.lastname"
									label="Last name"></v-text-field>
								<v-text-field v-model="first_name" :rules="rules.firstname"
									label="First name"></v-text-field>
								<v-text-field v-model="middle_name" :rules="rules.middlename"
									label="Middle name"></v-text-field>
							</v-col>
						</v-row>
						<div class="d-flex mb-3"></div>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn variant="elevated" color="success" @click="updateInfo"> Update </v-btn>
						<v-btn variant="elevated" color="error" @click="updateProfileDialog = false"> Cancel </v-btn>
						<v-spacer></v-spacer>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>
		<!-- End Update Profile Info Dialog -->

		<!-- Start Update Image Dialog Box -->
		<v-dialog v-model="updateImageDialogbox" persistent max-width="300">
			<v-card>
				<v-toolbar color="transparent">
					<template v-slot:prepend>
						<v-icon class="ml-4" color="primary">mdi-image</v-icon>
					</template>
					<v-toolbar-title class="text-h6" text="Update Photo"></v-toolbar-title>

					<template v-slot:append>
						<v-btn icon="mdi-close" @click="closeImageUpload"></v-btn>
					</template>
				</v-toolbar>
				<v-divider></v-divider>
				<v-card-text>
					<v-img :src="avatarImage ? imagePreviewURL : ''" alt=""
						lazy-src="https://fakeimg.pl/400x400?text=Photo" style="max-width: 100%; object-fit: cover"
						height="30vh" />

					<v-file-input :rules="rules.photo" v-model="avatarImage" accept="image/png, image/jpeg, image/bmp"
						density="compact" prepend-icon="mdi-camera" label="Upload Image" ref="uploader" required
						class="d-none" @change="onFileChange" @click:clear="clearImagePreview()"></v-file-input>

					<div class="d-flex align-center justify-center">
						<v-btn color="primary" class="text-none mt-2" variant="tonal" :loading="isSelecting"
							@click="onButtonClick">
							<v-icon>mdi-image</v-icon>
						</v-btn>
					</div>
				</v-card-text>

				<v-card-actions class="justify-center">
					<v-btn color="primary" class="text-none mt-2" block round variant="elevated"
						prepend-icon="mdi-cloud-upload" @click="uploadUpdatedImage">
						Upload
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- End Update Image Dialog Box -->

		<!-- Start Delete Profile Dialog Box -->
		<v-dialog v-model="deleteProfileDialog" width="auto">
			<v-card max-width="400" prepend-icon="mdi-delete-alert" color="blue-grey-darken-4"
				text="Are you sure you want to delete this profile?" title="Delete Profile">
				<template v-slot:actions>
					<v-btn variant="tonal" :loading="loading" text="Delete" @click="deleteProfile"
						prepend-icon="mdi-delete" color="red"></v-btn>
					<v-btn variant="tonal" text="Cancel" @click="deleteProfileDialog = false"></v-btn>
				</template>
			</v-card>
		</v-dialog>
		<!-- End Delete Profile Dialog Box -->

		<!----------------------------- END DIALOG BOX ---------------------------------->

		<!------------------------------- START SNACKBAR ------------------------------->
		<v-snackbar v-model="snackbar" :color="snackbar_color" location="top right">
			<v-icon start>{{ snackbar_icon }}</v-icon>
			{{ snackbar_msg }}

			<template v-slot:actions>
				<v-btn icon="mdi-close" size="x-small" @click="snackbar = false"> </v-btn>
			</template>
		</v-snackbar>

		<!------------------------------- END SNACKBAR ------------------------------->
	</div>
</template>

<script setup>
definePageMeta({
	layout: "admin",
});

import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import axios from "axios";
import { useProfileStore } from "~/stores/profile";
const profileStore = useProfileStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();
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

// Snackbar
const snackbar = ref(false);
const snackbar_color = ref("");
const snackbar_msg = ref("");
const snackbar_icon = ref("");

// Loader
const loading = ref(false);
const tab = ref(null);
const profileid = ref(null);
const profile_publicid = ref(null);
const assignCardForm = ref(null);
const cardvalid = ref(true);
const cardid = ref(null);
const valid = ref(true);
const updateInfoForm = ref(null);
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

		}
	} catch (error) {
		console.error("Failed to fetch data: ", error);
		throw error;
	}
}

// Assing Card Function
async function assignCard() {
	const { valid, errors } = await assignCardForm.value?.validate();
	if (valid) {
		if (cardid.value) {
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
				assignCardForm.value?.reset();
				assignCardDialog.value = false;
				loader.value = false;
				toast.success("Successfully assigned a card!");
				initialize();
			} catch (error) {
				console.error(error);
			}
		}
	} else {
		console.log("Error", errors);
	}
}

// Update Info Function
async function updateInfo() {
	const { valid, errors } = await updateInfoForm.value?.validate();

	if (valid) {
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
			initialize();
		} catch (error) {
			console.error(error);
		}
	} else {
		console.log(errors[0].errorMessages[0]);
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
			toast.success("Successfully unlink the card!");
			initialize();
		}
	} catch (error) {
		console.error("Failed to unlink card: ", error);
		throw error;
	}
}

async function onFileChange(event) {
	if (event.target.files.length == 0) {
		console.log("Cancel Upload");
	} else {
		const image = event.target.files[0];
		const originalName = event.target.files[0].name;
		const ext = originalName.split(".").pop();
		const blob = image.slice(0, image.size);
		selectedFile.value = event.target.files[0];
		newImageName.value = new File([blob], `${publicID.value}.${ext}`, { type: `${image.type}` });

		if (image) {
			imagePreviewURL.value = URL.createObjectURL(image);
			URL.revokeObjectURL(image);
		} else {
			imagePreviewURL.value = null;
		}
	}
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

async function closeImageUpload() {
	updateImageDialogbox.value = false;
	imagePreviewURL.value = "";
	avatarImage.value = null;
}

async function uploadUpdatedImage() {
	if (newImageName.value) {
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
				snackbar.value = true;
				snackbar_icon.value = "mdi-check-circle";
				snackbar_color.value = "success";
				snackbar_msg.value = "Profile photo updated successfully!";
				newImageName.value = null;
				initialize();
			} else {
				console.error("Error deleting current image");
			}
		} catch (error) {
			console.error(error);
		}
	} else {
		toast.error("No image selected!");
		console.error("No image selected!");
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
		await navigateTo("/admin/profiles");
	} catch (error) {
		loading.value = false;
		console.error(error);
	}
}

async function saveContact() {
	try {
		const payload = {
			name: ctName.value,
			relation: ctRelation.value,
			contactNumber: ctMobileNumber.value,
			profile_publicid: route.params.id,
		};
		loading.value = true;
		await axios.post("/api/profile/assignEmergencyContact", payload).then((res) => {
			toast.success("Successfully Saved Profile Contact");
			loading.value = false;
		});
	} catch (err) {
		console.log(err);
	}
}

onMounted(async () => {
	await initialize();
});
</script>

<style scoped>
.image_url {
	border: 2px solid #673ab7;
	border-radius: 50%;
	max-width: 200px;
	object-fit: cover;
}

.profile-name {
	font-size: 2.8vh;
	margin: 20px 0 0 0;
	text-transform: uppercase;
	font-weight: 600;
}

.profile-studentno {
	font-size: 2.5vh;
	font-weight: 600;
	color: #757575;
}

.v-btn {
	text-transform: capitalize;
}
</style>
