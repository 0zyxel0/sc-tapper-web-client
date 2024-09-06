<template>

	<v-container>
		<v-row>
			<v-col cols="12">
				<v-card>
					<v-card-text>
						<v-row justify="center">
							<v-col cols="12" align="center">
								<v-container v-if="!currentProfile">
									<v-img :width="400" height="400px" aspect-ratio="1/1" cover
										src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-img>
								</v-container>
								<v-container v-else>
									<v-img :width="400" height="400px" aspect-ratio="1/1" cover
										:src="currentProfile.profiles.image_url"></v-img>
								</v-container>
							</v-col>
						</v-row>
						<v-row>
							<v-col>
								<v-btn v-if="!currentProfile" block variant="flat" disabled>Waiting for
									Card</v-btn>
								<v-btn v-else color="green" block variant="flat">{{
									currentProfile.profiles.studentno }}</v-btn>
							</v-col>
						</v-row>
						<v-row>
							<v-col align="center">
								<v-form @submit.prevent="handleSubmit" style="opacity: 100%">
									<v-text-field ref="cardInputRef" v-model="cardid" label="Card ID"
										:disabled="isSubmitting"></v-text-field>
									<v-btn :disabled="isSubmitting" type="submit" color="primary">Submit</v-btn>
								</v-form>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col cols="12" align="center">
				<v-card>
					<v-infinite-scroll direction="horizontal">
						<template v-for="(item) in historyList" :key="item">
							<v-card width="250px">
								<v-img height="100px" src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
									cover></v-img>
								<v-card-text>{{ item.profileid || "asdf" }}</v-card-text>
							</v-card>
						</template>
						<template v-slot:loading>
							...
						</template>
					</v-infinite-scroll>
					<v-infinite-scroll direction="horizontal" @load="load">
						<template v-for="(item, index) in historyList" :key="item">
							<div :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
								Item #{{ item.profileid }}
							</div>
						</template>
						<template v-slot:loading>
							...
						</template>
					</v-infinite-scroll>
				</v-card>
			</v-col>
		</v-row>


	</v-container>

</template>

<script setup>
import { createClient } from "@supabase/supabase-js";
// Create a single supabase client for interacting with your database
const SUPABASE_URL = "http://localhost:54321";
const supabase = createClient(
	SUPABASE_URL,
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
);

const cardid = ref(null);
const currentProfile = ref(null);
const isSubmitting = ref(false);
const cooldownTimer = ref(null);
// const historyList = ref([]);
//const historyList = Array.from({ length: 10 }, (k, v) => v + 1)
const historyList = ref([])

const submitCooldown = 2000; // 2 seconds in milliseconds
const cardInputRef = ref(null);

async function initialize() {
	try {
		//   Get the Card history on load of the page
		let { data: gate_history, error } = await supabase.from("gate_history").select("id, profileid");
		if (gate_history) {
			historyList.value = gate_history;
			console.log("History List", historyList.value)
		}
	} catch (error) {
		// Handle errors (e.g., console.error or throw an error)
		console.error("Failed to insert document:", error);
		throw error;
	}
}

async function load({ done }) {
	setTimeout(() => {
		historyList.push(...Array.from({ length: 5 }, (k, v) => v + historyList.at(-1) + 1))

		done('ok')
	}, 2000)
}


async function clearProfileReading() {
	currentProfile.value = null;
}

async function searchCardProfile(id) {
	if (id == "") {
		console.log("No ID Value");
		return;
	}
	const { data: cards, error } = await supabase
		.from("cards")
		.select("*, profiles(*)")
		// Filters
		.eq("cardid", id);
	if (cards) {
		currentProfile.value = cards[0];
		return cards;
	}
}

async function handleSubmit() {
	isSubmitting.value = true;

	// Your form submission logic here
	// (e.g., call an API, handle errors)
	const myProfileDetails = await searchCardProfile(cardid.value);
	if (myProfileDetails) {
		console.log(myProfileDetails);
		console.log("myProfileDetais", myProfileDetails)
	}
	// Simulate successful submission after 1 second
	await new Promise((resolve) => setTimeout(resolve, 2000));
	await clearProfileReading();
	const { data, error } = await supabase
		.from("gate_history")
		.insert([{ cardid: cardid.value, profileid: myProfileDetails[0].profileid }])
		.select();
	if (data) {
		console.log(data);
		console.log("Data", myProfileDetails[0])
	}
	// const response = await database.createDocument("65f3d82c462083be74d6", "65fcc0e0dcd20c23fced", ID.unique(), {
	// 	profile_publicid: "asdfadsfasdfadsf",
	// 	cardid: "asdfasdfasdf",
	// });
	clearInput();
	startCooldown();
}

function clearInput() {
	cardid.value = "";
}

function startCooldown() {
	cooldownTimer.value = setTimeout(() => {
		isSubmitting.value = false;
		cooldownTimer.value = null;
		initialize();
	}, submitCooldown);
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
