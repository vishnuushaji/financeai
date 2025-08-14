import { Card, CardContent } from "@/components/ui/card";
import type { FinancialHealth } from "@shared/schema";

interface FinancialHealthCardProps {
  data?: FinancialHealth;
}

export default function FinancialHealthCard({ data }: FinancialHealthCardProps) {
  if (!data) return null;

  const getHealthStatus = (score: number) => {
    if (score >= 80) return "Excellent Financial Health";
    if (score >= 60) return "Good Financial Health";
    if (score >= 40) return "Fair Financial Health";
    return "Needs Improvement";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Financial Health Score */}
      <div className="lg:col-span-2 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Financial Health Score</h3>
          <i className="fas fa-heartbeat text-2xl opacity-80"></i>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-bold mb-2">{Math.round(data.score)}</div>
            <div className="text-primary-100">{getHealthStatus(data.score)}</div>
            <div className="text-sm text-primary-200 mt-2">
              {data.spendingTrend >= 0 ? '+' : ''}{data.spendingTrend.toFixed(1)}% from last month
              <i className={`fas fa-arrow-${data.spendingTrend >= 0 ? 'up' : 'down'} ml-1`}></i>
            </div>
          </div>
          <div className="w-24 h-24 relative">
            {/* Circular progress indicator */}
            <div className="w-24 h-24 border-4 border-primary-300 border-t-white rounded-full opacity-30"></div>
            <div 
              className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-white rounded-full"
              style={{ transform: `rotate(${(data.score / 100) * 360}deg)` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-600 font-medium">This Month</h4>
            <i className="fas fa-calendar-alt text-slate-400"></i>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatCurrency(data.monthlySpending)}
          </div>
          <div className={`text-sm mt-1 ${data.spendingTrend >= 0 ? 'text-red-500' : 'text-green-500'}`}>
            {data.spendingTrend >= 0 ? '+' : ''}{data.spendingTrend.toFixed(1)}% vs last month
            <i className={`fas fa-arrow-${data.spendingTrend >= 0 ? 'up' : 'down'} ml-1`}></i>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-slate-600 font-medium">Budget Left</h4>
            <i className="fas fa-piggy-bank text-slate-400"></i>
          </div>
          <div className={`text-2xl font-bold ${data.budgetRemaining >= 0 ? 'text-success-500' : 'text-red-500'}`}>
            {formatCurrency(data.budgetRemaining)}
          </div>
          <div className="text-sm text-slate-500 mt-1">
            {data.budgetRemaining >= 0 ? 'remaining' : 'over budget'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
