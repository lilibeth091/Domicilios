import { Component, OnInit, AfterViewInit } from "@angular/core";
import Chart from "chart.js";

import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "../../variables/charts";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.scss"],
})
export class ReportsComponent implements OnInit, AfterViewInit {
  ngOnInit(): void {
    parseOptions(Chart, chartOptions());
  }

  ngAfterViewInit(): void {
    // esperar a que el DOM esté listo y luego inicializar
    // Pies
    const pieBase = chartExample2.data.datasets[0].data;
    const pieLabels = ["A", "B", "C"];

    const pie1 = document.getElementById("pie1") as HTMLCanvasElement;
    const pie2 = document.getElementById("pie2") as HTMLCanvasElement;
    const pie3 = document.getElementById("pie3") as HTMLCanvasElement;

    const pieOpts = { responsive: true, maintainAspectRatio: false };

    new Chart(pie1, {
      type: "doughnut",
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieBase.slice(0, 3),
            backgroundColor: ["#5e72e4", "#11cdef", "#2dce89"],
          },
        ],
      },
      options: pieOpts,
    });

    new Chart(pie2, {
      type: "doughnut",
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieBase.slice(1, 4),
            backgroundColor: ["#f5365c", "#fb6340", "#ffd600"],
          },
        ],
      },
      options: pieOpts,
    });

    new Chart(pie3, {
      type: "doughnut",
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieBase.slice(0, 3).map((v) => v + 5),
            backgroundColor: ["#172b4d", "#5e72e4", "#f4f5f7"],
          },
        ],
      },
      options: pieOpts,
    });

    // Barras
    const barBaseLabels = chartExample2.data.labels;
    const barBaseData = chartExample2.data.datasets[0].data;

    const bar1 = document.getElementById("bar1") as HTMLCanvasElement;
    const bar2 = document.getElementById("bar2") as HTMLCanvasElement;
    const bar3 = document.getElementById("bar3") as HTMLCanvasElement;

    new Chart(bar1, {
      type: "bar",
      data: {
        labels: barBaseLabels,
        datasets: [
          { label: "Sales", data: barBaseData, backgroundColor: "#5e72e4" },
        ],
      },
      options: chartExample2.options,
    });

    new Chart(bar2, {
      type: "bar",
      data: {
        labels: barBaseLabels,
        datasets: [
          {
            label: "Revenue",
            data: barBaseData.map((v) => v + 10),
            backgroundColor: "#11cdef",
          },
        ],
      },
      options: chartExample2.options,
    });

    new Chart(bar3, {
      type: "bar",
      data: {
        labels: barBaseLabels,
        datasets: [
          {
            label: "Orders",
            data: barBaseData.map((v) => Math.round(v * 0.8)),
            backgroundColor: "#2dce89",
          },
        ],
      },
      options: chartExample2.options,
    });

    // Lineas / series temporales
    const lineLabels = chartExample1.data.labels;
    const lineData = chartExample1.data.datasets[0].data;

    const line1 = document.getElementById("line1") as HTMLCanvasElement;
    const line2 = document.getElementById("line2") as HTMLCanvasElement;
    const line3 = document.getElementById("line3") as HTMLCanvasElement;

    new Chart(line1, {
      type: "line",
      data: {
        labels: lineLabels,
        datasets: [
          {
            label: "Performance",
            data: lineData,
            borderColor: "#5e72e4",
            backgroundColor: "transparent",
          },
        ],
      },
      options: chartExample1.options,
    });

    new Chart(line2, {
      type: "line",
      data: {
        labels: lineLabels,
        datasets: [
          {
            label: "Visitors",
            data: lineData.map((v) => v * 1.5),
            borderColor: "#11cdef",
            backgroundColor: "transparent",
          },
        ],
      },
      options: chartExample1.options,
    });

    new Chart(line3, {
      type: "line",
      data: {
        labels: lineLabels,
        datasets: [
          {
            label: "Sessions",
            data: lineData.map((v, i) => v + i * 5),
            borderColor: "#2dce89",
            backgroundColor: "transparent",
          },
        ],
      },
      options: chartExample1.options,
    });
  }
}
