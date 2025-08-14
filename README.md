# 🚀 FinanceAI - AI-Powered Personal Finance Assistant

## Overview

FinanceAI is a comprehensive, AI-powered personal finance management platform that helps users take control of their financial future with intelligent insights, automated categorization, and beautiful visualizations.

### 🎯 Key Features

- **🤖 AI-Powered Transaction Categorization**: Automatically categorizes transactions using machine learning
- **📊 Real-Time Financial Health Scoring**: Get instant insights into your financial wellness
- **💰 Smart Budget Management**: Set and track budgets with intelligent alerts
- **📈 Advanced Analytics**: Visualize spending patterns with interactive charts
- **🔐 Secure Authentication**: Full user authentication with email verification
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-Time Updates**: Instant updates across all your devices

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** with shadcn/ui for beautiful, consistent UI components
- **TanStack Query** for powerful server state management and caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for type-safe forms
- **Recharts** for stunning financial data visualizations
- **Lucide React** for beautiful icons

### Backend Stack
- **Express.js** with TypeScript for robust API development
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **JWT Authentication** with secure session management
- **Nodemailer** for email functionality (signup verification, password reset)
- **bcryptjs** for secure password hashing

### Development Tools
- **Vite** for lightning-fast development and builds
- **ESBuild** for optimized production bundles
- **Hot Module Replacement** for instant development feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- SMTP credentials for email functionality

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd financeai
npm install
```

2. **Set up your database:**
```bash
# The project will automatically set up PostgreSQL tables
npm run db:push
```

3. **Configure email credentials:**
   - Add your SMTP credentials to the environment
   - Email functionality uses Gmail SMTP by default

4. **Start development server:**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Create a new user account with email verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "Account created successfully. Please check your email to verify your account.",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": false
  }
}
```

#### `POST /api/auth/login`
Authenticate user and return access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### `POST /api/auth/forgot-password`
Send password reset email to user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### `POST /api/auth/reset-password`
Reset user password using token from email.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "newpassword123"
}
```

### Transaction Management

#### `GET /api/transactions`
Retrieve user's transactions with optional filtering.

**Query Parameters:**
- `category`: Filter by category
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)

**Response:**
```json
[
  {
    "id": "transaction_id",
    "amount": "150.00",
    "description": "Grocery shopping",
    "category": "Food & Dining",
    "type": "expense",
    "date": "2025-08-14T00:00:00.000Z",
    "isAutoCategorized": "true",
    "createdAt": "2025-08-14T08:00:00.000Z"
  }
]
```

#### `POST /api/transactions`
Create a new transaction with automatic categorization.

**Request Body:**
```json
{
  "amount": "50.00",
  "description": "Coffee shop",
  "category": "Food & Dining", // Optional - will auto-categorize if not provided
  "type": "expense", // "expense" or "income"
  "date": "2025-08-14"
}
```

#### `PATCH /api/transactions/:id`
Update an existing transaction.

#### `DELETE /api/transactions/:id`
Delete a transaction.

### Budget Management

#### `GET /api/budgets`
Get all user budgets for current or specified month.

**Query Parameters:**
- `month`: YYYY-MM format (optional, defaults to current month)

#### `POST /api/budgets`
Create a new budget.

**Request Body:**
```json
{
  "category": "Food & Dining",
  "limit": "500.00",
  "month": "2025-08"
}
```

#### `PATCH /api/budgets/:id`
Update a budget.

#### `DELETE /api/budgets/:id`
Delete a budget.

### Analytics & Insights

#### `GET /api/financial-health`
Get user's financial health score and metrics.

**Response:**
```json
{
  "score": 85,
  "monthlySpending": 1250.50,
  "budgetRemaining": 749.50,
  "spendingTrend": -5.2
}
```

#### `GET /api/analytics`
Get comprehensive spending analytics.

**Response:**
```json
{
  "monthlyTrends": [
    { "month": "Jan", "amount": 1200 },
    { "month": "Feb", "amount": 1350 }
  ],
  "categoryBreakdown": [
    { "category": "Food & Dining", "amount": 450, "color": "#f59e0b" }
  ],
  "budgetProgress": [
    { "category": "Food & Dining", "spent": 450, "limit": 500, "percentage": 90 }
  ]
}
```

#### `GET /api/categories`
Get all available transaction categories.

## 🎨 User Interface Features

### Dashboard
- **Financial Health Score**: AI-powered scoring with visual indicators
- **Income/Expense Overview**: Beautiful cards showing financial summary
- **Budget Alerts**: Smart notifications when approaching budget limits
- **Quick Actions**: Easy access to add transactions and budgets

### Transaction Management
- **Smart Categorization**: AI automatically categorizes transactions
- **Advanced Filtering**: Filter by category, date range, type
- **Quick Edit**: In-line editing with form validation
- **Bulk Operations**: Select and manage multiple transactions

### Budget Tracking
- **Visual Progress Bars**: See spending progress at a glance
- **Color-Coded Alerts**: Green, amber, red indicators for budget status
- **Monthly Views**: Track budgets across different months
- **Smart Recommendations**: AI-powered budget suggestions

### Analytics & Insights
- **Interactive Charts**: Beautiful visualizations using Recharts
- **Spending Trends**: Track expenses over time
- **Category Breakdown**: Pie charts showing spending distribution
- **Financial Health Metrics**: Comprehensive financial wellness scoring

### Authentication Pages
- **Futuristic Design**: Beautiful gradient backgrounds with animated elements
- **Email Verification**: Secure signup process with email confirmation
- **Password Recovery**: Streamlined password reset workflow
- **Mobile Responsive**: Perfect experience on all devices

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt for secure password storage
- **Email Verification**: Mandatory email verification for new accounts
- **Token Expiration**: Automatic token refresh and expiration handling
- **SQL Injection Protection**: Parameterized queries with Drizzle ORM
- **CORS Protection**: Secure cross-origin request handling

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Secure JWT signing secret
   - Email SMTP credentials
3. **Deploy**: Vercel will automatically build and deploy your app

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
```

## 🧠 AI Features

### Transaction Categorization
The AI system uses sophisticated keyword matching and pattern recognition to automatically categorize transactions:

- **Smart Keywords**: Recognizes merchant names, transaction types, and spending patterns
- **Learning Capability**: Improves accuracy based on user corrections
- **Fallback Categories**: Intelligent default categorization for unknown transactions
- **Custom Rules**: Users can create custom categorization rules

### Financial Health Scoring
AI-powered financial wellness scoring considers:

- **Budget Adherence**: How well you stick to your budgets
- **Spending Patterns**: Analysis of spending trends and habits
- **Savings Rate**: Income vs. expenses ratio
- **Category Distribution**: Balance across spending categories

## 📱 Mobile Experience

- **Responsive Design**: Adapts perfectly to mobile screens
- **Touch-Friendly**: Optimized for touch interactions
- **Fast Loading**: Optimized performance for mobile networks
- **Offline Capability**: Progressive Web App features for offline access

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Database operations
npm run db:push    # Push schema changes to database
npm run db:studio  # Open Drizzle Studio for database management

# Code quality
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler
```

### Project Structure

```
financeai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Application pages
├── server/                # Express backend
│   ├── auth.ts           # Authentication logic
│   ├── emailService.ts   # Email functionality
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/                # Shared types and schemas
│   └── schema.ts         # Database schema and Zod validation
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ using modern web technologies** 

🚀 Start managing your finances smarter with FinanceAI today!