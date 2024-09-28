<template>
	<v-app>
		<v-theme-provider theme="dark" with-background>
			<v-row no-gutters class="ma-4">
				<v-col cols="12" align="center">
					<v-card class="top-container">
						<div class="ma-5 align-center justify-center text-center">
							<v-row justify="center">
								<v-col cols="6" md="2" sm="4">
									<span class="nuxt-date">
										<NuxtTime :datetime="Date.now()" year="numeric" month="long" day="numeric" />
									</span>
								</v-col>
								<v-col cols="6" md="2" sm="4">
									<span class="nuxt-time">
										<NuxtTime :datetime="date" hourCycle="h12" hour="numeric" minute="numeric" second="numeric" />
									</span>
								</v-col>
							</v-row>
						</div>

						<div class="d-flex align-center justify-center">
							<v-card v-if="!currentProfile" elevation="0">
								<v-img class="bg-grey-lighten-2 nuxt-img" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" cover></v-img>
								<v-card-title class="waiting-title text-center mb-5"> {{ cardMessage }} </v-card-title>
							</v-card>
							<v-card v-else elevation="0">
								<v-img class="bg-grey-lighten-2 img-design nuxt-img" aspect-ratio="1/1" :src="currentPhoto" cover></v-img>
								<v-card elevation="0" v-if="currentProfile">
									<v-table>
										<tbody>
											<tr>
												<td class="studentno-title">Student No:</td>
												<td class="studentno-value">{{ currentProfile?.profile.studentno }}</td>
											</tr>
											<tr>
												<td class="student-name-title">Name:</td>
												<td class="student-name-value">{{ currentProfile?.profile.first_name }} {{ currentProfile.profile.last_name }}</td>
											</tr>
										</tbody>
									</v-table>
								</v-card>
							</v-card>
						</div>
					</v-card>
				</v-col>
			</v-row>
			<v-row no-gutters class="ma-4">
				<v-card class="bottom-container">
					<v-card-title class="mt-2">
						<v-row no-gutters dense>
							<v-col align="center" v-if="isSubmitting == false">
								<v-form @submit.prevent="handleSubmit" style="opacity: 100%">
									<v-text-field ref="cardInputRef" v-model="cardid" variant="outlined" label="Card ID" :disabled="isSubmitting"></v-text-field>
								</v-form>
							</v-col>
							<v-col align="center" v-else>
								<v-progress-circular indeterminate></v-progress-circular>
								<v-divider class="ma-6"></v-divider>
							</v-col>
						</v-row>
					</v-card-title>
					<v-row no-gutters dense>
						<v-col>
							<v-infinite-scroll direction="horizontal">
								<template v-for="item in historyList" :key="item">
									<div class="pa-1" v-if="item">
										<v-card width="120px" class="elevation-0">
											<v-img height="90px" :src="base_url + item?.profile_avatar" contain></v-img>
											<v-card-text>{{ item?.profileid }}</v-card-text>
										</v-card>
									</div>
								</template>
								<template v-slot:loading> ... </template>
							</v-infinite-scroll>
						</v-col>
					</v-row>
				</v-card>
			</v-row>
		</v-theme-provider>
	</v-app>
</template>

<script setup>
import axios from "axios";
const config = useRuntimeConfig();
// Composable utility function import
const { getBackendUrl, formatCurImageUrl } = useUtils();
const base_url = config.public.apiBase;
const cardid = ref(null);
const currentProfile = ref(null);
const currentPhoto = ref(null);
const isSubmitting = ref(false);
const cooldownTimer = ref(null);
const historyList = ref([]);
const submitCooldown = 2000; // 2 seconds in milliseconds
const cardInputRef = ref(null);
const date = ref(new Date());
const cardMessage = ref("Scanner Ready");
async function initialize() {
	try {
		const result = await axios.get("/api/getGateHistory");
		if (result) {
			historyList.value = result.data;
		}
	} catch (err) {
		console.log(err);
	}
}

const changeDate = () => {
	date.value = Date.now();
};

async function clearProfileReading() {
	currentProfile.value = null;
}

async function searchCardProfile(id) {
	try {
		const result = await axios.get(`/api/getCardProfile?cardid=${id}`);
		if (result) {
			if (result.data.length == 0) {
				cardMessage.value = "Card Not Registered. Please Try Again";
				return false;
			} else {
				return result.data[0];
			}
		}
	} catch (err) {
		console.log(err);
	}
}

async function handleSubmit() {
	isSubmitting.value = true;
	if (cardid.value == null || cardid.value == "") {
		cardMessage.value = "Loading";
		startCooldown();
	} else {
		const myProfileDetails = await searchCardProfile(cardid.value);
		if (myProfileDetails == false) {
			clearInput();
			startCooldown();
		}
		if (myProfileDetails) {
			// Add Delay to the Request
			currentProfile.value = myProfileDetails;
			currentPhoto.value = base_url + myProfileDetails.profile.image_url;
			// await new Promise((resolve) => setTimeout(resolve, 2000));
			clearInput();
			isSubmitting.value = false;
			startCooldown();
		}
	}
}

function clearInput() {
	cardid.value = "";
}

function startCooldown() {
	cooldownTimer.value = setTimeout(() => {
		isSubmitting.value = false;
		cooldownTimer.value = null;
		clearInput();
		clearProfileReading();
		cardMessage.value = "Scanner Ready";
	}, submitCooldown);
}

// Function to loop through the array and update the image_url
async function updateImageUrls(students) {
	const myBase = await getBackendUrl();
	return students.map((student) => {
		const updatedUrl = formatCurImageUrl(myBase, student.image_url); // Call your utility function
		return {
			...student,
			image_url: updatedUrl, // Update the image_url with the result of formatCurImageUrl
		};
	});
}

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

onBeforeUnmount(() => {
	clearTimeout(cooldownTimer.value);
});

onMounted(() => {
	setInterval(() => {
		date.value = Date.now();
	});
	initialize();
	nextTick(() => {
		if (cardInputRef.value) {
			// Check if the ref is available
			cardInputRef.value.focus();
		} else {
			console.warn('Ref "cardInputRef" is not available for focusing the input field.');
		}
	});
});
</script>
<style scoped>
.bottom-container {
	width: 100vw;
}

.studentno-title {
	font-size: 16px;
	text-transform: uppercase;
}

.studentno-value {
	font-size: 18px;
	text-transform: uppercase;
	font-weight: bold;
}

.student-name-title {
	font-size: 16px;
	text-transform: uppercase;
}

.student-name-value {
	font-size: 18px;
	text-transform: uppercase;
	font-weight: bold;
}

.nuxt-img {
	height: 60vh;
	width: 60vh;
}

.img-design {
	border: 5px solid white;
	border-radius: 10px;
}

.waiting-title {
	font-size: 1.5vw;
	margin-top: 20px;
}

.nuxt-date {
	font-size: 4vh;
	text-transform: uppercase;
}

.nuxt-time {
	font-size: 4vh;
	text-transform: uppercase;
}

@media only screen and (max-width: 820px) {
	.top-container {
		height: 73vh;
	}

	.bottom-container {
		height: 23vh;
		width: 100vw;
	}

	.nuxt-date {
		font-size: 4vw;
		text-transform: uppercase;
	}

	.nuxt-time {
		font-size: 4vw;
		text-transform: uppercase;
	}

	.nuxt-img {
		height: 50vh;
		width: 50vh;
	}

	.waiting-title {
		font-size: 4vw;
		margin-top: 20px;
	}

	.studentno-title {
		font-size: 25px;
		text-transform: uppercase;
	}

	.studentno-value {
		font-size: 25px;
		text-transform: uppercase;
		font-weight: bold;
	}

	.student-name-title {
		font-size: 25px;
		text-transform: uppercase;
	}

	.student-name-value {
		font-size: 25px;
		text-transform: uppercase;
		font-weight: bold;
	}
}
</style>
