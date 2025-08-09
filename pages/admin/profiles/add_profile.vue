<template>
	<div class="p-4">
		<h1 class="text-3xl font-bold mb-6">Add Profile</h1>

		<!-- v-sheet equivalent -->
		<div class="mx-auto bg-purple-700 p-12 rounded-lg max-w-3xl">
			<!-- v-form equivalent (just a form tag, validation handled manually or by a library) -->
			<form @submit.prevent="onSubmit" ref="loginForm" class="bg-white rounded-lg shadow-sm">
				<!-- v-card-text equivalent -->
				<div class="p-6">
					<!-- v-row equivalent -->
					<div class="flex flex-col md:flex-row gap-6">
						<!-- v-col cols="6" (Image Upload) -->
						<div class="w-full md:w-1/2 flex flex-col items-center">
							<img
								:src="avatarImage ? imagePreviewURL : 'https://fakeimg.pl/400x400?text=Photo'"
								alt="Profile Photo"
								class="w-full h-[40vh] object-cover rounded-md border border-gray-200"
							/>

							<!-- v-file-input equivalent (hidden input + custom button) -->
							<input
								type="file"
								ref="fileInput"
								@change="onFileChange"
								accept="image/png, image/jpeg, image/bmp"
								class="hidden"
							/>
							<div class="flex items-center justify-center w-full mt-4">
								<button type="button" @click="triggerFileInput"
									class="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors normal-case flex items-center justify-center">
									<i class="mdi mdi-image mr-2"></i> Select Image
								</button>
								<button v-if="avatarImage" type="button" @click="clearImagePreview"
									class="ml-2 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center">
									<i class="mdi mdi-close"></i>
								</button>
							</div>
						</div>
						<!-- v-col cols="6" (Text Fields) -->
						<div class="w-full md:w-1/2 grid grid-cols-1 gap-4">
							<!-- v-text-field equivalents -->
							<div class="relative">
								<label for="studentNo" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Student No</label>
								<input id="studentNo" type="text" v-model="student_no"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
							<div class="relative">
								<label for="lastName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Last name</label>
								<input id="lastName" type="text" v-model="last_name"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
							<div class="relative">
								<label for="firstName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">First name</label>
								<input id="firstName" type="text" v-model="first_name"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
							<div class="relative">
								<label for="middleName" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Middle name</label>
								<input id="middleName" type="text" v-model="middle_name"
									class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
							</div>
						</div>
					</div>
				</div>
				<!-- v-card-actions equivalent -->
				<div class="p-6 border-t border-gray-200">
					<button type="submit"
						class="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors normal-case font-semibold">
						Submit
					</button>
				</div>
			</form>
		</div>

		<!------------------------------- START SNACKBAR ------------------------------->
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
		<!------------------------------- END SNACKBAR ------------------------------->
	</div>
</template>

<script lang="ts" setup>
//@ts-ignore
import { v4 as uuidv4 } from "uuid";

const { uploadImage } = useUtils();

const student_no = ref("");
const last_name = ref("");
const first_name = ref("");
const middle_name = ref("");
// const image = ref(""); // Unused, removed
// const imagePreview = ref(""); // Unused, removed
const imagePreviewURL = ref<string | null>(null);
const avatarImage = ref<File | null>(null); // Stores the actual File object for preview check

// const files = ref([]); // Unused, removed
// const name = ref(""); // Unused, removed
// const uploadResult = ref(null); // No longer needed here as it's directly used in onSubmit
const newImageName = ref<File | null>(null); // Stores the renamed file for upload
const publicID = ref("");

// Snackbar (custom implementation)
const snackbar = ref(false);
const snackbar_color = ref("");
const snackbar_msg = ref("");
const snackbar_icon = ref("");

const fileInput = ref<HTMLInputElement | null>(null); // Ref for the hidden file input

// Rules for validation (these are Vuetify-style rules, manual validation used in onSubmit)
const rules = ref({
	studno: [(value: string) => !!value || "Student no is requred"],
	lname: [(value: string) => !!value || "Last name is requred"],
	fname: [(value: string) => !!value || "First name is requred"],
	mname: [(value: string) => !!value || "Middle name is requred"],
});
const loginForm = ref<HTMLFormElement | null>(null); // Refers to the <form> element
const valid = ref(true); // This variable won't be automatically updated by a Vuetify form anymore.

async function onFileChange(event: Event) {
	const target = event.target as HTMLInputElement;
	const imageFile = target.files ? target.files[0] : null;

	if (!imageFile) {
		clearImagePreview();
		return;
	}

	// Generate UUID
	const genId = uuidv4();
	const originalName = imageFile.name;
	const ext = originalName.split(".").pop();
	const blob = imageFile.slice(0, imageFile.size);
	publicID.value = genId; // Store the generated ID, assuming it's used as a hash later
	newImageName.value = new File([blob], `${genId}.${ext}`, { type: imageFile.type });

	imagePreviewURL.value = URL.createObjectURL(imageFile);
	avatarImage.value = imageFile; // Store the original file object for preview check
}

function triggerFileInput() {
    fileInput.value?.click(); // Programmatically click the hidden file input
}

function clearImagePreview() {
	if (imagePreviewURL.value) {
		URL.revokeObjectURL(imagePreviewURL.value); // Clean up previous object URL
	}
	imagePreviewURL.value = null;
	avatarImage.value = null; // Clear the selected file
	newImageName.value = null; // Clear the processed file for upload
	if (fileInput.value) {
		fileInput.value.value = ''; // Clear the actual file input
	}
}

async function onSubmit() {
    // Manual validation checks
    if (!student_no.value) {
        snackbar_color.value = "error";
        snackbar_icon.value = "mdi-alert-circle";
        snackbar_msg.value = "Student no is required!";
        snackbar.value = true;
        return;
    }
    if (!last_name.value) {
        snackbar_color.value = "error";
        snackbar_icon.value = "mdi-alert-circle";
        snackbar_msg.value = "Last name is required!";
        snackbar.value = true;
        return;
    }
    if (!first_name.value) {
        snackbar_color.value = "error";
        snackbar_icon.value = "mdi-alert-circle";
        snackbar_msg.value = "First name is required!";
        snackbar.value = true;
        return;
    }
    if (!middle_name.value) {
        snackbar_color.value = "error";
        snackbar_icon.value = "mdi-alert-circle";
        snackbar_msg.value = "Middle name is required!";
        snackbar.value = true;
        return;
    }
    if (!newImageName.value) {
        snackbar_color.value = "error";
        snackbar_icon.value = "mdi-alert-circle";
        snackbar_msg.value = "Image is required!";
        snackbar.value = true;
        return;
    }

    try {
        const imageUploadResult = await uploadImage(newImageName.value);

        if (imageUploadResult && imageUploadResult[0]) {
            const payload = {
                student_no: student_no.value,
                last_name: last_name.value,
                first_name: first_name.value,
                middle_name: middle_name.value,
                publicid: imageUploadResult[0].hash, // Assuming 'hash' is intended for 'publicid' based on original code
                image_url: imageUploadResult[0].url,
            };

            const profileResult = await $fetch(`/api/createProfile`, {
                method: "POST",
                body: payload,
            });

            if(profileResult){
                // Reset form fields and image
                student_no.value = '';
                last_name.value = '';
                first_name.value = '';
                middle_name.value = '';
                clearImagePreview(); // Clears image input, preview, and associated refs

                snackbar_color.value = "success";
                snackbar_icon.value = "mdi-check-circle";
                snackbar_msg.value = "Profile successfully submitted!";
                snackbar.value = true;
            }
        } else {
            snackbar_color.value = "error";
            snackbar_icon.value = "mdi-alert-circle";
            snackbar_msg.value = "Image upload failed!";
            snackbar.value = true;
        }
    } catch (error: any) {
        console.error(error);
        snackbar_color.value = "error";
        snackbar_icon.value = "mdi-alert-circle";
        snackbar_msg.value = "Error submitting profile: " + (error.message || "An unknown error occurred.");
        snackbar.value = true;
    }
}
</script>

<style scoped>
/* Transition for Snackbar */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>