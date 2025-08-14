import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import FinancialHealthCard from "@/components/dashboard/financial-health-card";
import SpendingChart from "@/components/dashboard/spending-chart";
import CategoryChart from "@/components/dashboard/category-chart";
import BudgetProgress from "@/components/dashboard/budget-progress";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import AIInsights from "@/components/dashboard/ai-insights";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: financialHealth, isLoading: isHealthLoading } = useQuery({
    queryKey: ["/api/financial-health"],
  });

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  if (isHealthLoading || isAnalyticsLoading || isTransactionsLoading) {
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const recentTransactions = transactions?.slice(0, 4) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Dashboard" />
      <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
        {/* Financial Health Score & Quick Stats */}
        <FinancialHealthCard data={financialHealth} />

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <SpendingChart data={analytics?.monthlyTrends} />
          <CategoryChart data={analytics?.categoryBreakdown} />
        </div>

        {/* Budget Progress and Recent Transactions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <BudgetProgress data={analytics?.budgetProgress} />
          <RecentTransactions data={recentTransactions} />
        </div>

        {/* AI Insights and Quick Actions */}
        <AIInsights />
      </main>
    </div>
  );
}
