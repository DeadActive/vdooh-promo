<script>
import {Line, mixins} from 'vue-chartjs'
const { reactiveData } = mixins

export default {
  extends: Line,
  mixins: [ reactiveData ],
  props: ['data'],
  mounted () {
    this.render()
  },
  methods: {
    render() {
      setTimeout(() => {
        this.renderChart({
          labels: this.data.labels,
          datasets: [
            {
              label: 'Охват',
              backgroundColor: '#A5BE40b8',
              data: this.data.reaches
            },
          ]
        }, {responsive: true, maintainAspectRatio: false});
      }, 100);
    }
  }
}
</script>