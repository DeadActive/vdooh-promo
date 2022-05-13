<template>
  <v-card class="pa-4">
    <v-card-text>
      <v-flex xs12>
              <v-list>
                <v-list-item v-for="(file, index) in files" :key="index">
                  <v-list-item-icon>
                    <img src="/img/file_icons/pdf.svg" width="32px" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      <a :href="file.link" target="_blank">{{ file.name }}</a>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "TechnicalRequirementsMaer",
  data: () => ({
    files: [
            {
        link: "/files/TT_MAER/TT_DSS_7x4.pdf",
        name: "Тех. требования_DSS_7х4."
      },
            {
        link: "/files/TT_MAER/TT_DSS_15,04х4,8.pdf",
        name: "Тех. требования_DSS_15,04х4,8"
      },
            {
        link: "/files/TT_MAER/TT_DSS_15х5.pdf",
        name: "Тех. требования_DSS_15х5"
      },
      {
        link: "/files/TT_MAER/TT_MF_Volgograd.pdf",
        name: "Тех. требования_медиафасад_Волгоград, ул. Калинина, 13"
      },
            {
        link: "/files/TT_MAER/TT_MF_Ekaterinburg.pdf",
        name: "Тех. требования_медиафасад_Екатеринбург, ул. Малышева, 36"
      },
            {
        link: "/files/TT_MAER/TT_MF_MO_Himki.pdf",
        name: "Тех. требования_медиафасад_МО_г.о. Химки, МКАД 78 км, вл. 4Б, к. Г"
      },
            {
        link: "/files/TT_MAER/TT_MF_MSK_Varshavskoe.pdf",
        name: "Тех. требования_медиафасад_Москва, Варшавское ш., 118, к.1"
      },
            {
        link: "/files/TT_MAER/TT_MF_MSK_Leninskiy.pdf",
        name: "Тех. требования_медиафасад_Москва, пр. Ленинский, 158"
      },
            {
        link: "/files/TT_MAER/TT_MF_MSK_Riviera.pdf",
        name: "Тех. требования_медиафасад_Москва, ул. Автозаводская, 18_ТРЦ Ривьера"
      },
            {
        link: "/files/TT_MAER/TT_MF_MSK_Hanoi.pdf",
        name: "Тех. требования_медиафасад_Москва, Ярославское шоссе 146, к. 2_МФК «Ханой-Москва»"
      },
            {
        link: "/files/TT_MAER/TT_MF_NN.pdf",
        name: "Тех. требования_медиафасад_Нижний Новгород, пл. Комсомольская, 2"
      },
            {
        link: "/files/TT_MAER/TT_MF_Novosib.pdf",
        name: "Тех. требования_медиафасад_Новосибирск, пл. Карла-Маркса, 1"
      },
            {
        link: "/files/TT_MAER/TT_MF_Perm.pdf",
        name: "Тех. требования_медиафасад_Пермь, ул. Революции, 13"
      },
                  {
        link: "/files/TT_MAER/TT_MF_Samara.pdf",
        name: "Тех. требования_медиафасад_Самара, ш. Московское, лит.Д, К 28Б"
      },
                  {
        link: "/files/TT_MAER/TT_MF_Tyumen.pdf",
        name: "Тех. требования_медиафасад_Тюмень, ул. Республики, 61"
      },
                  {
        link: "/files/TT_MAER/TT_MF_Ufa.pdf",
        name: "Тех. требования_медиафасад_Уфа, ул. Рихарда Зорге, 9"
      },
                  {
        link: "/files/TT_MAER/TT_MF_Chelyabinsk.pdf",
        name: "Тех. требования_медиафасад_Челябинск, пр. Свердловский, 51"
      },
    ],
  }),
};
</script>
