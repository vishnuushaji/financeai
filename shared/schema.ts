import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // 'income' or 'expense'
  date: timestamp("date").notNull(),
  isAutoCategorized: text("is_auto_categorized").default("false"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const budgets = pgTable("budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull().unique(),
  limit: decimal("limit", { precision: 10, scale: 2 }).notNull(),
  spent: decimal("spent", { precision: 10, scale: 2 }).default("0"),
  month: text("month").notNull(), // YYYY-MM format
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  isAutoCategorized: true,
});

export const insertBudgetSchema = createInsertSchema(budgets).omit({
  id: true,
  createdAt: true,
  spent: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

// Financial health metrics type
export type FinancialHealth = {
  score: number;
  monthlySpending: number;
  budgetRemaining: number;
  spendingTrend: number; // percentage change from last month
};

// Dashboard analytics type
export type SpendingAnalytics = {
  monthlyTrends: Array<{ month: string; amount: number }>;
  categoryBreakdown: Array<{ category: string; amount: number; color: string }>;
  budgetProgress: Array<{ category: string; spent: number; limit: number; percentage: number }>;
};
