import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema, insertBudgetSchema, signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from "@shared/schema";
import { categorizeTransaction } from "../client/src/lib/ml-categorization";
import { 
  generateToken, 
  hashPassword, 
  comparePasswords, 
  authenticateToken, 
  requireEmailVerification, 
  createEmailVerificationToken, 
  createPasswordResetToken, 
  verifyEmailToken, 
  resetPassword,
  AuthRequest 
} from "./auth";
import { sendEmail, generateVerificationEmail, generatePasswordResetEmail } from "./emailService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        isEmailVerified: false,
      });

      // Generate verification token and send email
      const verificationToken = await createEmailVerificationToken(data.email);
      const verificationLink = `${req.protocol}://${req.get('host')}/verify-email?token=${verificationToken}`;
      
      await sendEmail({
        to: data.email,
        subject: "Verify Your Email - FinanceAI",
        html: generateVerificationEmail(verificationLink, data.firstName),
      });

      // Generate JWT token
      const token = generateToken(user.id);

      res.status(201).json({
        message: "Account created successfully. Please check your email to verify your account.",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await comparePasswords(data.password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to log in" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const data = forgotPasswordSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: "If an account with that email exists, a password reset link has been sent." });
      }

      // Generate reset token and send email
      const resetToken = await createPasswordResetToken(data.email);
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
      
      await sendEmail({
        to: data.email,
        subject: "Reset Your Password - FinanceAI",
        html: generatePasswordResetEmail(resetLink, user.firstName || undefined),
      });

      res.json({ message: "If an account with that email exists, a password reset link has been sent." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const data = resetPasswordSchema.parse(req.body);
      
      const success = await resetPassword(data.token, data.password);
      if (!success) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ message: "Verification token required" });
      }

      const email = await verifyEmailToken(token as string);
      if (!email) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  app.get("/api/auth/user", authenticateToken, async (req: AuthRequest, res) => {
    res.json({
      user: req.user,
    });
  });

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
