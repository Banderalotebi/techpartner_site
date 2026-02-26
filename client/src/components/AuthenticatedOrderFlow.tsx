import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "./AuthModal";
import OrderFlowModal from "./OrderFlowModal";
import { PaymentModal } from "./PaymentModal";
import { useToast } from "@/hooks/use-toast";
import type { ServicePackage } from "@shared/schema";

interface AuthenticatedOrderFlowProps {
  isOpen: boolean;
  onClose: () => void;
  servicePackage: ServicePackage | null;
  initialStep?: number;
  savedProgress?: any;
}

interface OrderState {
  step: number;
  formData: any;
  selections: any;
  servicePackage: ServicePackage | null;
}

export function AuthenticatedOrderFlow({ 
  isOpen, 
  onClose, 
  servicePackage,
  initialStep = 1,
  savedProgress = null
}: AuthenticatedOrderFlowProps) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [orderFlowOpen, setOrderFlowOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderState, setOrderState] = useState<OrderState>({
    step: initialStep,
    formData: savedProgress?.formData || {},
    selections: savedProgress?.selections || {},
    servicePackage
  });

  // Check authentication when component opens
  useEffect(() => {
    if (isOpen && !isLoading) {
      if (!user) {
        // Save current state and show auth modal
        saveProgressToStorage();
        setAuthModalOpen(true);
      } else {
        // User is authenticated, proceed with order flow
        setOrderFlowOpen(true);
      }
    }
  }, [isOpen, user, isLoading]);

  // Save progress to localStorage for recovery after auth
  const saveProgressToStorage = () => {
    const progressData = {
      step: orderState.step,
      formData: orderState.formData,
      selections: orderState.selections,
      servicePackage: orderState.servicePackage,
      timestamp: Date.now()
    };
    localStorage.setItem('orderProgress', JSON.stringify(progressData));
  };

  // Load progress from localStorage after auth
  const loadProgressFromStorage = () => {
    try {
      const saved = localStorage.getItem('orderProgress');
      if (saved) {
        const progressData = JSON.parse(saved);
        // Only load if saved within last 30 minutes
        if (Date.now() - progressData.timestamp < 30 * 60 * 1000) {
          setOrderState(progressData);
          localStorage.removeItem('orderProgress'); // Clean up
          return progressData;
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
    return null;
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    
    // Load saved progress
    const savedProgress = loadProgressFromStorage();
    if (savedProgress) {
      setOrderState(savedProgress);
      toast({
        title: "Welcome back!",
        description: "Continuing where you left off...",
      });
    }
    
    // Open order flow
    setOrderFlowOpen(true);
  };

  // Handle order completion (ready for payment)
  const handleOrderComplete = (completedOrderData: any) => {
    setOrderFlowOpen(false);
    setOrderState(prev => ({
      ...prev,
      formData: completedOrderData
    }));
    setPaymentModalOpen(true);
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    setPaymentModalOpen(false);
    onClose();
    toast({
      title: "Order Submitted!",
      description: "Your project has been submitted successfully. We'll be in touch soon!",
    });
  };

  // Handle any modal close
  const handleClose = () => {
    if (orderFlowOpen) {
      // Save progress before closing
      saveProgressToStorage();
      toast({
        title: "Progress Saved",
        description: "Your progress has been saved. You can continue later!",
      });
    }
    
    setAuthModalOpen(false);
    setOrderFlowOpen(false);
    setPaymentModalOpen(false);
    onClose();
  };

  if (isLoading) {
    return null; // Or loading spinner
  }

  return (
    <>
      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Order Flow Modal */}
      <OrderFlowModal
        isOpen={orderFlowOpen}
        onClose={handleClose}
        servicePackage={orderState.servicePackage}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={handleClose}
        orderData={orderState.formData}
        servicePackage={orderState.servicePackage}
        onComplete={handlePaymentComplete}
        user={user || null}
      />
    </>
  );
}
