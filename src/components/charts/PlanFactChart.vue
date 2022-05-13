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
              label: 'Расход',
              borderColor: '#DF6747',
              data: this.data.income,
              fill: false
            },
            {
              label: 'OTS план, сумм',
              borderColor: '#37AFA9',
              data: this.data.b_ots_sum_plan,
              fill: false
            },
            {
              label: 'OTS факт, сумм',
              borderColor: '#0C695D',
              data: this.data.c_ots_sum_fact,
              fill: false
            },
            {
              label: 'OTS план, сут.',
              borderColor: '#E8A631',
              data: this.data.e_ots_day_plan,
              fill: false
            },
            {
              label: 'OTS  факт, сут.',
              borderColor: '#E0C098',
              data: this.data.f_ots_day_fact,
              fill: false
            },
            {
              label: 'Охват план, сумм.',
              borderColor: '#27647B',
              data: this.data.i_reach_sum_plan,
              fill: false
            },
            {
              label: 'Охват факт, сумм.',
              borderColor: '#849FAD',
              data: this.data.j_reach_sum_fact,
              fill: false
            },
          ]
        }, {responsive: true, maintainAspectRatio: false});
      }, 100);
    }
  }
}
</script>