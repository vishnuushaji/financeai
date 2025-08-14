import Header from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";

export default function Insights() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="AI Insights" />
      <main className="flex-1 overflow-auto p-6 pb-20 lg:pb-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-slate-500 py-12">
              <i className="fas fa-brain text-4xl mb-4"></i>
              <h3 className="text-lg font-medium mb-2">AI Financial Insights</h3>
              <p>Advanced AI insights and recommendations coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
