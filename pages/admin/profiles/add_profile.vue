<template>
	<div>
		<h1>Add Profile</h1>

		<v-sheet class="mx-auto bg-deep-purple pa-12" width="750" rounded>
			<v-form v-model="valid" ref="loginForm" lazy-validation>
				<v-card>
					<v-card-text>
						<v-row>
							<v-col cols="6">
								<!-- <v-file-input v-model="image" />
                <v-img :src="url" /> -->

								<!-- <v-img :src="imagePreview"
                  lazy-src="https://picsum.photos/id/11/10/6" height="30vh"></v-img>
                <v-file-input v-model="image" accept="image/png, image/jpeg, image/bmp" placeholder="Pick an image"
                  prepend-icon="mdi-camera" @change="selectImage" @click:clear="clearImagePreview()"
                  label="Image"></v-file-input> -->

								<v-img
									:src="avatarImage ? imagePreviewURL : 'https://fakeimg.pl/400x400?text=Photo'"
									alt=""
									lazy-src="https://fakeimg.pl/400x400?text=Photo"
									style="max-width: 100%; object-fit: cover"
									height="40vh"
								/>

								<v-file-input
									v-model="avatarImage"
									accept="image/png, image/jpeg, image/bmp"
									label="Image"
									required
									@change="onFileChange"
									@click:clear="clearImagePreview()"
								></v-file-input>
							</v-col>
							<v-col cols="6">
								<v-text-field v-model="student_no" :rules="rules.studno" label="Student No"></v-text-field>
								<v-text-field v-model="last_name" :rules="rules.lname" label="Last name"></v-text-field>
								<v-text-field v-model="first_name" :rules="rules.fname" label="First name"></v-text-field>
								<v-text-field v-model="middle_name" :rules="rules.mname" label="Middle name"></v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions>
						<v-btn class="mt-4" color="primary" variant="outlined" size="large" block @click.prevent="onSubmit">Submit</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-sheet>

		<!-- <v-card>
      <v-card-text>
        <label>Enter Company Name</label>
        <input type="text" v-model="name"/>
        <v-text-field v-model="name"></v-text-field>

        <label>Select Header Image</label>
       
        <v-file-input accept="image/png, image/jpeg, image/bmp" label="Image"
        @change="handleFileSelection( $event )"></v-file-input>

        <v-btn @click="submit">Submit</v-btn>
      </v-card-text>
    </v-card> -->
	</div>
</template>

<script lang="ts" setup>
import { useUseUpload } from "~/composables/useUpload";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";

const { uploadImage } = useUtils();

const student_no = ref("");
const last_name = ref("");
const first_name = ref("");
const middle_name = ref("");
const image = ref("");
const imagePreview = ref("");
const imagePreviewURL = ref(null);
const avatarImage = ref(null);

const files = ref([]);
const name = ref("");
const uploadResult = ref(null);
const newImageName = ref(null);
const publicID = ref("");

// const studnoRules = [(v) => !!v || 'Student no is required'];
// const lnameRules = [(v) => !!v || 'Student no is required'];
// const fnameRules = [(v) => !!v || 'Student no is required'];
// const mnameRules = [(v) => !!v || 'Student no is required'];

const rules = ref({
	studno: [(value: string) => !!value || "Student no is requred"],
	lname: [(value: string) => !!value || "Last name is requred"],
	fname: [(value: string) => !!value || "First name is requred"],
	mname: [(value: string) => !!value || "Middle name is requred"],
});
const loginForm = ref(null);
const valid = ref(true);

async function onFileChange(event) {
	// Generate UUID
	const genId = uuidv4();

	const image = event.target.files[0];
	const originalName = event.target.files[0].name;
	const ext = originalName.split(".").pop();
	const blob = image.slice(0, image.size);
	publicID.value = genId;
	newImageName.value = new File([blob], `${genId}.${ext}`, { type: `${image.type}` });

	if (image) {
		imagePreviewURL.value = URL.createObjectURL(image);
		URL.revokeObjectURL(image);
	} else {
		imagePreviewURL.value = null;
	}

	console.log("Current name: ", image);
	console.log("New name: ", newImageName.value);
	console.log("Extension: ", ext);
}

async function clearImagePreview() {
	imagePreviewURL.value = "";
}

async function onSubmit() {
	const { valid, errors } = await loginForm.value?.validate();
	if (valid) {
		if (newImageName.value) {
			try {
				console.log();
				const imageUploadResult = await uploadImage(newImageName.value);
				console.log(imageUploadResult);
				console.log("Success", imageUploadResult[0].name);
				console.log("Image Url:", imageUploadResult[0].url);
				console.log("Hash: ", imageUploadResult[0].hash);
				if (imageUploadResult) {
					const payload = {
						student_no: student_no.value,
						last_name: last_name.value,
						first_name: first_name.value,
						middle_name: middle_name.value,
						publicid: imageUploadResult[0].hash,
						image_url: imageUploadResult[0].url,
					};
					console.log("payload ", payload);
					const profileResult = await $fetch(`/api/createProfile`, {
						method: "POST",
						body: payload,
					});
          if(profileResult){
            loginForm.value?.reset();
            console.log("Successfully Submited!");
          }					
				}
			} catch (error) {
				console.error(error);
			}
		} else {
			console.error("No file selected");
		}
	}
}

// async function selectImage(e) {
//   const file = e.target.files[0];
//   if(!file) return;
//   const readData = (f) =>
//   new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result);
//     reader.readAsDataURL(f);
//   });
//   console.log(e);
//   const data = await readData(file);
//   imagePreview.value = data;
// }

// async function clearImagePreview() {
//   imagePreview.value = "";
// }

// async function onFileChange(payload) {
//   const file = payload.target.files[0];
//   if (file) {
//     imagePreviewURL.value = URL.createObjectURL(file);
//     URL.revokeObjectURL(file);
//   }
//   else {
//     imagePreviewURL.value = null;
//   }
// }

const handleFileSelection = (event) => {
	// imagePreviewURL.value = event.target.files[0];
	//console.log(uploadedFiles);
	// for ( let i = 0; i < uploadedFiles.lenght; i++) {
	//   files.value.push( uploadedFiles[i] );
	// }
};

// async function submit() {
//   let formData = new FormData();

//   formData.append('name', imagePreviewURL.value);
//   console.log(imagePreviewURL.value);
//   console.log(formData);

//   // for(let i = 0; i < files.value.length; i++) {
//   //   formData.append('images['+i+']', files.value[i]);
//   // }

//   await $fetch('/api/uploadImage', {
//     method: 'POST',
//     body: formData
//   },)
// }
</script>

<style></style>
