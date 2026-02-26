import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, Check, Clock, User } from "lucide-react";
import PaymentButton from "./PaymentButton";
import { useToast } from "@/hooks/use-toast";
import type { ServicePackage, User as UserType } from "@shared/schema";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  servicePackage: ServicePackage | null;
  onComplete: () => void;
  user: UserType | null;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  orderData, 
  servicePackage, 
  onComplete,
  user 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!servicePackage || !user) {
    return null;
  }

  const handlePaymentSuccess = () => {
    setIsProcessing(false);
    toast({
      title: "Payment Successful!",
      description: "Your order has been submitted and payment processed.",
    });
    onComplete();
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{servicePackage.name}</h3>
                  <p className="text-sm text-muted-foreground">{servicePackage.description}</p>
                  {servicePackage.isPopular && (
                    <Badge variant="secondary" className="mt-1">Most Popular</Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${servicePackage.price}</p>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Package includes:</h4>
                <ul className="space-y-1">
                  {servicePackage.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Details */}
          {orderData && Object.keys(orderData).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {orderData.logoStyle && (
                    <div>
                      <p className="text-muted-foreground">Logo Style</p>
                      <p className="font-medium">{orderData.logoStyle}</p>
                    </div>
                  )}
                  {orderData.colorPalette && (
                    <div>
                      <p className="text-muted-foreground">Color Palette</p>
                      <p className="font-medium">{orderData.colorPalette}</p>
                    </div>
                  )}
                  {orderData.companyName && (
                    <div>
                      <p className="text-muted-foreground">Company Name</p>
                      <p className="font-medium">{orderData.companyName}</p>
                    </div>
                  )}
                  {orderData.industry && (
                    <div>
                      <p className="text-muted-foreground">Industry</p>
                      <p className="font-medium">{orderData.industry}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Shield className="h-5 w-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Secure Payment</p>
              <p className="text-muted-foreground">
                Your payment is processed securely through our encrypted payment system.
                We do not store your payment information.
              </p>
            </div>
          </div>

          {/* Delivery Timeline */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Delivery Timeline</p>
              <p className="text-muted-foreground">
                Your project will be completed within 3-5 business days after payment confirmation.
                You'll receive regular updates via email.
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <div className="pt-4">
            <PaymentButton
              service={{
                title: servicePackage.name,
                price: servicePackage.price.toString(),
                currency: "SAR",
                category: "Logo Design"
              }}
              variant="default"
              size="lg"
              className="w-full"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          {/* Footer */}
          <div className="text-xs text-muted-foreground text-center">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            You will receive an email confirmation shortly after payment.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
