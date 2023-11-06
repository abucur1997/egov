<script>
import { Line, mixins } from "vue-chartjs";
import axios from 'axios'

export default {
  mixins: [mixins.reactiveData],
  extends: Line,
  data: () => ({
    transportData: null,
    countTramvai: 0,
    countMetrou: 0,
    countAutobuz: 0,
    count: 0,
    chartData: '',
    gradient: null,
    gradient2: null
  }),
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);

    this.gradient.addColorStop(0, "rgba(255, 0,0, 0.7)");
    this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.5)");
    this.gradient.addColorStop(1, "rgba(255, 0, 0, 0.1)");

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
            labels: [
                "Metrou",
                "Tramvai",
                "Autobuz"
            ],
            datasets: [
                {
                    label: "Bilete cumparate",
                    borderColor: "#FC2525",
                    pointBackgroundColor: "white",
                    borderWidth: 1,
                    pointBorderColor: "white",
                    backgroundColor: this.gradient,
                    data: [this.countMetrou, this.countTramvai, this.countAutobuz]
                }
            ]
        }
    });
  }
};
</script>
