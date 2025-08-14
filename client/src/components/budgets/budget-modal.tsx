import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { insertBudgetSchema, type InsertBudget, type Budget } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
}

export default function BudgetModal({ isOpen, onClose, budget }: BudgetModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertBudget>({
    resolver: zodResolver(insertBudgetSchema.extend({
      limit: insertBudgetSchema.shape.limit.refine(val => parseFloat(val) > 0, "Budget limit must be greater than 0")
    })),
    defaultValues: {
      category: "",
      limit: "",
      month: new Date().toISOString().slice(0, 7),
    },
  });

  // Update form when budget prop changes
  useEffect(() => {
    if (budget) {
      form.reset({
        category: budget.category,
        limit: budget.limit,
        month: budget.month,
      });
    } else {
      form.reset({
        category: "",
        limit: "",
        month: new Date().toISOString().slice(0, 7),
      });
    }
  }, [budget, form]);

  const createBudgetMutation = useMutation({
    mutationFn: async (data: InsertBudget) => {
      // Fix: Use correct apiRequest format
      return apiRequest("/budgets", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-health"] });
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create budget",
        variant: "destructive",
      });
    },
  });

  const updateBudgetMutation = useMutation({
    mutationFn: async (data: InsertBudget) => {
      // Fix: Use correct apiRequest format
      return apiRequest(`/budgets/${budget?.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-health"] });
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update budget",
        variant: "destructive",
      });
    },
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: async () => {
      // Fix: Use correct apiRequest format
      return apiRequest(`/budgets/${budget?.id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/financial-health"] });
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete budget",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBudget) => {
    if (budget) {
      updateBudgetMutation.mutate(data);
    } else {
      createBudgetMutation.mutate(data);
    }
  };

  const expenseCategories = categories?.filter((c: any) => c.name !== "Income") || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <i className="fas fa-target mr-2"></i>
            {budget ? 'Edit Budget' : 'Set Budget'}
          </DialogTitle>
          <DialogDescription>
            {budget 
              ? 'Update your budget limit and settings'
              : 'Set a monthly spending limit for a category to track your budget progress'
            }
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.map((category: any) => (
                        <SelectItem key={category.id} value={category.name}>
                          <div className="flex items-center">
                            <i className={`${category.icon} mr-2`} style={{ color: category.color }}></i>
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Limit</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-500">$</span>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="month"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Month</FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex space-x-2 pt-4">
              {budget && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="destructive"
                      size="sm"
                      disabled={deleteBudgetMutation.isPending}
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this budget? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteBudgetMutation.mutate()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Budget
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              <Button 
                type="button" 
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary-500 hover:bg-primary-600"
                disabled={budget ? updateBudgetMutation.isPending : createBudgetMutation.isPending}
              >
                {budget 
                  ? (updateBudgetMutation.isPending ? "Updating..." : "Update Budget")
                  : (createBudgetMutation.isPending ? "Creating..." : "Create Budget")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}