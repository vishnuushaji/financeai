import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "fas fa-chart-line" },
    { name: "Transactions", href: "/transactions", icon: "fas fa-list" },
    { name: "Budgets", href: "/budgets", icon: "fas fa-wallet" },
    { name: "AI Insights", href: "/insights", icon: "fas fa-brain" },
  ];

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 bg-primary-900 text-white">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold flex items-center">
          <i className="fas fa-robot text-primary-500 mr-3"></i>
          FinanceAI
        </h1>
        <p className="text-slate-400 text-sm mt-2">AI-Powered Finance Assistant</p>
      </div>
      
      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-primary-500 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}>
              <i className={`${item.icon} mr-3`}></i>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="font-semibold">JD</span>
          </div>
          <div className="ml-3">
            <p className="font-medium">John Doe</p>
            <p className="text-slate-400 text-sm">john@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
