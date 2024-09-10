<template>
    <div>
        <v-navigation-drawer class="bg-deep-purple" theme="dark" permanent>
		<v-list>
			<v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/"></v-list-item>
			<v-list-item prepend-icon="mdi-credit-card" title="Cards" to="/admin/cards"></v-list-item>
			<v-list-item prepend-icon="mdi-account" title="Profiles" to="/admin/profiles"></v-list-item>
			<v-list-item prepend-icon="mdi-gate" title="Gate" to="/"></v-list-item>
		</v-list>

		<template v-slot:append>
			<div class="pa-2">
				<v-btn block> Logout </v-btn>
			</div>
		</template>
	</v-navigation-drawer>
    </div>
	
</template>
