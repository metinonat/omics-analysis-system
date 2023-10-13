"use client";
import dynamic from "next/dynamic";
import React from "react";
import MultiSelect from "../common/MultiSelect";

// interface ApexChartProps {
//   series: any[];
// }

// interface ApexChartState {
//   series: any[];
//   options: {
//     chart: {
//       type: string;
//       height: number;
//     };
//     colors: string[];
//     title: {
//       text: string;
//       align: string;
//     };
//     xaxis: {
//       type: string;
//       tooltip: {
//         formatter: (val: string) => string;
//       };
//     };
//     tooltip: {
//       shared: boolean;
//       intersect: boolean;
//     };
//   };
// }

// class ApexChart extends React.Component<ApexChartProps, ApexChartState> {
//   constructor(props: ApexChartProps) {
//     super(props);

//     this.state = {
//       series: props.series,
//       options: {
//         chart: {
//           type: "boxPlot",
//           height: 350,
//         },
//         colors: ["#008FFB", "#FEB019"],
//         title: {
//           text: "BoxPlot - Scatter Chart",
//           align: "left",
//         },
//         xaxis: {
//           type: "string",
//           tooltip: {
//             formatter: function (val: string) {
//               return val;
//             },
//           },
//         },
//         tooltip: {
//           shared: false,
//           intersect: true,
//         },
//       },
//     };
//   }
//   render() {
//     return (
//       <div id="chart">
//         <ReactApexChart
//           id="apexchart"
//           options={this.state.options as any}
//           series={this.state.series}
//           type="boxPlot"
//           height={350}
//         />
//       </div>
//     );
//   }
// }
export default function BoxPlot() {
  const [data, setData] = React.useState<{ series: any[] }>({ series: [] });
  React.useEffect(() => {
    console.log(data);
  }, [data]);
  const DynamicApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
  });

  return (
    <>
      <MultiSelect
        dataFetchUrl="http://localhost:8080/analysis/box-plot-data"
        setData={setData}
        useThreshold={true}
      />
      {/* <DynamicApexChart series={data.series} /> */}
    </>
  );
}
