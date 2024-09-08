<template>
	<div>
		<v-row>
			<v-col>
				<v-card elevation="0">
					<v-card-title class="d-flex align-center pe-2">
						<v-icon icon="mdi-credit-card-multiple" start></v-icon> Cards

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
					<v-data-table v-model:search="search" :headers="headers" :items="profileList">
						<template v-slot:item.actions="{ item }">
							<v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil </v-icon>
							<v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
						</template>
						<template v-slot:no-data>
							<v-btn color="primary" @click="initialize"> Reset </v-btn>
						</template>
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
const profileList = ref([]);
const cardList = ref([]);
async function initialize() {
	try {
		// Get the list of assign card on load of the page
		const { data: card_list } = await useFetch(`/api/getCardList`);
		if (card_list) {
			profileList.value = card_list.value;
		}
	} catch (error) {
		console.error("Failed to fetch data: ", error);
		throw error;
	}
}

function editItem(item) {
	console.log(item);
}

function deleteItem(item){
	console.log(item);
}

onMounted(async () => {
	await initialize();
});
</script>
