import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Eye,
  Download,
  Calendar,
  DollarSign,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";
import AnimatedCounter from "@/components/AnimatedCounter";
import { OrderManagement } from "@/components/OrderManagement";
import type { Order, Payment, ProjectBrief } from "@shared/schema";

export default function Dashboard() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
          <Link to="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch user data
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', user.id],
    queryFn: () => apiRequest(`/api/orders?userId=${user.id}`),
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments', user.id],
    queryFn: () => apiRequest(`/api/payments?userId=${user.id}`),
  });

  const { data: projectBriefs, isLoading: briefsLoading } = useQuery({
    queryKey: ['project-briefs', user.id],
    queryFn: () => apiRequest(`/api/project-briefs?userId=${user.id}`),
  });

  // Calculate statistics
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter((order: Order) => order.status === 'completed')?.length || 0;
  const totalSpent = orders?.reduce((sum: number, order: Order) => sum + (order.totalAmount || 0), 0) || 0;
  const pendingOrders = orders?.filter((order: Order) => order.status === 'pending')?.length || 0;

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600">Manage your projects and track progress</p>
            </div>
            <Button 
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-[#01A1C1] hover:bg-[#0891B2]"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <Package className="h-4 w-4 text-[#01A1C1]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter end={totalOrders} />
              </div>
              <p className="text-xs text-muted-foreground">
                All time projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter end={completedOrders} />
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter end={totalSpent} suffix=" SAR" />
              </div>
              <p className="text-xs text-muted-foreground">
                Investment in design
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <AnimatedCounter end={pendingOrders} />
              </div>
              <p className="text-xs text-muted-foreground">
                Active projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="briefs">Project Briefs</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Orders</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsOrderModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: Order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-[#01A1C1]/10 rounded-lg">
                            <Package className="w-5 h-5 text-[#01A1C1]" />
                          </div>
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {order.projectDescription}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {order.timeline}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-[#01A1C1]">
                              {order.totalAmount} SAR
                            </p>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">Start your first project with us!</p>
                    <Button 
                      onClick={() => setIsOrderModalOpen(true)}
                      className="bg-[#01A1C1] hover:bg-[#0891B2]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment: Payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Payment #{payment.id}</p>
                            <p className="text-sm text-gray-600">
                              Order #{payment.orderId}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {payment.amount} SAR
                          </p>
                          <Badge variant={payment.status === "completed" ? "default" : "secondary"}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-600">Payment history will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Briefs Tab */}
          <TabsContent value="briefs">
            <Card>
              <CardHeader>
                <CardTitle>Project Briefs</CardTitle>
              </CardHeader>
              <CardContent>
                {briefsLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : projectBriefs && projectBriefs.length > 0 ? (
                  <div className="space-y-4">
                    {projectBriefs.map((brief: ProjectBrief) => (
                      <div key={brief.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{brief.companyName}</h4>
                            <p className="text-sm text-gray-600">{brief.industry}</p>
                          </div>
                          <Badge variant="outline">{brief.budget}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          {brief.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Deadline: {brief.deadline}</span>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No project briefs</h3>
                    <p className="text-gray-600">Submitted briefs will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Management Modal */}
      <OrderManagement 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}