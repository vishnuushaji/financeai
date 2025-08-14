import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";

export default function Budgets() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="Budgets" />
      <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-slate-500 py-12">
              <i className="fas fa-wallet text-4xl mb-4"></i>
              <h3 className="text-lg font-medium mb-2">Budget Management</h3>
              <p>Budget creation and management features coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
