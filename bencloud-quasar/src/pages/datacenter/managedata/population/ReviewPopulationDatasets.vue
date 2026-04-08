<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Population datasets</div>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      v-model:pagination="pagination"
      :rows-per-page-options="[5, 10, 25, 50]"
      :loading="loading"
      binary-state-sort
      @request="onRequest"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

function formatYears(years) {
  if (Array.isArray(years)) {
    return years.join(", ");
  }
  return years != null ? String(years) : "";
}

export default defineComponent({
  name: "ReviewPopulationDatasets",

  setup() {
    const rows = ref([]);
    const loading = ref(false);
    const pagination = ref({
      sortBy: "name",
      descending: false,
      page: 1,
      rowsPerPage: 25,
      rowsNumber: 0,
    });

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left",
        field: "name",
        sortable: true,
      },
      {
        name: "id",
        label: "ID",
        align: "left",
        field: "id",
        sortable: true,
      },
      {
        name: "grid_definition_id",
        label: "Grid definition ID",
        align: "left",
        field: "grid_definition_id",
        sortable: true,
      },
      {
        name: "years",
        label: "Years",
        align: "left",
        field: (row) => formatYears(row.years),
        sortable: false,
      },
    ];

    function onRequest(props) {
      loadPopulationDatasets(props);
    }

    function loadPopulationDatasets(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      loading.value = true;
      axios
        .get(process.env.API_SERVER + "/api/population-datasets-info", {
          params: {
            page,
            rowsPerPage,
            sortBy,
            descending,
          },
        })
        .then((response) => {
          const data = response.data;
          rows.value = Array.isArray(data.records) ? data.records : [];
          pagination.value.page = page;
          pagination.value.rowsPerPage = rowsPerPage;
          pagination.value.sortBy = sortBy;
          pagination.value.descending = descending;
          pagination.value.rowsNumber = data.filteredRecordsCount ?? rows.value.length;
          loading.value = false;
        })
        .catch((err) => {
          console.error("population-datasets-info", err);
          rows.value = [];
          pagination.value.rowsNumber = 0;
          loading.value = false;
        });
    }

    onMounted(() => {
      onRequest({ pagination: pagination.value });
    });

    return {
      rows,
      columns,
      loading,
      pagination,
      onRequest,
    };
  },
});
</script>
