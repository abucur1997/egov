<script>
import { Pie, mixins } from "vue-chartjs"
import axios from 'axios'

export default {
  mixins: [mixins.reactiveData],
  data: () => ({
    transportData: null,
    countTramvai: 0,
    countMetrou: 0,
    countAutobuz: 0,
    count: 0,
    chartData: ''
  }),
  extends: Pie,
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

    this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
    this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
    this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

    this.renderChart(this.chartData)
  },
  created() {
    axios.get(`http://localhost:80/api/formular/count`).then(response => {
      this.count = response.data
      console.log(this.count.tramvaiCount, this.count.metrouCount, this.count.autobuzCount)
      this.countMetrou = this.count.metrouCount
      this.countTramvai = this.count.tramvaiCount
      this.countAutobuz = this.count.autobuzCount

      this.chartData =
        {
          labels: ["Metrou", "Tramvai", "Autobuz"],
          datasets: [
            {
              backgroundColor: [this.gradient, this.gradient2, "#00D8FF"],
              data: [this.countMetrou, this.countTramvai, this.countAutobuz]
            }
          ]
        }
    });
  }
};
</script>