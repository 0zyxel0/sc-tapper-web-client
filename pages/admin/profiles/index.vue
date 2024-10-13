<template>
	<div>
		<v-row>
			<v-col>
				<v-btn class="mb-3" color="primary" @click="dialog = true">Add Record</v-btn>
				<v-card elevation="0">
					<v-card-title class="d-flex align-center pe-2">
						<v-icon icon="mdi-account"></v-icon> &nbsp; Profiles

						<v-spacer></v-spacer>

						<v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
							variant="solo-filled" flat hide-details single-line></v-text-field>
					</v-card-title>

					<v-divider></v-divider>
					<v-data-table v-model:search="search" :items="profileList" :headers="headers">
						<template v-slot:[`item.image_url`]="{ item }">
							<v-avatar :image="item.image_url" size="45" tile></v-avatar>
						</template>
						<template v-slot:[`item.is_card_assign`]="{ item }">
							<v-icon size="35" color="grey"
								v-if="item.is_card_assign == false">mdi-smart-card-off</v-icon>
							<v-icon size="35" color="primary" v-else>mdi-smart-card</v-icon>
						</template>
						<template v-slot:[`item.actions`]="{ item }">
							<!-- <v-tooltip text="Assign Card" location="top">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" v-if="item.is_card_assign == false" class="me-2"
										@click="showAssignCardDialog(item)">
										mdi-credit-card-plus </v-icon>
								</template>
</v-tooltip> -->
							<v-tooltip text="View Profile" location="top">
								<template v-slot:activator="{ props }">
									<v-btn v-bind="props" variant="text" icon="mdi-open-in-new"
										:to="`profiles/${item.publicid}`"> </v-btn>
								</template>
							</v-tooltip>
							<!-- <v-tooltip text="Edit Profile" location="top">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" class="me-2" @click="editItem(item)"> mdi-pencil
									</v-icon>
								</template>
							</v-tooltip> -->

							<v-tooltip text="Delete Profile" location="top">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" @click="showDeleteProfileDialog(item)"> mdi-delete </v-icon>
								</template>
							</v-tooltip>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>

		<!-- DIALOG BOX -->
		<v-dialog width="auto" v-model="dialog" persistent>
			<v-card title="Add Record" width="800">
				<v-divider></v-divider>
				<v-card-text>
					<v-row>
						<v-col cols="4">
							<v-img :src="avatarImage ? imagePreviewURL : ''" alt=""
								lazy-src="https://fakeimg.pl/400x400?text=Photo"
								style="max-width: 100%; object-fit: cover" height="30vh" />

							<v-btn color="primary" class="text-none mt-2" block round depressed :loading="isSelecting"
								@click="onButtonClick">
								<v-icon start> mdi-cloud-upload </v-icon>
								<!-- {{ buttonText || defaultButtonText }} -->
							</v-btn>
							<!-- <v-btn v-if="buttonText != 'Upload Image'" color="warning"
											class="text-none mt-2" @click="clearImagePreview()" block round
											depressed>Clear Image</v-btn> -->

							<v-file-input :rules="rules.photo" v-model="avatarImage"
								accept="image/png, image/jpeg, image/bmp" density="compact" prepend-icon="mdi-camera"
								label="Upload Image" ref="uploader" required class="d-none" @change="onFileChange"
								@click:clear="clearImagePreview()"></v-file-input>
						</v-col>
						<v-col cols="8">
							<v-form v-model="valid" ref="loginForm" lazy-validation>
								<v-text-field v-model="student_no" :rules="rules.studentno"
									label="Student No"></v-text-field>
								<v-text-field v-model="last_name" :rules="rules.lastname"
									label="Last name"></v-text-field>
								<v-text-field v-model="first_name" :rules="rules.firstname"
									label="First name"></v-text-field>
								<v-text-field v-model="middle_name" :rules="rules.middlename"
									label="Middle name"></v-text-field>
							</v-form>
						</v-col>
					</v-row>
					<div class="d-flex mb-3"></div>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn variant="elevated" :disabled="loading" :loading="loading" color="success" @click="onSubmit">
						Submit
					</v-btn>
					<v-btn variant="elevated" color="error" @click="cancelAddRecord"> Cancel </v-btn>
					<v-spacer></v-spacer>
					<!-- <v-btn class="mt-4" color="primary" variant="outlined" size="large"
									@click.prevent="onSubmit">Submit</v-btn> -->
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- ASSIGN CARD DIALOG -->
		<v-dialog v-model="assignCardDialog" persistent max-width="500">
			<v-card>
				<v-form v-model="cardvalid" ref="assignCardForm" lazy-validation>
					<v-card-title> Assign Card to {{ studentno }} </v-card-title>
					<v-card-text>
						<v-text-field :rules="rules.cardid" v-model="cardid" label="Assign card"
							prepend-inner-icon="mdi-card-account-details" clearable></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="primary" variant="elevated" @click="assignCard()">Assign</v-btn>
						<v-btn variant="elevated" @click="assignCardDialog = false">Close</v-btn>
					</v-card-actions>
				</v-form>
			</v-card>
		</v-dialog>

		<!-- Start Delete Profile Dialog Box -->
		<v-dialog v-model="deleteProfileDialog" width="auto">
			<v-card max-width="400" prepend-icon="mdi-delete-alert" color="blue-grey-darken-4"
				text="Are you sure you want to delete this profile?" title="Delete Profile">
				<template v-slot:actions>
					<v-btn variant="tonal" :loading="loading" text="Delete" @click="deleteItem"
						prepend-icon="mdi-delete" color="red"></v-btn>
					<v-btn variant="tonal" text="Cancel" @click="deleteProfileDialog = false"></v-btn>
				</template>
			</v-card>
		</v-dialog>
		<!-- End Delete Profile Dialog Box -->

		<!-- SNACKBAR -->
		<!-- <v-snackbar v-model="snackbar" color="success" location="top right">
			Successfully submitted!
			<template v-slot:actions>
				<v-btn density="compact" icon="mdi-close" @click="snackbar = false"> </v-btn>
			</template>
		</v-snackbar> -->

		<v-snackbar v-model="snackbar" :color="snackbar_color" location="top right">
			<v-icon start>{{ snackbar_icon }}</v-icon>
			{{ snackbar_msg }}

			<template v-slot:actions>
				<v-btn icon="mdi-close" size="x-small" @click="snackbar = false"> </v-btn>
			</template>
		</v-snackbar>
	</div>
</template>
<script setup>
definePageMeta({
	layout: "admin",
});
import { v4 as uuidv4 } from "uuid";
import { useToast } from "vue-toastification";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from 'path-browserify';

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
const dialog = ref(false);
const assignCardDialog = ref(false);
const deleteProfileDialog = ref(false);
const imageFile = ref(null);
const previewImage = ref(null);
const showUploader = ref(true);
const baseUrl = config.public.apiBase;
const imageBase = config.public.imageBase;
const form = ref([]);
const headers = ref([
	{
		title: "Student #",
		align: "start",
		sortable: true,
		key: "studentno",
	},
	{ title: "Photo", key: "image_url", sortable: false },
	{ title: "Lastname", key: "last_name", sortable: false },
	{ title: "Firstname", key: "first_name", sortable: false },
	{ title: "Middlename", key: "middle_name", sortable: false },
	{ title: "Card", key: "is_card_assign", sortable: false },
	{ title: "Actions", key: "actions", sortable: false },
]);
const rules = ref({
	studentno: [(v) => !!v || "Student no is required"],
	lastname: [(v) => !!v || "Lastname is required"],
	firstname: [(v) => !!v || "Firstname is required"],
	middlename: [(v) => !!v || "Middlename is required"],
	photo: [(v) => !!v || "Upload an image"],
	cardid: [(v) => !!v || "Card ID is required"],
});

const profileList = ref([]);
const uploadResult = ref(null);
const newImageName = ref(null);
const publicID = ref("");
const imageID = ref(null);
const loginForm = ref(null);
const assignCardForm = ref(null);
const uploader = ref(null);
const valid = ref(true);
const cardvalid = ref(true);
const imagePreviewURL = ref(null);
const avatarImage = ref(null);
const defaultButtonText = ref("Upload Image");
const selectedFile = ref(null);
const isSelecting = ref(false);
const cardid = ref(null);
const profile_publicid = ref(null);
const profileid = ref(null);
const studentno = ref(null);

async function initialize() {
	try {
		//   Get the Profile history on load of the page
		const { data: result } = await useFetch("/api/getProfileList");
		if (result) {
			const resultList = await updateImageUrls(result.value);
			if (resultList) {
				profileList.value = resultList;
			}
		}
	} catch (err) {
		// Handle errors (e.g., console.error or throw an error)
		console.error("Failed to fetch data: ", err);
		throw err;
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
		publicID.value = uuidv4();
		newImageName.value = new File([blob], `${publicID.value}.${ext}`, { type: `${image.type}` });

		if (image) {
			imagePreviewURL.value = URL.createObjectURL(image);
			URL.revokeObjectURL(image);
		} else {
			imagePreviewURL.value = null;
		}
	}
}

async function clearImagePreview() {
	imagePreviewURL.value = "";
	buttonText.value = "Upload Image";
}

async function cancelAddRecord() {
	dialog.value = false;
	imagePreviewURL.value = "";
	defaultButtonText.value = "Upload Image";
	loginForm.value?.reset();
	avatarImage.value = null;
}

async function onSubmit() {
	const { valid, errors } = await loginForm.value?.validate();
	loading.value = true;
	if (valid) {
		if (newImageName.value) {
			try {
				const formData = new FormData();
				formData.append('files', newImageName.value);
				try {
					const result = await axios.post(`${config.public.apiBase}/api/upload`, formData, {
						headers: {
							'Content-Type': 'multipart/form-data'
						}
					}).catch(err=>{
						console.log(err);
					});
					if (result) {
						console.log(result.data);

						const payload = {
							student_no: student_no.value,
							last_name: last_name.value,
							first_name: first_name.value,
							middle_name: middle_name.value,
							publicid: result.data[0].hash,
							image_url: result.data[0].url,
							image_id: result.data[0].id,
						};
						await axios.post(`/api/createProfile`, payload).then(() => {
							dialog.value = false;
							loginForm.value?.reset();
							imagePreviewURL.value = "";
							avatarImage.value = null;
							toast.success("Successfully created!");
							loading.value = false;
							newImageName.value = null;
							initialize();
						});

					}
				} catch (error) {
					console.error('Error uploading image: ', error);
					throw error;
				}

			} catch (error) {
				console.error(error);
				loading.value = false;
			}
		} else {
			console.error("No file selected");
			toast.error("No image selected!");
			loading.value = false;
		}
	} else {
		loading.value = false;
		console.log(errors[0].errorMessages[0]);
	}
}




// Function to loop through the array and update the image_url
async function updateImageUrls(students) {
	const myBase = await getImageServerUrl();
	return students.map((student) => {
		const updatedUrl = formatCurImageUrl(myBase, student.image_url); // Call your utility function
		return {
			...student,
			image_url: updatedUrl, // Update the image_url with the result of formatCurImageUrl
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

// Show Assign Card Dialog
async function showAssignCardDialog(item) {
	assignCardDialog.value = true;
	studentno.value = item.studentno;
	profile_publicid.value = item.publicid;
	profileid.value = item.id;
}

// Assing Card Function
async function assignCard() {
	const { valid, errors } = await assignCardForm.value?.validate();
	if (valid) {
		if (cardid.value) {
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
				initialize();
			} catch (error) {
				console.error(error);
			}
		}
	} else {
		console.log("Error", errors);
	}
}

// Delete Profile Function
async function showDeleteProfileDialog(item) {
	publicID.value = item.publicid;
	imageID.value = item.image_id;
	deleteProfileDialog.value = true;
}
async function deleteItem() {
	loading.value = true;
	try {
		const payload = {
			image_id: imageID.value,
		};
		await $fetch(`/api/profile/delete/${publicID.value}`, {
			method: "PUT",
			body: payload,
		});
		loading.value = false;
		deleteProfileDialog.value = false;
		toast.success("Profile deleted successfully!");
		initialize();
	} catch (error) {
		loading.value = false;
		console.error(error);
	}
}

onMounted(async () => {
	await initialize();
});
</script>
<style scoped>
.v-input__control {
	display: none;
}

.v-icon--left {
	margin-right: 8px;
}
</style>
