<template>
    <div>
        <h2>Автобусные маршруты</h2>
        <v-data-table :items="surfaces" hide-actions :headers="headers">
            <template slot="items" slot-scope="props">
                <tr>
                    <td>{{ props.item.name.toUpperCase() }}</td>
                    <td>
                        {{ props.item.startPoint.name }}
                    </td>
                    <td>
                        {{ props.item.endPoint.name }}
                    </td>
                    <td>
                        <v-btn  @click.native="showRoute(props.item.SURFACEID)">
                            <v-icon small class="mr-2">map</v-icon>Посмотреть на карте
                        </v-btn>
                        <v-btn
                            color="indigo"
                            dark
                            @click.native="$currentSurface.push(props.item.SURFACEID)"
                            v-show="!props.item.selected"
                        >
                            <v-icon small class="mr-2">add</v-icon>Выбрать
                        </v-btn>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <h3 class="my-2" v-if="currentRoute"> Маршрут {{ currentRoute.route_title.toUpperCase() }}</h3>
        <!-- карта -->
        <yandex-map zoom="10" style="width: 100%; max-width: 100%; height: 500px;" :coords="getLocation">
            <ymap-marker v-if="currentRoute" marker-id="start" :coords="currentRoute.start_geo.split(',')" marker-type="placemark"></ymap-marker>
            <ymap-marker v-if="currentRoute" marker-id="start" :coords="currentRoute.finish_geo.split(',')" marker-type="placemark"></ymap-marker>
            <ymap-marker
                v-for="(route, index) in busRoute"
                :key="index"
                :marker-id="index"
                :marker-type="route.type"
                :coords="route.coords"
                :marker-stroke="{color:'#EA2D2E', opacity: 0.9, width:3}"
            ></ymap-marker>
        </yandex-map>
    </div>
</template>

<script>
import { yandexMap, ymapMarker } from "vue-yandex-maps";
import { mapGetters } from 'vuex';

export default {
  props: ["surfaces"],
  components: { yandexMap, ymapMarker },
  data: function() {
    return {
      headers: [
        {
          text: "Номер маршрута",
          value: "id",
          width: "10%"
        },
        {
            text: "Начальная станция",
            value: "startPoint",
            width: "25%"
        },
        {
            text: "Конечная станция",
            value: "endPoint",
            width: "25%"
        },
        {
          text: "",
          value: "translation",
          width: "40%"
        },
      ],
      coords: [55.753806, 37.621783],
      busRoute: [],
      routeObject: null,
      currentRoute: null,
      startPoint: {
        name: "",
        coords: []
      },
      endPoint: {
        name: "",
        coords: []
      }
    };
  },
  computed:{
        ...mapGetters('settings', ['getLocation']),
  }
  methods: {
    showRoute: function(SURFACEID) {
        const self = this;
      this.$http
        .post(
          "route",
          { route_id: SURFACEID,
          route_type: "bus"
          },
          {
            withCredentials: true
          }
        )
        .then(response => {
          if (response.data.status === "ok") {
            // this.route = response.data.routes[0];
            const routeObject = JSON.parse(response.data.routes[0].route_object);
            this.routeObject = routeObject;
            self.coords = response.data.routes[0].center_geo.split(",");
            this.currentRoute = response.data.routes[0];
            this.createRoute(routeObject);
            // self.startPoint.name =
            //   routeObject.data.features[0].properties.ThreadMetaData.EssentialStops[0].name;
            // self.endPoint.name =
            //   routeObject.data.features[0].properties.ThreadMetaData.EssentialStops[1].name;
            // self.startPoint.coords = routeObject.data.features[0].features[0].geometry.coordinates.reverse();
            // self.endPoint.coords = routeObject.data.features[0].features[routeObject.data.features.length-1].geometry.coordinates.reverse();
            
            // this.coords = routeObject.data.properties.boundedBy[0].reverse();
            // this.loaded = true;
          } else if (
            response.data.status === "error" &&
            response.data.error === "authorization failure"
          ) {
            // this.$eventHub.$emit("denied");
          }
        });
    },
    createRoute: function(route) {
        this.busRoute.length = 0;
      let features = route.data.features[0].features;
      for (var i = 0, len = features.length; i < len; i++) {
        let sourceRoute = features[i];
        if (features[i].geometry.type === "LineString") {
          let coordinates = sourceRoute.geometry.coordinates.map(function(
            item
          ) {
            return item.reverse();
          });
          let route = {
            type: "polyline",
            coords: coordinates
          };
          this.busRoute.push(route);
        }
      }
      this.routeCoords = coords.map(function(item) {
        return item.reverse();
      });
    }
  },
  name: "SurfaceTransport"
};
</script>
