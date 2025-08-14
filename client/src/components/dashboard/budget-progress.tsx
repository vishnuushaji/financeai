import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface BudgetProgressProps {
  data?: Array<{
    category: string;
    spent: number;
    limit: number;
    percentage: number;
  }>;
}

export default function BudgetProgress({ data }: BudgetProgressProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Food & Dining": "fas fa-utensils",
      "Transportation": "fas fa-car",
      "Entertainment": "fas fa-gamepad",
      "Shopping": "fas fa-shopping-cart",
      "Utilities": "fas fa-bolt",
      "Healthcare": "fas fa-heartbeat",
    };
    return icons[category] || "fas fa-question";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Food & Dining": "text-amber-500",
      "Transportation": "text-blue-500",
      "Entertainment": "text-purple-500",
      "Shopping": "text-cyan-500",
      "Utilities": "text-red-500",
      "Healthcare": "text-green-500",
    };
    return colors[category] || "text-gray-500";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-blue-500";
  };

  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Budget Progress</h3>
            <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600">
              View All
            </Button>
          </div>
          <div className="text-center text-slate-500 py-8">
            No budgets set up yet. Create your first budget to track spending.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Budget Progress</h3>
          <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600">
            View All
          </Button>
        </div>
        <div className="space-y-6">
          {data.slice(0, 3).map((budget, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <i className={`${getCategoryIcon(budget.category)} ${getCategoryColor(budget.category)} mr-3`}></i>
                  <span className="font-medium text-slate-900">{budget.category}</span>
                </div>
                <span className="text-sm text-slate-600">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <Progress 
                value={Math.min(budget.percentage, 100)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{Math.round(budget.percentage)}% used</span>
                <span className={budget.limit - budget.spent < 0 ? "text-red-500" : ""}>
                  {formatCurrency(budget.limit - budget.spent)} remaining
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
