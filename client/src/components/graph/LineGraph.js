import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Box } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Title,
  Legend
);

const FALLBACK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
const FALLBACK_DATASETS = [
  {
    label: "Steps",
    data: [1000, 10, 20, 10, 9000],
  },
];

const LINE_COLORS = [
  {
    border: "rgba(41, 128, 78, 1)",
    background: "rgba(41, 128, 78, 0.16)",
  },
  {
    border: "rgba(31, 58, 95, 1)",
    background: "rgba(31, 58, 95, 0.14)",
  },
  {
    border: "rgba(55, 189, 115, 1)",
    background: "rgba(55, 189, 115, 0.12)",
  },
];

const buildLineData = ({ labels = FALLBACK_LABELS, datasets = FALLBACK_DATASETS }) => ({
  labels,
  datasets: datasets.map((dataset, index) => {
    const palette = LINE_COLORS[index % LINE_COLORS.length];

    return {
      borderColor: dataset.borderColor || palette.border,
      backgroundColor:
        dataset.backgroundColor ||
        palette.background ||
        "rgba(31, 58, 95, 0.14)",
      borderWidth: dataset.borderWidth ?? 3,
      tension: dataset.tension ?? 0.42,
      pointRadius: dataset.pointRadius ?? 3,
      pointHoverRadius: dataset.pointHoverRadius ?? 5,
      pointBackgroundColor:
        dataset.pointBackgroundColor || dataset.borderColor || palette.border,
      pointBorderColor: "#ffffff",
      fill: dataset.fill ?? index === 0,
      ...dataset,
    };
  }),
});

const LineGraph = ({
  labels,
  datasets,
  height = 280,
  showLegend = true,
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 10,
          color: "#475569",
          font: {
            family: "inherit",
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        padding: 12,
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            family: "inherit",
            weight: "600",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.14)",
        },
        ticks: {
          color: "#64748b",
          font: {
            family: "inherit",
            weight: "600",
          },
        },
      },
    },
  };

  return (
    <Box h={`${height}px`} w="full">
      <Line options={options} data={buildLineData({ labels, datasets })} />
    </Box>
  );
};

export default LineGraph;
