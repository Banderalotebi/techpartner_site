import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Package, CreditCard, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import type { Order, Payment, InsertOrder } from "@shared/schema";

// Order form schema
const orderSchema = z.object({
  servicePackageId: z.number(),
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  projectDescription: z.string().min(10, "Project description must be at least 10 characters"),
  requirements: z.string().optional(),
  budget: z.number().min(1, "Budget must be greater than 0"),
  timeline: z.string().min(1, "Timeline is required"),
});

type OrderForm = z.infer<typeof orderSchema>;

interface OrderManagementProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackageId?: number;
}

export function OrderManagement({ isOpen, onClose, servicePackageId }: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get user orders
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => apiRequest(`/api/orders?userId=${user?.id}`),
    enabled: !!user?.id && isAuthenticated,
  });

  // Get order payments
  const { data: payments } = useQuery({
    queryKey: ['payments', selectedOrder?.id],
    queryFn: () => apiRequest(`/api/payments?orderId=${selectedOrder?.id}`),
    enabled: !!selectedOrder?.id,
  });

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      servicePackageId: servicePackageId || 0,
      customerName: user ? `${user.firstName} ${user.lastName}` : "",
      customerEmail: user?.email || "",
      customerPhone: user?.phone || "",
      projectDescription: "",
      requirements: "",
      budget: 0,
      timeline: "",
    },
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (data: OrderForm) => {
      const orderData: InsertOrder = {
        userId: user?.id || 0,
        servicePackageId: data.servicePackageId,
        status: "pending",
        totalAmount: data.budget,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        projectDescription: data.projectDescription,
        requirements: data.requirements,
        timeline: data.timeline,
      };
      return apiRequest('/api/orders', {
        method: 'POST',
        body: orderData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      form.reset();
      onClose();
    },
  });

  const handleCreateOrder = (data: OrderForm) => {
    if (!isAuthenticated) {
      // Should open auth modal
      return;
    }
    createOrderMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "in_progress": return <AlertCircle className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication Required</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">Please log in to manage your orders</p>
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Order Management</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Order */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create New Order</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateOrder)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter customer name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Enter email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Describe your project requirements..."
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (SAR)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            placeholder="0"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 2 weeks" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#01A1C1] hover:bg-[#0891B2]"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    "Create Order"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Orders</h3>
            
            {ordersLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orders.map((order: Order) => (
                  <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">
                          Order #{order.id}
                        </CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600 line-clamp-2">
                          {order.projectDescription}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#01A1C1]">
                            {order.totalAmount} SAR
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No orders yet</p>
                <p className="text-sm">Create your first order to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Order #{selectedOrder.id} Details</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Status</Label>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1 capitalize">{selectedOrder.status}</span>
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Amount</Label>
                    <p className="text-lg font-semibold text-[#01A1C1]">{selectedOrder.totalAmount} SAR</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Project Description</Label>
                  <p className="mt-1 text-gray-900">{selectedOrder.projectDescription}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">Timeline</Label>
                  <p className="mt-1 text-gray-900">{selectedOrder.timeline}</p>
                </div>

                {payments && payments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500 mb-3 block">Payment History</Label>
                    <div className="space-y-2">
                      {payments.map((payment: Payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">{payment.amount} SAR</p>
                              <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                            </div>
                          </div>
                          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}