import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TransactionModal from "@/components/transactions/transaction-modal";

export default function AIInsights() {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-brain text-white"></i>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">AI Financial Insights</h3>
            </div>
            <div className="space-y-4">
              <Card className="border border-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <i className="fas fa-lightbulb text-amber-500 mr-3 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Spending Pattern Alert</h4>
                      <p className="text-sm text-slate-600">
                        Your entertainment spending is approaching budget limits. Consider reducing streaming subscriptions or dining out frequency.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <i className="fas fa-chart-line text-green-500 mr-3 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Savings Opportunity</h4>
                      <p className="text-sm text-slate-600">
                        Based on your income patterns, you could save an additional $200/month by optimizing recurring subscriptions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-slate-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline"
                onClick={() => setIsTransactionModalOpen(true)}
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <i className="fas fa-plus text-2xl text-slate-400 group-hover:text-primary-500 mb-2"></i>
                <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600">Add Transaction</span>
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <i className="fas fa-target text-2xl text-slate-400 group-hover:text-primary-500 mb-2"></i>
                <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600">Set Budget</span>
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <i className="fas fa-file-export text-2xl text-slate-400 group-hover:text-primary-500 mb-2"></i>
                <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600">Export Data</span>
              </Button>
              
              <Button 
                variant="outline"
                className="flex flex-col items-center p-4 h-auto border-2 border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50 transition-colors group"
              >
                <i className="fas fa-bell text-2xl text-slate-400 group-hover:text-primary-500 mb-2"></i>
                <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600">Set Alert</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </>
  );
}
