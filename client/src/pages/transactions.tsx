import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@shared/schema";

export default function Transactions() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Food & Dining": "fas fa-utensils",
      "Transportation": "fas fa-car",
      "Entertainment": "fas fa-gamepad",
      "Shopping": "fas fa-shopping-cart",
      "Utilities": "fas fa-bolt",
      "Healthcare": "fas fa-heartbeat",
      "Income": "fas fa-plus",
    };
    return icons[category] || "fas fa-question";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Food & Dining": "bg-amber-100 text-amber-600",
      "Transportation": "bg-blue-100 text-blue-600",
      "Entertainment": "bg-purple-100 text-purple-600",
      "Shopping": "bg-cyan-100 text-cyan-600",
      "Utilities": "bg-red-100 text-red-600",
      "Healthcare": "bg-green-100 text-green-600",
      "Income": "bg-green-100 text-green-600",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Transactions" />
        <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Transactions" />
      <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
        <Card>
          <CardContent className="p-6">
            {!transactions || transactions.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                <i className="fas fa-receipt text-4xl mb-4"></i>
                <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                <p>Add your first transaction to get started tracking your finances.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction: Transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getCategoryColor(transaction.category)}`}>
                        <i className={getCategoryIcon(transaction.category)}></i>
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{transaction.description}</div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <span>{transaction.category}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(transaction.date)}</span>
                          {transaction.isAutoCategorized === 'true' && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="text-green-500">
                                <i className="fas fa-robot mr-1"></i>
                                Auto-categorized
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-lg ${
                        transaction.type === 'income' ? 'text-green-500' : 'text-slate-900'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount))}
                      </div>
                      <div className="text-sm text-slate-500 capitalize">
                        {transaction.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
