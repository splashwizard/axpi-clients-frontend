<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: ["chartdata"],
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#cccccc80",
                display: false, //
              },
              ticks: {
                beginAtZero: true,
                display: false, //
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
  watch: {
    chartdata: function (newChartData) {
      this.renderChart(newChartData, this.options);
    },
  },
};
</script>
