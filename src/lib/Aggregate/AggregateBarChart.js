import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { createChartData, qualitativeColors } from "./lib";

export default function AggregateBarChart(data) {
  const { d, columns } = createChartData(data);
  const colors = qualitativeColors(columns.length);
  return (
    <BarChart width={730} height={250} data={d}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={data.meta.axes[0].field} />
      <YAxis />
      <Tooltip />
      {columns.map((column, i) => (
        <Bar key={i} type="monotone" dataKey={column} fill={colors[i]} />
      ))}
    </BarChart>
  );
}