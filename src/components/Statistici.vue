<template>
    <div class="poza">
        <div class="container">
            <div class="form">
                Statistici:
                <v-row id="chart">
                  <v-col>
                    <AreaChart id="area-chart" style="height: 20vh; width: 20vw; margin-bottom: 80px;"/>
                  </v-col>

                  <v-col>
                    <AreaChart2 id="area-chart-2" style="height: 20vh; width: 20vw; margin-bottom: 80px"/>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-simple-table id="simple_table">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>
                              Transport
                            </th>
                            <th>
                              Nr. bilete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Metrou</td>
                            <td>{{countMetrou}}</td>
                          </tr>
                          <tr>
                            <td>Tramvai</td>
                            <td>{{countTramvai}}</td>
                          </tr>
                          <tr>
                            <td>Autobuz</td>
                            <td>{{countAutobuz}}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>

                  <v-col>
                    <v-simple-table id="simple_table">
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th>
                              Luna
                            </th>
                            <th>
                              Nr. bilete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr 
                            v-for="item in data"
                            :key="item.luna"
                          >
                            <td>{{ item.luna }}</td>
                            <td>{{ item.nr_bilete }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
            </div>
            <v-btn
              style="margin-top: 1vw;"
              id="download"
              download="ChartImage.jpg" 
              @click="download()"
            >
              Descarca
            </v-btn>
        </div>
    </div>
</template>

<script>
import AreaChart2 from "../components/AreaChart2.vue"
import AreaChart from "../components/AreaChart.vue"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import axios from 'axios'
import 'jspdf-autotable'

export default {
    name: 'Statistici',
    components: {
      AreaChart,
      AreaChart2,
    },
    data: () => ({
      countMetrou: 0,
      countTramvai: 0,
      countAutobuz: 0,
      data: [],
      luni: [],
      valori: [],
      perechi: []
    }),
    methods: {
      download() {
        var pdf = new jsPDF();
        var element = document.getElementById('chart');
        html2canvas(element).then(canvas => {
            var image = canvas.toDataURL('image/png')
            pdf.text("Document raportare", 90, 20);
            pdf.addImage(image, 'JPEG', 25, 40, 180, 75)
            pdf.save('document_facturare' + '.pdf')
        });
        
        pdf.autoTable({
          head: [['Nume Transport', 'Nr Bilete']],
          body: [
            ['Metrou', this.countMetrou],
            ['Tramvai', this.countTramvai],
            ['Autobuz', this.countAutobuz]
          ],
          startY: 140
        });

        for (var i = 0; i < this.data.length; i++) {
          this.perechi[i] = [this.luni[i], this.valori[i]]
        }
        pdf.autoTable({
          head: [['Luna','Nr Bilete']],
          body: this.perechi,
          startY: 200
        });
            
      }
    },
    created() {
      //console.log(Date().getMonth() + 1)
      axios.get(`http://localhost:80/api/formular/count`).then(response => {
        this.count = response.data
        console.log(this.count.tramvaiCount, this.count.metrouCount, this.count.autobuzCount)
        this.countMetrou = this.count.metrouCount
        this.countTramvai = this.count.tramvaiCount
        this.countAutobuz = this.count.autobuzCount
      })
      
      axios.get('http://localhost:80/api/formular/date').then(response => {
        this.data = response.data
        console.log(this.data)
      })

      axios.get('http://localhost:80/api/formular/date').then(response => {
        this.data = response.data
        for (var i=0; i<this.data.length; i++) {
          this.luni[i] = this.data[i].luna
          this.valori[i] = this.data[i].nr_bilete
        }
      })

    }

}
</script>

<style scooped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.form {
  height: 100%;
  width: 60vw;
  padding: 10px;
  border-radius: 10px;
  background:rgb(255, 255, 255);
  background:transparent\9;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);
  -ms-filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";
}

.container {
  height: 100%;
  display: flex;
	justify-content: center;
	align-items: center;
  flex-direction: column;
}

.poza {
  height: 100%;
  background-image: url("../img/transport_3.jpeg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>