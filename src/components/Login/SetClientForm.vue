<template>
  <v-slide-x-reverse-transition>
    <v-card
      class="px-3 pb-3 pt-6"
      @keydown.down="selectClient('down')"
      @keydown.up="selectClient('up')"
    >
      <v-card-text>
        <div class="layout column align-center">
          <h1 class="flex mb-4 primary--text font-weight-light">Выбор клиента</h1>
        </div>

        <div v-if="clients.length > 10">
          <v-text-field
            v-model="search"
            prepend-inner-icon="search"
            label="Фильтр по названию"
            autofocus
            clearable
            @keydown.enter="setSelectedClient"
          />
        </div>

        <v-list two-line class="pt-0 scroll">
          <v-list-item
            v-for="(client, index) in currentClients"
            :key="index"
            :class="'client-' + index"
            @click="setClient(client.CLIENTID, client.client_name)"
          >
            <v-list-item-content>
              <v-list-item-title>
                <strong>{{ client.client_name }}</strong>
                <span class="grey--text body-1 ml-1" v-if="isCurrent(client.CLIENTID)">(текущий)</span>
              </v-list-item-title>
              <v-list-item-subtitle v-if="isAgency(client.CLIENTID)">Агентство</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-btn block v-if="loading" text color="primary" :loading="loading"></v-btn>
        </v-card-actions>
      </v-card-text>

      <v-alert v-if="error" transition="slide-y-transition" type="error">{{ error }}</v-alert>
    </v-card>
  </v-slide-x-reverse-transition>
</template>

<script>
export default {
  name: "SetClient",
  props: ["clients", "agencies", "userdata"],
  created() {
    this.searchableClients = this.filteredClients;
  },
  data: () => ({
    searchableClients: [],
    indexSelectClient: 0,

    loading: false,
    search: '',
    error: '',
  }),
  computed: {
    filteredClients() {
      const search = this.search || '';
      const agency = this.agencies[0];
      const clients = this.clients
        .filter(c => !!c.client_name)
        .sort((x, y) => x.client_name.toLowerCase() > y.client_name.toLowerCase() ? 1 : -1)
        .filter(client => {
          if (!search) return true;
          const text = client.client_name + client.CLIENTID;
          return search.toLowerCase().indexOf(text.toLowerCase());
        });

      return clients.sort((x, y) => {
        return x.CLIENTID === agency ? -1 : y.CLIENTID === agency ? 1 : 0;
      });
    },

    currentClients() {
      const search = this.search || '';
      return (!this.searchableClients.length && !search)
        ? this.filteredClients
        : this.searchableClients;
    }
  },
  methods: {
    async setClient(client, name) {
      if (this.isCurrent(client)) {
        return this.$store.dispatch('notification/set', {
          message: 'Этот клиент уже выбран',
          type: 'info',
        });
      }
      this.loading = true;

      const { data, error } = await this.$store.dispatch('auth/loginAsClient', { client, name });
      this.loading = false;
      
      if (!error) {
        if (this.userdata !== undefined) {
          this.$store.dispatch('auth/setCurrentUser', this.userdata);
        }
        if (this.agencies.length > 0 && this.agencies.includes(client)) {
          this.$store.dispatch('auth/setInAgency', true);
          this.$router.push({ name: "clients.list" });
        } else {
          this.$store.dispatch('auth/setInAgency', false);
          if (this.$route.name !== "translations.all") {
            this.$router.push({ name: "translations.all", params: { page: 1 }});
          } else {
            this.$router.go();
          }
        }
        this.$emit('finished');
        this.search = '';
      } else {
        console.log("Access Denied!");
        this.error = "Возникла ошибка при выборе клиента";
      }
    },
    isAgency(CLIENTID) {
      return this.agencies.includes(CLIENTID);
    },
    isCurrent(CLIENTID) {
      return this.$store.getters['auth/clientId'] === CLIENTID;
    },

    searchClients() {
      const search = this.search || '';
      this.searchableClients = this.filteredClients.filter(client => {
        const text = client.client_name + client.CLIENTID;
        return ~text.toLowerCase().indexOf(search.toLowerCase());
      });
    },
    setSelectedClient() {
      const client = this.currentClients[this.indexSelectClient];
      this.setClient(client.CLIENTID, client.client_name);
    },
    selectClient(position) {
      const currentLength = this.currentClients.length;
      if (position === 'down') {
        const index = this.indexSelectClient + 1;
        return index === currentLength
          ? this.indexSelectClient = 0
          : this.indexSelectClient = index;
      }
      const index = this.indexSelectClient - 1;
      return ~index
        ? this.indexSelectClient = index
        : this.indexSelectClient = currentLength - 1;
    }
  },
  watch: {
    search() {
      this.searchClients();
      this.indexSelectClient = 0;
    },
    indexSelectClient(index, oldIndex) {
      const oldClient = document.querySelector('.client-' + oldIndex);
      const newClient = document.querySelector('.client-' + index);
      oldClient.classList.remove('client--selected');
      newClient.classList.add('client--selected');

      newClient.scrollIntoView();
      // this.$vuetify.goTo('.client-' + index, {
      //   easing: 'easeInOutCubic',
      //   duration: 300,
      //   offset: 0,
      // });
    }
  },
};
</script>

<style scoped>
.scroll {
  max-height: 60vh;
  overflow-y: auto;
}
.client--selected {
  background: rgba(0,0,0,.09);
}
</style>
