// Simple ML-like categorization using keyword matching
// In a real application, this would use a trained ML model

const categoryKeywords = {
  "Food & Dining": [
    "restaurant", "coffee", "starbucks", "mcdonald", "pizza", "burger", "taco",
    "food", "dining", "cafe", "bakery", "bar", "pub", "kitchen", "eat",
    "grocery", "supermarket", "market", "whole foods", "trader joe", "safeway"
  ],
  "Transportation": [
    "gas", "fuel", "shell", "exxon", "chevron", "bp", "uber", "lyft", "taxi",
    "metro", "bus", "train", "parking", "toll", "car", "auto", "repair",
    "tire", "oil change", "airline", "flight", "airport"
  ],
  "Entertainment": [
    "movie", "cinema", "theater", "netflix", "spotify", "apple music", "hulu",
    "disney", "amazon prime", "youtube", "game", "gaming", "steam", "xbox",
    "playstation", "concert", "show", "event", "ticket", "music", "book"
  ],
  "Shopping": [
    "amazon", "target", "walmart", "costco", "best buy", "apple store",
    "clothing", "shoes", "electronics", "home depot", "lowes", "ikea",
    "mall", "store", "shop", "purchase", "buy", "order"
  ],
  "Utilities": [
    "electric", "electricity", "gas bill", "water", "internet", "phone",
    "cable", "utility", "bill", "comcast", "verizon", "att", "sprint",
    "energy", "power", "waste", "garbage", "recycling"
  ],
  "Healthcare": [
    "doctor", "hospital", "clinic", "pharmacy", "cvs", "walgreens", "medical",
    "health", "dentist", "dental", "vision", "eye", "prescription", "medicine",
    "insurance", "copay", "therapy", "physical therapy"
  ],
  "Income": [
    "salary", "paycheck", "deposit", "direct deposit", "bonus", "refund",
    "tax refund", "cashback", "dividend", "interest", "freelance", "contract"
  ]
};

export function categorizeTransaction(description: string): string {
  if (!description) return "Other";
  
  const lowerDescription = description.toLowerCase();
  
  // Check each category for keyword matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerDescription.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return "Other";
}

export function getCategoryConfidence(description: string, category: string): number {
  if (!description || !category) return 0;
  
  const lowerDescription = description.toLowerCase();
  const keywords = categoryKeywords[category as keyof typeof categoryKeywords];
  
  if (!keywords) return 0;
  
  let matches = 0;
  for (const keyword of keywords) {
    if (lowerDescription.includes(keyword.toLowerCase())) {
      matches++;
    }
  }
  
  return Math.min(matches * 0.3, 1); // Max confidence of 1.0
}

export function getSuggestedCategories(description: string): Array<{ category: string; confidence: number }> {
  return Object.keys(categoryKeywords)
    .map(category => ({
      category,
      confidence: getCategoryConfidence(description, category)
    }))
    .filter(item => item.confidence > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}
