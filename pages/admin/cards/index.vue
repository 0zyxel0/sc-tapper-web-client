<template>
	<div>
		<v-row>
			<v-col>
				<!-- <v-btn class="mb-3" color="purple" @click="dialog = true">Assign Card</v-btn> -->
				<v-card elevation="0">
					<v-card-title class="d-flex align-center pe-2">
						<v-icon icon="mdi-credit-card-multiple" start></v-icon> Cards

						<v-spacer></v-spacer>

						<v-text-field v-model="search" density="compact" label="Search" prepend-inner-icon="mdi-magnify"
							variant="solo-filled" flat hide-details single-line></v-text-field>
					</v-card-title>

					<v-divider></v-divider>
					<v-data-table v-model:search="search" :headers="headers" :items="profileList">

					</v-data-table>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>
<script setup>
definePageMeta({
	layout: "admin",
});
const firstName = ref(null);
const lastName = ref(null);
const cardNumber = ref(null);
const search = ref(null);
const headers = ref([
	{
		title: "Card ID",
		align: "start",
		sortable: false,
		key: "cardid",
	},
	{ title: "Profile Public ID", key: "profile_publicid" },
	{ title: "Profile ID", key: "profileid" },
	{ title: "Actions", key: "actions", sortable: false },
]);

const profileList = ref([
	{
		cardid: "Cosmos GTX 1660 Super",
		profile_publicid: "5.png",
		profileid: 299.99,
		rating: 4,
		stock: false,
		actions: ""
	},
]);

const cardList = ref([]);

async function initialize() {
	try {
		// Get the list of assign card on load of the page
		let { data: card_list, error } = await $fetch(`/api/getCardList`)
		if (card_list) {
			profileList.value = card_list;
		}

	} catch (error) {
		console.error("Failed to fetch data: ", error);
		throw error;
	}
}

onMounted(() => {
	initialize();
})
</script>
