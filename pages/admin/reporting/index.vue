<template>
  <div class="p-4">
    <h1 class="text-2xl font-semibold mb-4">Time In / Time Out Report</h1>

    <!-- Date Picker -->
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div class="w-full sm:w-1/3 md:w-1/4 relative">
        <label for="datePicker" class="absolute left-3 -top-2 text-xs text-gray-500 bg-white px-1">Select Date</label>
        <input type="date" id="datePicker" v-model="selectedDate" @change="fetchReportData"
          class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mb-6 flex gap-3">
      <button @click="downloadCSV"
        class="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors normal-case">
        Download as CSV
      </button>
      <button @click="downloadExcel"
        class="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors normal-case">
        Download as Excel
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ header.title }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="reportData.length === 0">
              <td :colspan="headers.length" class="px-6 py-4 text-center text-gray-500">
                No data available for the selected date.
              </td>
            </tr>
            <tr v-for="item in reportData" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full object-cover" :src="item.image_url" :alt="item.first_name" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.first_name }} {{ item.last_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.studentno }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.time_in) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.time_out) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from "axios";
import * as XLSX from 'xlsx'

definePageMeta({
  layout: "admin",
})

const selectedDate = ref(new Date().toISOString().slice(0, 10)) // default to today
const reportData = ref([])

// Composable utility function import (assuming it's defined and provides these functions)
const { formatCurImageUrl, getImageServerUrl } = useUtils();

// Headers for the table
const headers = [
  { title: "Avatar", key: "avatar", sortable: false },
  { title: "Name", key: "name" },
  { title: "Student No.", key: "studentno" },
  { title: "Time In", key: "time_in" },
  { title: "Time Out", key: "time_out" },
]

// Utility function to format date strings
function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'; // Handle cases where time_out might be null
  const date = new Date(dateStr);
  // You might want a more specific format, e.g., 'MM/DD/YYYY hh:mm A'
  return date.toLocaleString();
}

// Function to fetch report data from the API
async function fetchReportData() {
  if (!selectedDate.value) {
    reportData.value = []; // Clear data if no date is selected
    return;
  }

  try {
    const response = await axios.post('/api/reports/badgeHistory', { date: selectedDate.value });
    if (response && response.data) {
      // Assuming response.data is an array of objects
      // We need to update image URLs after fetching, similar to previous components
      const baseUrl = await getImageServerUrl(); // Get your image server base URL
      reportData.value = response.data.map((item: any) => ({
        ...item,
        image_url: formatCurImageUrl(baseUrl, item.image_url) // Format the image URL
      }));
    } else {
      reportData.value = [];
    }
  } catch (err) {
    console.error("Error fetching report:", err);
    reportData.value = [];
    // Optionally show a toast notification here
  }
}

// Initial fetch when the component is mounted
onMounted(fetchReportData)

// CSV Download function
function downloadCSV() {
  const rows = reportData.value.map(item => ({
    Avatar: item.image_url, // URL will be included as text
    Name: `${item.first_name} ${item.last_name}`,
    'Student No': item.studentno,
    'Time In': formatDate(item.time_in),
    'Time Out': formatDate(item.time_out)
  }))

  let csvContent = "data:text/csv;charset=utf-8,"
  const headersRow = ["Avatar", "Name", "Student No", "Time In", "Time Out"].join(",") + "\n"
  csvContent += headersRow
  rows.forEach(row => {
    // Escape values that might contain commas or quotes for proper CSV formatting
    const rowValues = Object.values(row).map(value => {
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`; // Enclose in quotes and escape existing quotes
      }
      return stringValue;
    }).join(",");
    csvContent += rowValues + "\n"
  })

  // Create a download link and trigger it
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `Time_Report_${selectedDate.value}.csv`) // Dynamic filename
  document.body.appendChild(link); // Required for Firefox
  link.click()
  document.body.removeChild(link); // Clean up
}

// Excel Download function
function downloadExcel() {
  const ws = XLSX.utils.json_to_sheet(reportData.value.map(item => ({
    Avatar_URL: item.image_url, // Changed to Avatar_URL for clarity in Excel
    Name: `${item.first_name} ${item.last_name}`,
    'Student No': item.studentno,
    'Time In': formatDate(item.time_in),
    'Time Out': formatDate(item.time_out)
  })))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Time Report")
  XLSX.writeFile(wb, `Time_Report_${selectedDate.value}.xlsx`) // Dynamic filename
}
</script>

<style scoped>
/* No specific styles needed beyond Tailwind utilities, as all Vuetify styling is replaced */
</style>