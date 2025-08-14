import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface CategoryChartProps {
  data?: Array<{ category: string; amount: number; color: string }>;
}

export default function CategoryChart({ data }: CategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Spending by Category</h3>
          <div className="h-48 flex items-center justify-center text-slate-500">
            No spending data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Spending by Category</h3>
        <div className="h-48 flex items-center justify-center mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-slate-600">{item.category}</span>
              </div>
              <span className="text-sm font-medium text-slate-900">
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
