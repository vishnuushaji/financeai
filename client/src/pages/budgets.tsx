import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BudgetModal from "@/components/budgets/budget-modal";
import type { Budget } from "@shared/schema";

export default function Budgets() {
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const { data: budgets, isLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

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

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Budgets" />
        <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-slate-200 rounded"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Budgets" />
        <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Monthly Budgets</h2>
              <p className="text-slate-600 mt-1">Set and track spending limits for different categories</p>
            </div>
            <Button 
              onClick={() => setIsBudgetModalOpen(true)}
              className="bg-primary-500 hover:bg-primary-600"
            >
              <i className="fas fa-plus mr-2"></i>
              Create Budget
            </Button>
          </div>

          {(!budgets || budgets.length === 0) ? (
            <Card>
              <CardContent className="p-12 text-center">
                <i className="fas fa-wallet text-6xl text-slate-300 mb-6"></i>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Budgets Yet</h3>
                <p className="text-slate-600 mb-6">Create your first budget to start tracking your spending limits</p>
                <Button 
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create Your First Budget
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget) => {
                const spent = parseFloat(budget.spent || '0');
                const limit = parseFloat(budget.limit || '0');
                const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                const remaining = limit - spent;
                
                return (
                  <Card key={budget.id} className="border border-slate-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <i className={`${getCategoryIcon(budget.category)} ${getCategoryColor(budget.category)} text-2xl mr-3`}></i>
                          <div>
                            <h3 className="font-semibold text-slate-900">{budget.category}</h3>
                            <p className="text-sm text-slate-500">{budget.month}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(remaining)}
                          </div>
                          <div className="text-xs text-slate-500">remaining</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Spent</span>
                          <span className="font-medium">{formatCurrency(spent)} / {formatCurrency(limit)}</span>
                        </div>
                        <Progress 
                          value={Math.min(percentage, 100)} 
                          className="h-3"
                        />
                        <div className="flex justify-between text-xs">
                          <span className={`${
                            percentage >= 90 ? 'text-red-600' : 
                            percentage >= 75 ? 'text-amber-600' : 
                            'text-green-600'
                          }`}>
                            {Math.round(percentage)}% used
                          </span>
                          {percentage > 100 && (
                            <span className="text-red-600 font-medium">
                              {formatCurrency(spent - limit)} over budget
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <BudgetModal 
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />
    </>
  );
}
