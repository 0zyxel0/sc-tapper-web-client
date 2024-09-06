<template>
	<v-layout>
		<v-app-bar title="Tapper - ID Management"></v-app-bar>
		<NavigationBar></NavigationBar>
		<v-main style="height: 400px">
			<v-container>
				<v-row>
					<v-col>
						<v-btn class="mb-3" color="purple" @click="dialog = true">Add Record</v-btn>
						<v-card>
							<v-card-title class="d-flex align-center pe-2">
								<v-icon icon="mdi-account"></v-icon> &nbsp; Profiles

								<v-spacer></v-spacer>

								<v-text-field
									v-model="search"
									density="compact"
									label="Search"
									prepend-inner-icon="mdi-magnify"
									variant="solo-filled"
									flat
									hide-details
									single-line
								></v-text-field>
							</v-card-title>

							<v-divider></v-divider>
							<v-data-table v-model:search="search" :items="profileList" :headers="headers">
								<template v-slot:[`item.image_url`]="{ item }">
									<v-avatar :image="item.image_url" size="45" tile></v-avatar>
								</template>
								<template v-slot:[`item.actions`]="{ item }">
									<v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil </v-icon>
									<v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
								</template>
							</v-data-table>
						</v-card>
					</v-col>
				</v-row>

				<!-- DIALOG BOX -->
				<v-dialog width="auto" v-model="dialog" persistent>
					<v-card title="Add Record" width="400">
						<v-divider class="mt-3"></v-divider>
						<v-card-text>
							<v-form ref="form">
								<v-text-field v-model="student_no" :rules="rules.studentno" label="Student No" required></v-text-field>
								<v-text-field v-model="last_name" :rules="rules.lastname" label="Lastname" required></v-text-field>
								<v-text-field v-model="first_name" :rules="rules.firstname" label="Firstname" required></v-text-field>
								<v-text-field v-model="middle_name" :rules="rules.middlename" label="Middlename" required></v-text-field>
								<v-divider></v-divider>

								<v-card>
									<v-card-text v-if="showUploader">
										<v-file-input accept="image/*" label="Profile Image" v-model="imageFile" @change="handleImageChange"> </v-file-input>

										<v-btn @click="uploadImage" block color="primary">Upload</v-btn>
									</v-card-text>
									<v-card-text v-else>
                    <v-card-title>Profile Picture</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-img v-if="previewImage" :src="previewImage" alt="Preview" />
                    </v-card-text>										
									</v-card-text>
								</v-card>

								<div class="d-flex flex-column mb-3">
									<v-btn class="mt-4" color="success" block @click="submitRecord"> Submit </v-btn>

									<v-btn class="mt-4" color="error" block @click="dialog = false"> Cancel </v-btn>
								</div>
							</v-form>
						</v-card-text>
					</v-card>
				</v-dialog>

				<!-- SNACKBAR -->
				<v-snackbar v-model="snackbar" location="top right">
					Successfully submitted!

					<template v-slot:actions>
						<v-btn density="compact" icon="mdi-close" @click="snackbar = false"> </v-btn>
					</template>
				</v-snackbar>
			</v-container>
		</v-main>
	</v-layout>
</template>
<script setup>
import { v4 as uuidv4 } from "uuid";
const client = useSupabaseClient();
const student_no = ref(null);
const last_name = ref(null);
const first_name = ref(null);
const middle_name = ref(null);
const search = ref(null);
const dialog = ref(false);
const snackbar = ref(false);
const imageFile = ref(null);
const previewImage = ref(null);
const showUploader = ref(true);
const form = ref([]);
const headers = ref([
	{
		title: "Student #",
		align: "start",
		sortable: false,
		key: "studentno",
	},
	{ title: "Photo", key: "image_url", sortable: false },
	{ title: "Lastname", key: "last_name", sortable: false },
	{ title: "Firstname", key: "first_name", sortable: false },
	{ title: "Middlename", key: "middle_name", sortable: false },
	{ title: "Actions", key: "actions", sortable: false },
]);
const rules = ref({
	studentno: [(v) => !!v || "Student No is required"],
	lastname: [(v) => !!v || "Lastname is required"],
	firstname: [(v) => !!v || "Firstname is required"],
	middlename: [(v) => !!v || "Middlename is required"],
});

const profileList = ref([]);

const uploadImage = async () => {
	const initialBaseUrl = "http://127.0.0.1:54321/storage/v1/object/public/avatars/";
	if (!imageFile.value) return;
	console.log(imageFile.value[0]);
	const { data, error } = await client.storage.from("avatars").upload(uuidv4(), imageFile.value[0]);
	previewImage.value = initialBaseUrl + data.path;
	showUploader.value = false;
	if (error) {
		console.error(error);
		return;
	}

	console.log("Image uploaded successfully:", data.publicUrl);
};
async function initialize() {
	try {
		//   Get the Card history on load of the page
		let { data: profile_list, error } = await client.from("profiles").select("*");
		if (profile_list) {
			profileList.value = profile_list;
		}
	} catch (error) {
		// Handle errors (e.g., console.error or throw an error)
		console.error("Failed to insert document:", error);
		throw error;
	}
}

async function submitRecord() {
	// console.log(data);
	console.log(form.value.validate());
	const { valid } = await form.value.validate();
	if (valid) {
		let payload = {
			studentno: student_no.value,
			last_name: last_name.value,
			first_name: first_name.value,
			middle_name: middle_name.value,
			image_url: previewImage.value,
		};
		const { data, error } = await client.from("profiles").insert([payload]).select();

		initialize();
		form.value.reset();
		snackbar.value = true;
	}
}

onMounted(() => {
	initialize();
});
</script>
