import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Receipt } from 'lucide-react';

interface OrderDetails {
  orderId: string | null;
  chargeId: string | null;
}

export default function PaymentSuccess() {
  const [location, navigate] = useLocation();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Get order details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    const chargeId = urlParams.get('tap_id');
    
    setOrderDetails({ orderId, chargeId });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
          
          {orderDetails && (orderDetails.orderId || orderDetails.chargeId) && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Receipt className="h-4 w-4" />
                <span className="font-medium">Transaction Details</span>
              </div>
              {orderDetails.orderId && (
                <p className="text-sm text-muted-foreground">
                  Order ID: {orderDetails.orderId}
                </p>
              )}
              {orderDetails.chargeId && (
                <p className="text-sm text-muted-foreground">
                  Transaction ID: {orderDetails.chargeId}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly. Our team will start working on your project within 24 hours.
            </p>
            
            <div className="pt-4 space-y-3">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Homepage
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard')} 
                variant="outline"
                className="w-full"
                size="lg"
              >
                View Order Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
