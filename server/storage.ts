import { type Transaction, type InsertTransaction, type Budget, type InsertBudget, type Category, type InsertCategory, type FinancialHealth, type SpendingAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Transactions
  getTransactions(): Promise<Transaction[]>;
  getTransactionsByCategory(category: string): Promise<Transaction[]>;
  getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  
  // Budgets
  getBudgets(month?: string): Promise<Budget[]>;
  getBudgetByCategory(category: string, month: string): Promise<Budget | undefined>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: string, budget: Partial<InsertBudget>): Promise<Budget>;
  deleteBudget(id: string): Promise<void>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Analytics
  getFinancialHealth(): Promise<FinancialHealth>;
  getSpendingAnalytics(): Promise<SpendingAnalytics>;
}

export class MemStorage implements IStorage {
  private transactions: Map<string, Transaction>;
  private budgets: Map<string, Budget>;
  private categories: Map<string, Category>;

  constructor() {
    this.transactions = new Map();
    this.budgets = new Map();
    this.categories = new Map();
    
    // Initialize default categories
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: "Food & Dining", icon: "fas fa-utensils", color: "#f59e0b" },
      { name: "Transportation", icon: "fas fa-car", color: "#3b82f6" },
      { name: "Entertainment", icon: "fas fa-gamepad", color: "#8b5cf6" },
      { name: "Shopping", icon: "fas fa-shopping-cart", color: "#06b6d4" },
      { name: "Utilities", icon: "fas fa-bolt", color: "#ef4444" },
      { name: "Healthcare", icon: "fas fa-heartbeat", color: "#10b981" },
      { name: "Income", icon: "fas fa-plus", color: "#10b981" },
      { name: "Other", icon: "fas fa-question", color: "#6b7280" },
    ];

    defaultCategories.forEach(category => {
      const id = randomUUID();
      this.categories.set(id, { ...category, id });
    });
  }

  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => t.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
      isAutoCategorized: "false",
    };
    this.transactions.set(id, transaction);
    
    // Update budget spending
    await this.updateBudgetSpending(transaction.category, parseFloat(transaction.amount));
    
    return transaction;
  }

  async updateTransaction(id: string, update: Partial<InsertTransaction>): Promise<Transaction> {
    const existing = this.transactions.get(id);
    if (!existing) {
      throw new Error("Transaction not found");
    }
    
    const updated = { ...existing, ...update };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      // Reverse budget spending
      await this.updateBudgetSpending(transaction.category, -parseFloat(transaction.amount));
      this.transactions.delete(id);
    }
  }

  async getBudgets(month?: string): Promise<Budget[]> {
    const currentMonth = month || new Date().toISOString().slice(0, 7);
    return Array.from(this.budgets.values())
      .filter(b => b.month === currentMonth);
  }

  async getBudgetByCategory(category: string, month: string): Promise<Budget | undefined> {
    return Array.from(this.budgets.values())
      .find(b => b.category === category && b.month === month);
  }

  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = randomUUID();
    const budget: Budget = {
      ...insertBudget,
      id,
      spent: "0",
      createdAt: new Date(),
    };
    this.budgets.set(id, budget);
    return budget;
  }

  async updateBudget(id: string, update: Partial<InsertBudget>): Promise<Budget> {
    const existing = this.budgets.get(id);
    if (!existing) {
      throw new Error("Budget not found");
    }
    
    const updated = { ...existing, ...update };
    this.budgets.set(id, updated);
    return updated;
  }

  async deleteBudget(id: string): Promise<void> {
    this.budgets.delete(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  private async updateBudgetSpending(category: string, amount: number): Promise<void> {
    if (amount <= 0) return; // Only track expenses
    
    const currentMonth = new Date().toISOString().slice(0, 7);
    const budget = Array.from(this.budgets.values())
      .find(b => b.category === category && b.month === currentMonth);
    
    if (budget) {
      budget.spent = (parseFloat(budget.spent) + amount).toString();
      this.budgets.set(budget.id, budget);
    }
  }

  async getFinancialHealth(): Promise<FinancialHealth> {
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      .toISOString().slice(0, 7);

    // Get current month transactions
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const currentTransactions = await this.getTransactionsByDateRange(currentMonthStart, currentMonthEnd);
    
    // Get last month transactions
    const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    const lastTransactions = await this.getTransactionsByDateRange(lastMonthStart, lastMonthEnd);

    const currentSpending = currentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const lastSpending = lastTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const spendingTrend = lastSpending > 0 ? ((currentSpending - lastSpending) / lastSpending) * 100 : 0;

    // Calculate budget remaining
    const budgets = await this.getBudgets(currentMonth);
    const totalBudget = budgets.reduce((sum, b) => sum + parseFloat(b.limit), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + parseFloat(b.spent), 0);
    const budgetRemaining = totalBudget - totalSpent;

    // Calculate health score (simplified algorithm)
    let score = 100;
    if (budgetRemaining < 0) score -= 30; // Over budget
    if (spendingTrend > 10) score -= 20; // Spending increased significantly
    if (currentSpending > 3000) score -= 10; // High spending
    score = Math.max(0, Math.min(100, score));

    return {
      score,
      monthlySpending: currentSpending,
      budgetRemaining,
      spendingTrend,
    };
  }

  async getSpendingAnalytics(): Promise<SpendingAnalytics> {
    const currentDate = new Date();
    
    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const transactions = await this.getTransactionsByDateRange(startDate, endDate);
      const amount = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        amount,
      });
    }

    // Category breakdown (current month)
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const currentMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const currentTransactions = await this.getTransactionsByDateRange(currentMonthStart, currentMonthEnd);
    
    const categoryMap = new Map<string, number>();
    const categories = await this.getCategories();
    const categoryColors = new Map(categories.map(c => [c.name, c.color]));
    
    currentTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + parseFloat(t.amount));
      });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      color: categoryColors.get(category) || '#6b7280',
    }));

    // Budget progress
    const currentMonth = currentDate.toISOString().slice(0, 7);
    const budgets = await this.getBudgets(currentMonth);
    const budgetProgress = budgets.map(budget => ({
      category: budget.category,
      spent: parseFloat(budget.spent),
      limit: parseFloat(budget.limit),
      percentage: (parseFloat(budget.spent) / parseFloat(budget.limit)) * 100,
    }));

    return {
      monthlyTrends,
      categoryBreakdown,
      budgetProgress,
    };
  }
}

export const storage = new MemStorage();
