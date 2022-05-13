<template>
  <v-navigation-drawer
    v-model="currentDrawer"
    :mini-variant="$vuetify.breakpoint.mdAndDown ? false : mini"
    :permanent="!$vuetify.breakpoint.mdAndDown"
    :temporary="$vuetify.breakpoint.mdAndDown"
    style="min-width: 60px;"
    ref="drawer"
    width="276"
    overflow
    clipped
    app 
  >
    <v-list avatar nav>
      <v-list-item @click="openProfile" class="my-2" v-if="$vuetify.breakpoint.mdAndDown">
        <v-list-item-action>
          <v-icon>account_circle</v-icon>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{ $store.state.auth.username || userId }}</v-list-item-title>
          <v-list-item-subtitle class="caption grey--text">{{ $store.state.auth.balance.toLocaleString() }} руб.</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider  v-if="$vuetify.breakpoint.mdAndDown"/>

      <template v-for="item in items">
        <v-list-group
          v-if="!!item.children && item.children.length && item.rule"
          :prepend-icon="item.icon"
          :value="item.active"
          :key="item.title"
        >
          <template #activator>
            <v-list-item-title class="body-2">{{ item.title }}</v-list-item-title>
          </template>

          <v-list-item
            v-for="subItem in item.children"
            :key="subItem.title"
            :to="subItem.link"
            class="cursor--pointer body-2 item--child"
            :class="{ 'pl-0' : mini }"
          >
            <v-list-item-avatar>
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-title class="body-2">
              {{ subItem.title }}
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          v-else-if="item.rule"
          :to="item.link"
          :key="item.link"
          class="cursor--pointer body-2"
          ripple
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-title class="body-2">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'TheMenuApp',

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    const { drawer } = this.$refs;
    drawer.$el.addEventListener('mouseenter', () => this.mini = this.drawer ? this.mini : false);
    drawer.$el.addEventListener('mouseleave', () => this.mini = this.drawer ? this.mini : true);
  },

  data: () => ({
    clients_items: {
      action: "business",
      title: "Клиенты",
      active: true,
      items: [
        { action: 'bubble_chart', title: "Список клиентов", path: "/clients" },
        { action: 'bubble_chart', title: "Управление бюджетом", path: "/clients/budget" },
        { action: 'bubble_chart', title: "История операций", path: "/clients/billing" }
      ]
    },
  }),

  computed: {
    items() {
      return this.$store.getters['menu/getMenuItems'];
    },
    isDirectClient() {
      return this.$store.getters['auth/isDirectClient'];
    },

    mini: {
      get() {
        return this.value.mini;
      },
      set(mini) {
        this.$emit('input', {
          mini,
          drawer: this.drawer,
          clipped: this.clipped,
        });
      },
    },
    drawer: {
      get() {
        return this.value.drawer;
      },
      set(drawer) {
        this.$emit('input', {
          drawer,
          mini: this.mini,
          clipped: this.clipped,
        });
      },
    },
    clipped: {
      get() {
        return this.value.clipped;
      },
      set(clipped) {
        this.$emit('input', {
          clipped,
          mini: this.mini,
          drawer: this.drawer,
        });
      },
    },

    currentDrawer: {
      get() {
        return this.$vuetify.breakpoint.mdAndDown ? this.drawer : true;
      },
      set(drawer) {
        if (this.$vuetify.breakpoint.mdAndDown) this.drawer = drawer;
      }
    }
  },

  methods: {
    openProfile() {
      this.$router.push({
        name: "users.profile",
        params: { id: this.$store.state.auth.userid }
      });
    },
  },
};
</script>

<style>
.item--child {
  padding-left: 0px;
}
</style>
