import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBudgetSchema } from "@shared/schema";
import { categorizeTransaction } from "../client/src/lib/ml-categorization";

export async function registerRoutes(app: Express): Promise<Server> {
  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const { category, startDate, endDate } = req.query;
      
      let transactions;
      if (category) {
        transactions = await storage.getTransactionsByCategory(category as string);
      } else if (startDate && endDate) {
        transactions = await storage.getTransactionsByDateRange(
          new Date(startDate as string),
          new Date(endDate as string)
        );
      } else {
        transactions = await storage.getTransactions();
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      
      // Auto-categorize if no category provided
      if (!data.category || data.category === "") {
        const suggestedCategory = categorizeTransaction(data.description);
        data.category = suggestedCategory;
      }
      
      const transaction = await storage.createTransaction(data);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid transaction data" });
    }
  });

  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertTransactionSchema.partial().parse(req.body);
      const transaction = await storage.updateTransaction(id, data);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTransaction(id);
      res.json({ message: "Transaction deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to delete transaction" });
    }
  });

  // Budgets
  app.get("/api/budgets", async (req, res) => {
    try {
      const { month } = req.query;
      const budgets = await storage.getBudgets(month as string);
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch budgets" });
    }
  });

  app.post("/api/budgets", async (req, res) => {
    try {
      const data = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget(data);
      res.json(budget);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid budget data" });
    }
  });

  app.put("/api/budgets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertBudgetSchema.partial().parse(req.body);
      const budget = await storage.updateBudget(id, data);
      res.json(budget);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to update budget" });
    }
  });

  app.delete("/api/budgets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteBudget(id);
      res.json({ message: "Budget deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to delete budget" });
    }
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Analytics
  app.get("/api/financial-health", async (req, res) => {
    try {
      const health = await storage.getFinancialHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch financial health data" });
    }
  });

  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getSpendingAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Auto-categorization endpoint
  app.post("/api/categorize", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }
      
      const category = categorizeTransaction(description);
      res.json({ category });
    } catch (error) {
      res.status(500).json({ message: "Failed to categorize transaction" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
