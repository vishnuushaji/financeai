import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@shared/schema";

interface RecentTransactionsProps {
  data?: Transaction[];
}

export default function RecentTransactions({ data }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const diffTime = Math.abs(today.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Food & Dining": "fas fa-coffee",
      "Transportation": "fas fa-gas-pump",
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
      "Transportation": "bg-green-100 text-green-600",
      "Entertainment": "bg-purple-100 text-purple-600",
      "Shopping": "bg-blue-100 text-blue-600",
      "Utilities": "bg-red-100 text-red-600",
      "Healthcare": "bg-pink-100 text-pink-600",
      "Income": "bg-green-100 text-green-600",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  if (!data || data.length === 0) {
    return (
      <Card className="border border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
            <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600">
              View All
            </Button>
          </div>
          <div className="text-center text-slate-500 py-8">
            No transactions yet. Add your first transaction to get started.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <Button variant="ghost" size="sm" className="text-primary-500 hover:text-primary-600">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {data.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getCategoryColor(transaction.category)}`}>
                  <i className={getCategoryIcon(transaction.category)}></i>
                </div>
                <div>
                  <div className="font-medium text-slate-900">{transaction.description}</div>
                  <div className="text-sm text-slate-500">
                    {transaction.category} • {formatDate(transaction.date)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.type === 'income' ? 'text-success-500' : 'text-slate-900'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(transaction.amount))}
                </div>
                <div className="text-xs text-success-500">
                  <i className="fas fa-robot mr-1"></i>
                  {transaction.isAutoCategorized === 'true' ? 'Auto-categorized' : 'Manual'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
