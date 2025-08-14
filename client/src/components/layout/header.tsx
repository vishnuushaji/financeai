import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TransactionModal from "@/components/transactions/transaction-modal";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 text-slate-600">
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Input 
                type="text" 
                placeholder="Search transactions..."
                className="w-80 pl-10"
              />
              <i className="fas fa-search absolute left-3 top-3 text-slate-400"></i>
            </div>
            
            {/* Add Transaction Button */}
            <Button 
              onClick={() => setIsTransactionModalOpen(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              <span className="hidden sm:inline">Add Transaction</span>
            </Button>
            
            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:text-slate-900">
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </header>

      <TransactionModal 
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />
    </>
  );
}
