<script>
import { Bar, mixins } from "vue-chartjs";
const { reactiveData } = mixins;

export default {
  extends: Bar,

  mixins: [reactiveData],

  props: ["data"],

  mounted() {
    this.render();
  },

  methods: {
    render() {
      setTimeout(() => {
        this.renderChart({
          labels: this.data.labels,
          datasets: [
            {
              label: "Количество показов",
              backgroundColor: "#A5BE40b8",
              data: this.data.shows,
              yAxisID: 'display-axis',
            },
            {
              label: "Количество контактов (OTS)",
              backgroundColor: "#05CBE1b8",
              data: this.data.ots,
              yAxisID: 'ots-axis',
            },
          ]
        }, {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
						yAxes: [{
              id: 'display-axis',
              display: true,
              scaleLabel: {
                labelString: 'Показы',
                fontFamily: 'Roboto',
                display: true,
                fontSize: 16,
              },
						}, {
              label: 'Контакты',
              position: 'right',
              id: 'ots-axis',
							gridLines: {
								drawOnChartArea: false,
							},
              scaleLabel: {
                labelString: 'Контакты',
                fontFamily: 'Roboto',
                display: true,
                fontSize: 16,
              },
						}],
					}
        });
      }, 100);
    },
  },
};
</script>