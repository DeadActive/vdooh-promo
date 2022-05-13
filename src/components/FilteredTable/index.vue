<template>
  <v-layout column>
    <slot name="seacrh" v-if="!withoutSearch" :search="search">
      <v-layout justify-end class="mb-3 mt-0">
        <v-flex xl2 lg3 md4 sm6 xs12>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Поиск"
            class="pt-0"
            hide-details
            single-line
            clearable
          />
        </v-flex>
      </v-layout>
    </slot>

    <v-card>
      <table-actions
        :without-configure-columns="withoutConfigureColumns"
        :total-items="currentDispalyItems.length"
        :items-per-page="itemsPerPageComp"
        :headers.sync="headers"
        :page.sync="pageComp"
      />

      <v-data-table
        v-model="selectedItems"
        :items-per-page.sync="itemsPerPageComp"
        :footer-props="footerProps"
        :no-data-text="noDataText"
        :headers="currentHeaders"
        :show-select="selectAll"
        :items="filteredItems"
        :page.sync="pageComp"
        :loading="loading"
        :search="search"
      >
        <template #header="{ props }">
          <slot name="filter" :headers="props.headers">
            <tr class="grey lighten-3">
              <th v-for="header in props.headers" :key="header.text">
                <div v-if="header.withFilter">
                  <refresh-autocomplete
                    v-model="filters[header.value]"
                    :items="columnValueList(header.value)"
                    style="width: 70%"
                    with-select-all
                    multiple
                  />
                </div>
              </th>
              <th v-if="withActions" />
            </tr>
          </slot>
        </template>

        <template #item="props">
          <tr>
            <slot :item="props.item" :index="props.index">
              <td
                v-for="header in currentHeaders"
                :key="header.value"
                :class="currentAlign(header.align)"
              >
                <slot
                  :name="'item.' + header.value"
                  :item="props.item"
                >{{ props.item[header.value] || 'нет данных' }}</slot>
              </td>
            </slot>

            <slot v-if="withActions" :item="props.item" :index="props.index" name="actions" />
          </tr>
        </template>

        <template #body.append>
          <tr v-if="totalItems && totalItems.length">
            <td
              v-for="(result, index) in currentHeaders"
              :key="result.value"
              class="text-center font-weight-medium"
            >
              <div v-if="!index" class="font-weight-medium">Итого:</div>
              <div
                v-else-if="result.type === 'statistic' && result.value !== 'budget'"
              >{{ Number(getSummBy(result.value, totalFilteredItems)).toLocaleString() }}</div>

              <div v-else-if="result.type === 'metric'">
                {{ Number(getAverageBy(result.value, totalFilteredItems)).toLocaleString() }}
                <span v-if="result.value === 'goal'">%</span>
              </div>
            </td>
          </tr>
        </template>

        <template #footer>
          <tr style="height: 2px" v-if="loading">
            <td :colspan="currentHeaders.length" class="pa-0">
              <slot name="footer-proggres">
                <v-progress-linear class="ma-0" indeterminate color="blue darken-4" height="2" />
              </slot>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </v-layout>
</template>

<script>
import RefreshAutocomplete from "../RefreshAutocomplete";
import TableActions from "../TableActions";

export default {
  name: "FilteredTable",

  components: {
    RefreshAutocomplete,
    TableActions
  },

  props: {
    value: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => []
    },
    withoutSearch: {
      type: Boolean,
      default: false
    },
    withoutConfigureColumns: Boolean,
    withCustomizeHeaders: Boolean,
    itemsPerPage: Number,
    withActions: Boolean,
    displayItems: Array,
    footerProps: Object,
    withIndex: Boolean,
    selectAll: Boolean,
    totalItems: Array,
    loading: Boolean,
    page: Number
  },

  created() {
    this.setFilters();
  },

  data: () => ({
    search: "",
    filters: {}
  }),

  computed: {
    selectedItems: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    itemsPerPageComp: {
      get() {
        return this.itemsPerPage;
      },
      set(itemsPerPage) {
        this.$emit("update:items-per-page", itemsPerPage);
        this.$emit("update:itemsPerPage", itemsPerPage);
      }
    },
    pageComp: {
      get() {
        return this.page;
      },
      set(page) {
        this.$emit("update:page", page);
      }
    },

    noDataText() {
      return this.loading ? "Данные загружаются" : "Данных нет";
    },

    currentTotalItems() {
      return this.items.length ? this.items : this.totalItems;
    },
    currentDispalyItems() {
      return this.displayItems && this.displayItems.length
        ? this.displayItems
        : this.items;
    },

    currentHeaders() {
      const headers = [];
      if (this.withIndex) {
        headers.push({ text: "№", value: "index" });
      }
      headers.push(
        ...(this.withCustomizeHeaders ? this.filteredHeaders : this.headers)
      );
      return headers;
    },

    filteredHeaders() {
      return this.headers.filter(h => h.isSelected);
    },

    totalFilteredItems() {
      return this.filterItems(this.totalItems);
    },
    filteredItems() {
      const items = this.filterItems(this.currentDispalyItems);
      if (this.withIndex) {
        items.forEach((item, index) => (item.index = index + 1));
      }
      return items;
    }
  },

  methods: {
    changeSort(column) {
      if (this.paginationSync.sortBy === column) {
        this.paginationSync.descending = !this.paginationSync.descending;
      } else {
        this.paginationSync.sortBy = column;
        this.paginationSync.descending = false;
      }
    },
    columnValueList(val) {
      const values = [];
      if (!this.currentDispalyItems) return;
      this.currentDispalyItems.forEach(d => {
        if (!values.includes(d[val])) {
          values.push(d[val]);
        }
      });

      return values.filter(d => !!d && d !== "null");
    },

    filterItems(items) {
      return (
        items &&
        items.filter(d =>
          Object.keys(this.filters).every(
            k => !this.filters[k].length || this.filters[k].includes(d[k])
          )
        )
      );
    },

    getSummBy(value, array) {
      if (!array) return;
      let result = array.reduce((summ, current) => {
        return summ + Number(current[value]);
      }, 0);
      if (result % 1) return result.toFixed(2);
      else return parseFloat(result.toFixed(0));
    },
    getAverageBy(value, array) {
      if (!array.length) return 0;
      const res = this.getSummBy(value, array);
      return Number((res / array.length).toFixed(2));
    },

    currentAlign(align) {
      if (!align) return;
      return `text-${align}`;
    },

    setFilters() {
      this.headers.forEach(header => {
        if (!header.filter) return;
        this.$set(this.filters, header.value, []);
      });
    }
  },

  watch: {
    headers() {
      this.setFilters();
    }
  }
};
</script>