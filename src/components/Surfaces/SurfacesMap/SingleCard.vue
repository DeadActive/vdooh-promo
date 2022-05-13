<template>
  <v-card class="mw-450">
    <image-overlay v-if="surface.img" :src="currentImg" aspect-ratio="2.75" />
    <v-img v-else :src="currentImg" aspect-ratio="2.75" />

    <v-card-text class="pb-0 pt-2" v-if="!!surface">
      <div class="d-flex">
        <h3 class="headline mb-0 pr-2">
          {{ surface.name }}
        </h3>
        <v-tooltip
          v-if="!isGalmed && !isGuaranteed"
          right
          :color="surfaceHasHourActivity ? 'green' : 'red'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              :color="surfaceHasHourActivity ? 'green' : 'red'"
              dark
              v-bind="attrs"
              v-on="on"
            >
              info
            </v-icon>
          </template>
          <span
            >{{
              surfaceHasHourActivity
                ? "Есть свободные показы"
                : "Нет свободных показов"
            }}
            {{
              isAllMighty && surface.last_request_at
                ? `(${surface.last_request_at})`
                : ""
            }}</span
          >
        </v-tooltip>
      </div>
      <span class="grey--text mb-3">GID: {{ surface.SURFACEID }}</span>

      <!-- <div
        v-if="surface.last_request_at && surfaceHasHourActivity"
        class="mt-3 mb-2"
      >
        Есть свободные показы ({{ surface.last_request_at }})
      </div>

      <div v-else class="mt-3 mb-2">
        <span class="red--text">Нет свободных показов</span>
      </div> -->

      <div v-if="doorType === 'indoor' && surface.type" class="mt-3 mb-2">
        <strong>Тип локации:</strong>
        {{ surface.type }}
      </div>

      <div
        v-if="surface.NETWORKID && !isGalmed"
        class="mb-2"
        :class="doorType === 'outdoor' ? 'mt-3' : 'mt-0'"
      >
        <strong>Оператор:</strong>
        {{ surface.NETWORKID }}
      </div>

      <!-- <div class="mb-2" :class="doorType === 'outdoor' ? 'mt-3' : 'mt-0'">
        <strong>Дневная/ночная ставка:</strong>
        {{ surface.PPV_day }} руб. / {{ surface.PPV_night }} руб.
      </div> -->

      <div
        class="mb-2"
        v-if="surface.OTS_info && Number(surface.OTS_info) !== 0"
      >
        <strong>OTS в месяц:</strong>
        {{ surface.OTS_info }}
      </div>

      <div class="mb-2" v-if="surface.GRP && Number(surface.GRP) !== 0">
        <strong>GRP:</strong>
        {{ surface.GRP }}
      </div>

      <div v-if="surface.format" class="mb-2">
        <strong>Формат:</strong>
        {{ surface.format }}
      </div>

      <div v-if="surface.side" class="mb-2">
        <strong>Сторона:</strong>
        {{ surface.side }}
      </div>

      <div v-if="surface.russCity || surface.city" class="mb-2">
        <strong>Город:</strong>
        {{ surface.russCity || surface.city }}
      </div>

      <div v-if="surface.address" class="mb-2">
        <strong>Адрес:</strong>
        {{ surface.address }}
      </div>

      <div v-if="surface.neededDuration" class="mb-2">
        <strong>Длительность ролика:</strong>
        {{ surface.neededDuration }} сек.
      </div>

      <div class="mb-2" v-if="surface.coords && doorType === 'outdoor'">
        <a
          :href="
            'https://yandex.ru/maps/?l=stv%2Csta&ll=' +
            surface.coords[1] +
            '%2C' +
            surface.coords[0] +
            '&panorama%5Bdirection%5D=289.974186%2C-5.477940&panorama%5Bfull%5D=true&panorama%5Bpoint%5D=' +
            surface.coords[1] +
            '%2C' +
            surface.coords[0] +
            '&panorama%5Bspan%5D=120.000000%2C59.416817&z=15.01'
          "
          target="_blank"
          ><v-icon small style="margin-top: -7px">visibility</v-icon>
          Панорама</a
        >
      </div>

      <div v-if="!withSortBar" class="py-1"></div>
    </v-card-text>

    <v-card-actions v-if="surface.available && !isMaximizeReach">
      <v-btn
        v-if="
          !checkIfAdded(surface.SURFACEID, surface.NETWORKID) && withSortBar
        "
        color="primary"
        depressed
        @click="addSurface"
        >Добавить</v-btn
      >
      <v-btn
        v-if="checkIfAdded(surface.SURFACEID, surface.NETWORKID)"
        color="primary"
        text
        disabled
        >Добавлена</v-btn
      >
      <v-btn
        v-if="checkIfAdded(surface.SURFACEID, surface.NETWORKID)"
        color="red"
        text
        dark
        @click="$emit('remove-surface', surface)"
        >Удалить</v-btn
      >
      <v-btn text @click="$emit('close')">Закрыть</v-btn>
      <v-spacer />
    </v-card-actions>

    <v-card-actions v-else>
      <v-btn disabled v-if="withSortBar && !isMaximizeReach">Недоступно</v-btn>
      <v-btn text @click="$emit('close')">Закрыть</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import ImageOverlay from "@/components/ImageOverlay";
import moment from "moment-timezone";
import { mapGetters } from "vuex";

export default {
  name: "SingleCard",
  components: {
    ImageOverlay,
  },
  props: {
    surface: {
      type: Object,
      required: true,
    },
    doorType: {
      type: String,
      default: "",
    },

    withSortBar: {
      type: Boolean,
      default: false,
    },
    isMaximizeReach: Boolean,
    checkIfAdded: Function,
  },
  mounted() {},
  computed: {
    currentImg() {
      return this.surface.img
        ? `${this.$appUrl}/media/${this.surface.img}`
        : "/img/empty_billboard.jpg";
    },
    surfaceHasHourActivity() {
      const surfaceLastRequest = moment.tz(
        this.surface.last_request_at,
        "Europe/Moscow"
      );
      const userTime = moment.tz("Europe/Moscow");
      // console.log(surfaceLastRequest.format());
      // console.log(userTime.format());
      // console.log(moment.duration(surfaceLastRequest.diff(userTime)).asHours());
      if (moment.duration(surfaceLastRequest.diff(userTime)).asHours() > -1) {
        // console.log("есть свобода");
        return true;
      } else {
        // console.log("нет свободы");
        return false;
      }
    },
    ...mapGetters({
      isAllMighty: "auth/isAllMighty",
      isGalmed: "auth/getIsGalmed",
      isGuaranteed: "auth/getIsGuaranteedClient",
    }),
  },
  methods: {
    addSurface() {
      this.$emit("add-surface", this.surface);
      // this.surfaceHasHourActivity();
    },
  },
};
</script>