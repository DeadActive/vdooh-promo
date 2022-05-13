<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveData } = mixins

export default {
  extends: Bar,

  mixins: [ reactiveData ],

  props: ['data'],

  mounted () {
    this.render();
  },

  methods: {
    render() {
      setTimeout(() => {
        this.renderChart({
          labels: this.data.labels,
          datasets: [{
            backgroundColor: "#A5BE40b8",
            label: "Расходы клиентов",
            data: this.data.income,
          }],
        }, {
          maintainAspectRatio: false,
          responsive: true,
        });
      }, 100);
    }
  }
}
</script>