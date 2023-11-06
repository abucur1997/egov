<template>
  <div class="poza">
    <div class="container">
      <div class="form">
        <v-form 
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col>
              <v-text-field
                label="Nume"
                placeholder="Nume"
                solo
                autocomplete="autocomplete_off_hack_xfr4!k"
                :rules="numeRules"
                required
                v-model="nume"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Prenume"
                placeholder="Prenume"
                solo
                autocomplete="autocomplete_off_hack_xfr4!k"
                :rules="prenumeRules"
                required
                v-model="prenume"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-text-field
                label="E-mail"
                placeholder="E-mail"
                solo
                autocomplete="autocomplete_off_hack_xfr4!k"
                :rules="emailRules"
                required
                v-model="email"
              ></v-text-field>
            </v-col>

            <v-col>
              <v-text-field
                label="Număr telefon"
                placeholder="Număr telefon"
                solo
                autocomplete="autocomplete_off_hack_xfr4!k"
                :rules="phoneRules"
                required
                v-model="phone"
                @keypress="onlyNumber"
              ></v-text-field>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col>
              <v-select
                id="transport"
                v-model="selectedTransport"
                :items="Object.keys(tipuri)"
                :rules="[v => !!v || 'Alegeți tipul transportului!']"
                label="Tip transport"
                required
                solo
              ></v-select>
            </v-col>

            <v-col>
              <v-select
                id="calatorie"
                v-model="calatorie"
                :items="this.tipuri[this.selectedTransport]"
                item-text="nume"
                item-value="id"
                :rules="[v => !!v || 'Alegeți tipul călătoriei!']"
                label='Tip calatorie'
                required
                solo
                @change="calculTotal"
              ></v-select>
            </v-col>
          </v-row>

          <v-text-field
            label="Număr bucăți"
            placeholder="Număr bucăți"
            solo
            autocomplete="autocomplete_off_hack_xfr4!k"
            type="number"
            min="1"
            required
            :rules="[v => !!v || 'Alegeți numărul de călătorii!']"
            v-model="bucati"
            @click="calculTotal"
          ></v-text-field>

          <v-row>
            <v-col>
              <v-select
                id="tipCumparator"
                v-model="cumparatori"
                :items="tipuri_cumparatori"
                :rules="[v => !!v || 'Alegeți tipul călătorului!']"
                label="Tip cumpărător"
                required
                solo
                @change="calculTotal"
              ></v-select>
            </v-col>

            <v-col>
              <v-text-field 
                v-if="cumparatori === 'copil (< 10 ani)'"
                placeholder="Reducere: 100%"
                disabled
                solo
              ></v-text-field>

              <v-text-field 
                v-if="cumparatori === 'student'"
                placeholder="Reducere: 50%"
                disabled
                solo
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-if="cumparatori === 'student'"
            v-model="legitimatie"
            label="Număr legitimație"
            autocomplete="autocomplete_off_hack_xfr4!k"
            :rules="legitimatieRules"
            @keypress="onlyNumber"
            required
            solo
          ></v-text-field>

          <v-text-field
            v-model="pret"
            disabled
            solo
          ></v-text-field>
        </v-form>
        
        <div class="centered">
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="createPDF();submitForm();"
          >
            Validate
          </v-btn>
        </div>
      </div>
      <div class="centered" style="margin-top: 10px;">
        <router-link :to="{name: 'statistici'}">
          <v-btn>Vezi statistici</v-btn>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import jsPDF from 'jspdf'
import { toXML } from 'jstoxml'

  export default {
    name: 'Form',
    data: () => ({
      tipuri: {
        "Metrou": [
          {
            id: 1,
            nume: "2 călătorii",
            pret: 5
          },
          {
            id: 2,
            nume: "5 călătorii",
            pret: 10
          },
          {
            id: 3,
            nume: "10 călătorii",
            pret: 20
          },
          {
            id: 4,
            nume: "Abonament 1 zi",
            pret: 15
          },
          {
            id: 5,
            nume: "Abonament 1 lună",
            pret: 70
          }
        ],

        "Tramvai": [
          {
            id: 6,
            nume: "1 călătorie",
            pret: 1.3
          },
          {
            id: 7,
            nume: "Abonament 1 zi",
            pret: 8
          }
        ],

        "Autobuz": [
          {
            id: 8,
            nume: "1 călătorie",
            pret: 1.3
          },
          {
            id: 9,
            nume: "Abonament 1 lună",
            pret: 50
          },
          {
            id: 10,
            nume: "Abonament linii speciale",
            pret: 30
          }
        ]
      },
      tipuri_cumparatori: [
        'copil (< 10 ani)', 'student', 'adult'
      ],
      valid: true,
      nume: '',
      numeRules: [
        v => !!v || 'Introduceți numele!',
      ],
      prenume: '',
      prenumeRules: [
        v => !!v || 'Introduceți prenumele!',
      ],
      email: '',
      emailRules: [
        v => !!v || 'Introduceți e-mail!',
        v => /.+@.+\..+/.test(v) || 'E-mail invalid!',
      ],
      phone: '',
      phoneRules: [
        v => !!v || 'Introduceți numărul de telefon!',
        v => (v && v.length == 10) || 'Numărul de telefon nu are 10 cifre!',
      ],
      select: null,
      total: "Total plata:  " + 0 + "  lei",
      cumparatori: null,
      calatorie: [],
      transport: [],
      selectedCalatorie: "",
      selectedTransport: "",
      legitimatie: '',
      legitimatieRules: [
        v => !!v || 'Introduceți numărul legitimației!',
        v => (v && v.length == 10) || 'Numărul legitimației nu are 10 cifre!',
      ],
      legitimatieValida: false,
      bucati: 1,
      pret: 0,
    }),
    // created() {
    //   axios.get('http://localhost:80/api/formular/date').then(response => {
    //       this.data = response.data
    //       console.log(this.data)
    //     })
    // },
    methods: {
      validate () {
        this.$refs.form.validate()
      },
      //introducere numai cifre
      onlyNumber ($event) {
        //console.log($event.keyCode); //keyCodes value
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
        if (keyCode < 48 || keyCode > 57) {
          $event.preventDefault();
        }
      },
      calculTotal() {
        for (var i = 0; i < this.tipuri[this.selectedTransport].length; i++) {
          if (this.calatorie == this.tipuri[this.selectedTransport][i].id) {
            this.pret = this.tipuri[this.selectedTransport][i].pret
            console.log("Am gasit")
            break;
          }
        }
        this.pret = this.pret * this.bucati;
        if (this.cumparatori == "student") {
          this.pret = this.pret * 0.5;
          console.log("student: " + this.pret)
        } else if (this.cumparatori == "copil (< 10 ani)") {
          this.pret = 0;
          console.log("copil: " + this.pret)
        }
        console.log("pret: " + this.pret)
      },
      cleanFields() {
        this.nume = '';
        this.prenume = '';
        this.email = '';
        this.phone = '';
        this.selectedTransport = '';
        this.calatorie = '';
        this.bucati = 1;
        this.cumparatori = '';
        this.pret = 0;
      },
       createPDF () {
        let pdfName = 'test';
        var doc = new jsPDF();
        doc.text("Factura", 90, 20);
        doc.text("Nume:" + this.nume, 20, 30);
        console.log("hei  " + this.nume)
        doc.text("Prenume:" + this.prenume, 20, 40);
        doc.text("Email:" + this.email, 20, 50);
        doc.text("Telefon:" + this.phone, 20, 60);
        doc.text("Tip transport:" + this.selectedTransport, 20, 70);
        doc.text("Tip calatorie:" + this.calatorie, 20, 80);
        doc.text("Numar bucati:" + this.bucati, 20, 90);
        doc.text("Tip cumparator:" + this.cumparatori, 20, 100);
        doc.text("Numar legitimatie" + this.legitimatie, 20, 110);
        doc.text("Total plata:" + this.pret, 20, 120);
        doc.save(pdfName + '.pdf');
      },
      submitForm () {
        var object = {
          nume: this.nume,
          prenume: this.prenume,
          email: this.email,
          phone: this.phone,
          transport: this.selectedTransport,
          calatorie: this.calatorie,
          bucati: this.bucati,
          cumparatori: this.cumparatori,
          totalPlata: this.pret
        }
        var obj = toXML(object)
        axios.post('http://localhost:80/api/xml', {
          object: obj
        })
        axios.post('http://localhost:80/api/formular', {
          nume: this.nume,
          prenume: this.prenume,
          email: this.email,
          phone: this.phone,
          transport: this.selectedTransport,
          calatorie: this.calatorie,
          bucati: this.bucati,
          cumparatori: this.cumparatori,
          totalPlata: this.pret, //pretFinal??
        })
        
        this.cleanFields()
      }
    },

     watch: {
        selectedTransport: function() {
            // Clear previously selected values
            this.calatorie = [];
            this.selectedCalatorie = [];
            // Populate list of calatorii in the second dropdown
            if (this.selectedTransport.length > 0) {
                this.calatorie = this.tipuri[this.selectedTransport]          
            }
        },
     }
  }
</script>

<style scoped>
.centered {
  display: flex;
	justify-content: center;
	align-items: center;
}

.container {
  display: flex;
	justify-content: center;
	align-items: center;
  height: 100%;
  flex-direction: column;
}

.poza {
  height: 100%;
  background-image: url("../img/transport_3.jpeg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.form {
  width: 50vw;
  padding: 10px;
  border-radius: 10px;
  background:rgba(0, 0, 0, 0.7);
  background:transparent\9;
  filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000);
  -ms-filter:"progid:DXImageTransform.Microsoft.gradient(startColorstr=#99000000, endColorstr=#99000000)";
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>