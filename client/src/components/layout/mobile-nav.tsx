import { Link, useLocation } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "fas fa-chart-line" },
    { name: "Transactions", href: "/transactions", icon: "fas fa-list" },
    { name: "Budgets", href: "/budgets", icon: "fas fa-wallet" },
    { name: "Insights", href: "/insights", icon: "fas fa-brain" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="flex justify-around py-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <a className={`flex flex-col items-center p-2 ${
                isActive ? "text-primary-500" : "text-slate-500"
              }`}>
                <i className={`${item.icon} text-xl mb-1`}></i>
                <span className="text-xs">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
