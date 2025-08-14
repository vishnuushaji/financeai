import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import FinancialHealthCard from "@/components/dashboard/financial-health-card";
import SpendingChart from "@/components/dashboard/spending-chart";
import CategoryChart from "@/components/dashboard/category-chart";
import BudgetProgress from "@/components/dashboard/budget-progress";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AIInsights from "@/components/dashboard/ai-insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionModal from "@/components/transactions/transaction-modal";
import BudgetModal from "@/components/budgets/budget-modal";
import type { Transaction, Budget } from "@shared/schema";

export default function Dashboard() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const { data: financialHealth, isLoading: isHealthLoading } = useQuery({
    queryKey: ["/api/financial-health"],
  });

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: budgets, isLoading: isBudgetsLoading } = useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });

  if (isHealthLoading || isAnalyticsLoading || isTransactionsLoading || isBudgetsLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" />
        <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Skeleton className="h-64 xl:col-span-2" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Calculate financial summaries
  const income = transactions?.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const expenses = transactions?.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0;
  const netBalance = income - expenses;
  
  const recentTransactions = transactions?.slice(0, 4) || [];

  // Budget warnings
  const budgetWarnings = budgets?.filter(budget => {
    const spent = parseFloat(budget.spent || '0');
    const limit = parseFloat(budget.limit || '0');
    return (spent / limit) >= 0.8; // 80% or more spent
  }) || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Finance AI" />
        <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
          {/* Budget Warnings */}
          {budgetWarnings.length > 0 && (
            <div className="mb-6 space-y-2">
              {budgetWarnings.map((budget) => {
                const spent = parseFloat(budget.spent || '0');
                const limit = parseFloat(budget.limit || '0');
                const percentage = (spent / limit) * 100;
                
                return (
                  <Alert key={budget.id} className={`border-l-4 ${percentage >= 100 ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'}`}>
                    <i className="fas fa-exclamation-triangle text-amber-600"></i>
                    <AlertDescription className="ml-2">
                      {percentage >= 100 ? (
                        <span className="text-red-700 font-medium">
                          ⚠️ Budget exceeded for {budget.category}! You've spent {formatCurrency(spent)} of {formatCurrency(limit)} ({Math.round(percentage)}%)
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">
                          ⚠️ Warning: You've spent {Math.round(percentage)}% of your {budget.category} budget ({formatCurrency(spent)} / {formatCurrency(limit)})
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          )}

          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                  <i className="fas fa-arrow-up mr-2"></i>
                  Total Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{formatCurrency(income)}</div>
                <p className="text-xs text-green-600 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700 flex items-center">
                  <i className="fas fa-arrow-down mr-2"></i>
                  Total Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{formatCurrency(expenses)}</div>
                <p className="text-xs text-red-600 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className={`border-slate-200 ${netBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-sm font-medium ${netBalance >= 0 ? 'text-blue-700' : 'text-orange-700'} flex items-center`}>
                  <i className="fas fa-balance-scale mr-2"></i>
                  Net Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
                  {formatCurrency(netBalance)}
                </div>
                <p className={`text-xs ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'} mt-1`}>
                  {netBalance >= 0 ? 'Positive balance' : 'Negative balance'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Progress Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Budget Tracking</h2>
              <div className="space-x-2">
                <Button 
                  onClick={() => setIsTransactionModalOpen(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add Transaction
                </Button>
                <Button 
                  onClick={() => setIsBudgetModalOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <i className="fas fa-target mr-2"></i>
                  Set Budget
                </Button>
              </div>
            </div>

            {(!budgets || budgets.length === 0) ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <i className="fas fa-wallet text-4xl text-slate-300 mb-4"></i>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Budgets Set</h3>
                  <p className="text-slate-600 mb-4">Create budgets to track your spending limits</p>
                  <Button onClick={() => setIsBudgetModalOpen(true)}>
                    <i className="fas fa-plus mr-2"></i>
                    Create Budget
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {budgets.map((budget) => {
                  const spent = parseFloat(budget.spent || '0');
                  const limit = parseFloat(budget.limit || '0');
                  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                  const remaining = limit - spent;

                  return (
                    <Card key={budget.id} className="border border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <i className="fas fa-utensils text-amber-500 text-lg mr-2"></i>
                            <div>
                              <h4 className="font-medium text-slate-900">{budget.category}</h4>
                              <p className="text-xs text-slate-500">{budget.month}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <div className={`text-sm font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(remaining)}
                              </div>
                              <div className="text-xs text-slate-500">left</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingBudget(budget);
                                setIsBudgetModalOpen(true);
                              }}
                              className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                            >
                              <i className="fas fa-edit text-xs"></i>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span>Spent: {formatCurrency(spent)}</span>
                            <span>Limit: {formatCurrency(limit)}</span>
                          </div>
                          <Progress 
                            value={Math.min(percentage, 100)}
                            className={`h-2 ${
                              percentage >= 100 ? '[&>.progress-bar]:bg-red-500' :
                              percentage >= 80 ? '[&>.progress-bar]:bg-amber-500' :
                              '[&>.progress-bar]:bg-green-500'
                            }`}
                          />
                          <div className="text-xs text-center">
                            <span className={`${
                              percentage >= 100 ? 'text-red-600' :
                              percentage >= 80 ? 'text-amber-600' :
                              'text-green-600'
                            } font-medium`}>
                              {Math.round(percentage)}% used
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Financial Health Score & Quick Stats */}
          <FinancialHealthCard data={financialHealth as any} />

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            <SpendingChart data={(analytics as any)?.monthlyTrends} />
            <CategoryChart data={(analytics as any)?.categoryBreakdown} />
          </div>

          {/* Recent Transactions and AI Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <RecentTransactions data={recentTransactions} />
            <AIInsights />
          </div>
        </main>
      </div>

      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
      <BudgetModal 
        isOpen={isBudgetModalOpen}
        onClose={() => {
          setIsBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        budget={editingBudget}
      />
    </>
  );
}
