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
          datasets: this.data.datasets,
        }, {
          maintainAspectRatio: false,
          responsive: true,
        });
      }, 100);
    }
  }
}
</script>