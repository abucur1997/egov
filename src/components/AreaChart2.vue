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
    gradient2: null,
    valori: [],
    luni: []
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
    axios.get('http://localhost:80/api/formular/date').then(response => {
        this.data = response.data
        console.log("Luna: " + this.data[1].luna)
        for (var i=0; i<this.data.length; i++) {
          this.luni[i] = this.data[i].luna
          this.valori[i] = this.data[i].nr_bilete
        }
        console.log(this.luni)
        console.log(this.valori)

      this.chartData =
        {
            labels: this.luni,
            datasets: [
                {
                    label: "Bilete cumparate",
                    borderColor: "#FC2525",
                    pointBackgroundColor: "white",
                    borderWidth: 1,
                    pointBorderColor: "white",
                    backgroundColor: this.gradient,
                    data: this.valori
                }
            ]
        }
    });
  }
};
</script>
