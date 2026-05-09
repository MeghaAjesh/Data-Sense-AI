"use client";
import { useMemo } from "react";
import { BarChartComponent, LineChartComponent, PieChartComponent } from "./Charts";

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

export default function Dashboard({ data, columns }) {
    const numericColumns = columns.filter((col) =>
        data.slice(0, 10).every((row) => isNumeric(row[col]))
    );
    const textColumns = columns.filter((col) => !numericColumns.includes(col));

    const firstNumCol = numericColumns[0];
    const secondNumCol = numericColumns[1];
    const firstTextCol = textColumns[0] || columns[0];

    const chartData = useMemo(() => data.slice(0, 30), [data]);

    const pieData = useMemo(() => {
        if (!firstTextCol) return [];
        const counts = {};
        data.forEach((row) => {
            const val = row[firstTextCol];
            counts[val] = (counts[val] || 0) + 1;
        });
        return Object.entries(counts)
            .slice(0, 6)
            .map(([name, value]) => ({ name, value }));
    }, [data, firstTextCol]);

    const stats = useMemo(() => {
        return numericColumns.slice(0, 4).map((col) => {
            const values = data.map((r) => parseFloat(r[col])).filter((v) => !isNaN(v));
            const sum = values.reduce((a, b) => a + b, 0);
            const avg = (sum / values.length).toFixed(2);
            const max = values.reduce((a, b) => (b > a ? b : a), values[0]);
            const min = values.reduce((a, b) => (b < a ? b : a), values[0]);
            return { col, avg, max, min, total: values.length };
        });
    }, [data, numericColumns]);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((s) => (
                        <div key={s.col} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
                            <p className="text-gray-500 text-sm">{s.col}</p>
                            <p className="text-2xl font-bold text-violet-400 mt-1">{s.avg}</p>
                            <p className="text-gray-500 text-xs mt-1">avg · max {s.max} · min {s.min}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {firstNumCol && (
                    <BarChartComponent
                        data={chartData}
                        xKey={firstTextCol || columns[0]}
                        yKey={firstNumCol}
                        title={`${firstNumCol} — Bar Chart`}
                    />
                )}
                {firstNumCol && (
                    <LineChartComponent
                        data={chartData}
                        xKey={firstTextCol || columns[0]}
                        yKey={firstNumCol}
                        title={`${firstNumCol} — Trend Line`}
                    />
                )}
                {pieData.length > 0 && (
                    <PieChartComponent
                        data={pieData}
                        title={`${firstTextCol} — Distribution`}
                    />
                )}
                {secondNumCol && (
                    <BarChartComponent
                        data={chartData}
                        xKey={firstTextCol || columns[0]}
                        yKey={secondNumCol}
                        title={`${secondNumCol} — Bar Chart`}
                    />
                )}
            </div>
        </div>
    );
}