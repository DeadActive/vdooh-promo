<template>
  <v-autocomplete
    v-model="model"
    :item-value="itemValue"
    :item-text="itemText"
    :disabled="disabled"
    :rules="rules"
    :items="items"
    :label="label"
    multiple
  >
    <v-list-item
      v-if="withSelectAll"
      slot="prepend-item"
      ripple
      @click="toggleAll"
    >
      <v-list-item-action>
        <v-icon
          :color="model && model.length > 0 ? 'primary' : ''"
        >{{ icon }}</v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>Выбрать все</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      v-if="!hideItems"
      slot="item"
      slot-scope="{ item }"
      ripple
      @click="select(item)"
    >
      <v-list-item-action>
        <v-icon
          :color="selectedItem(item) ? 'primary' : ''"
        >{{ selectedItemIcon(item) }}</v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title>
          <slot name="item" :item="item">
            {{ itemText ? item[itemText] : item }}
          </slot>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mt-2" />
    <template slot="selection" slot-scope="{ item, index }">
      <v-chip v-if="index === 0">
        <span>{{ itemText ? item[itemText] : item }}</span>
      </v-chip>
      <span
        v-if="index === 1"
        class="grey--text caption"
      >(+{{ model.length - 1 }} еще)</span>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'RefreshAutocomplete',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    rules: {
      type: Array,
      default: () => [],
    },
    withSelectAll: { type: Boolean },
    hideItems: { type: Boolean },
    disabled: { type: Boolean },
    itemValue: { type: String },
    itemText: { type: String },
    label: { type: String },
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(model) {
        this.$emit('input', model);
      },
    },

    selectAll() {
      if (!this.model) return;
      return this.items.length === this.model.length;
    },
    selectSome() {
      if (!this.model) return;
      return this.model.length > 0 && !this.selectAll;
    },

    icon() {
      if (this.selectAll) return "check_box";
      if (this.selectSome) return "indeterminate_check_box";

      return "check_box_outline_blank";
    },
  },
  methods: {
    select(item) {
      if (this.itemValue) {
        item = item[this.itemValue];
      }
      if (!this.model.find(i => i === item)) {
        this.model = [item, ...this.model];
      }
      else this.model = this.model.filter(i => i !== item);
    },

    toggleAll() {
      if (this.selectAll) this.model = [];
      else if (this.itemValue) {
        this.model = this.items.map(i => i[this.itemValue]);
      }
      else {
        this.model = this.items;
      }
    },

    selectedItem(item) {
      if (this.itemValue) item = item[this.itemValue];
      return !!this.model.find(c => c === item);
    },
    selectedItemIcon(item) {
      if (this.itemValue) item = item[this.itemValue];

      if (!!this.model.find(i => i === item)) return "check_box";
      return "check_box_outline_blank";
    },
  },
};
</script>
