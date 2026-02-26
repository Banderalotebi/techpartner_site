import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ServicePackage, InsertOrder } from "@shared/schema";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage: ServicePackage | null;
}

export default function OrderModal({ isOpen, onClose, servicePackage }: OrderModalProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    requirements: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: InsertOrder) => {
      return apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: () => {
      toast({
        title: "Order Created Successfully!",
        description: "Your order has been submitted. We'll contact you within 24 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: "Order Failed",
        description: "There was an error creating your order. Please try again.",
        variant: "destructive",
      });
      console.error("Order creation error:", error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicePackage) return;

    const orderData: InsertOrder = {
      userId: 1, // Default user for demo
      serviceId: servicePackage.id,
      totalAmount: servicePackage.price.toString(),
      status: "pending",
      paymentStatus: "pending",
      orderData: {
        customerInfo,
        serviceName: servicePackage.name,
        serviceDescription: servicePackage.description
      }
    };

    createOrderMutation.mutate(orderData);
  };

  const handleClose = () => {
    setCustomerInfo({ name: "", email: "", phone: "", requirements: "" });
    onClose();
  };

  if (!servicePackage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order: {servicePackage.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Service Details</h3>
            <p className="text-gray-600 mb-2">{servicePackage.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">
                {servicePackage.price} SAR
              </span>
              {servicePackage.isPopular && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              )}
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+966 50 000 0000"
              />
            </div>

            <div>
              <Label htmlFor="requirements">Project Requirements</Label>
              <Textarea
                id="requirements"
                value={customerInfo.requirements}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Please describe your project requirements, preferred style, timeline, and any specific details..."
                rows={4}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Creating Order..." : "Place Order"}
              </Button>
            </div>
          </form>

          {/* TPOS Integration Note */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Secure Processing:</strong> Your order is processed through our TPOS (Tech Partner Order System) 
              for secure handling and tracking. You'll receive email confirmation and updates.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}