import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  FileText,
  Calendar,
  Trash2,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import type { Order, Payment, ProjectBrief, User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Status badge component
const StatusBadge = ({ status }: { status: string | null }) => {
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={`${getStatusColor(status)} border-0`}>
      {status || 'unknown'}
    </Badge>
  );
};

// Order details modal
const OrderDetailsModal = ({ order, users }: { order: Order, users: User[] }) => {
  const user = users.find(u => u.id === order.userId);
  
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Order #{order.id} Details</DialogTitle>
        <DialogDescription>Complete order information and customer details</DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Customer Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <Users className="mr-2" size={16} />
            Customer Information
          </h3>
          {user ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Name:</p>
                <p>{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p>{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="font-medium">Username:</p>
                <p>{user.username}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Customer information not available</p>
          )}
        </div>

        {/* Order Info */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <ShoppingCart className="mr-2" size={16} />
            Order Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Order ID:</p>
              <p>#{order.id}</p>
            </div>
            <div>
              <p className="font-medium">Total Amount:</p>
              <p className="font-bold text-lg">{order.totalAmount} SAR</p>
            </div>
            <div>
              <p className="font-medium">Status:</p>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <p className="font-medium">Payment Status:</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <div>
              <p className="font-medium">Created:</p>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-medium">Updated:</p>
              <p>{new Date(order.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Order Data */}
        {order.orderData && (
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="mr-2" size={16} />
              Project Details
            </h3>
            <div className="bg-white p-3 rounded border">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(order.orderData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
};

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  // Fetch all data
  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: projectBriefs = [], isLoading: briefsLoading } = useQuery<ProjectBrief[]>({
    queryKey: ["/api/project-briefs"],
  });

  // Order status update functionality
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<string>("");

  // Update order status mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest(`/api/orders/${id}`, {
        method: "PATCH",
        body: { status },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    },
  });

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = searchTerm === "" || 
      order.id.toString().includes(searchTerm) ||
      order.totalAmount.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const recentOrders = orders.filter(order => {
    const daysDiff = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 7;
  }).length;

  if (ordersLoading || paymentsLoading || usersLoading || briefsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01A1C1] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Site
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">TechPartner Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-[#01A1C1] border-[#01A1C1]">
                Admin Dashboard
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} SAR</div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">All orders received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedOrders}</div>
              <p className="text-xs text-muted-foreground">{pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentOrders}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="briefs">Project Briefs ({projectBriefs.length})</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="mr-2" size={20} />
                    Revenue Analytics
                  </CardTitle>
                  <CardDescription>Monthly revenue breakdown and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-sm text-green-600">This Month</div>
                        <div className="text-2xl font-bold text-green-700">
                          {orders.filter(order => {
                            const orderDate = new Date(order.createdAt);
                            const now = new Date();
                            return orderDate.getMonth() === now.getMonth() && 
                                   orderDate.getFullYear() === now.getFullYear();
                          }).reduce((sum, order) => sum + parseFloat(order.totalAmount), 0).toLocaleString()} SAR
                        </div>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm text-blue-600">Average Order</div>
                        <div className="text-2xl font-bold text-blue-700">
                          {(totalRevenue / orders.length || 0).toFixed(0)} SAR
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-sm text-purple-600">Top Service Category</div>
                      <div className="text-lg font-semibold text-purple-700">
                        Logo & Identity Design
                      </div>
                      <div className="text-sm text-purple-600">
                        {orders.filter(order => order.serviceId === 1).length} orders
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2" size={20} />
                    Order Status Distribution
                  </CardTitle>
                  <CardDescription>Current status breakdown of all orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{completedOrders}</span>
                        <Badge variant="outline" className="text-green-600">
                          {Math.round((completedOrders / orders.length) * 100) || 0}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{pendingOrders}</span>
                        <Badge variant="outline" className="text-yellow-600">
                          {Math.round((pendingOrders / orders.length) * 100) || 0}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm">Processing</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {orders.filter(order => order.status === 'processing').length}
                        </span>
                        <Badge variant="outline" className="text-blue-600">
                          {Math.round((orders.filter(order => order.status === 'processing').length / orders.length) * 100) || 0}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2" size={20} />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest orders and project submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => {
                      const user = users.find(u => u.id === order.userId);
                      return (
                        <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="text-sm font-medium">
                              Order #{order.id}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user?.firstName} {user?.lastName} - {order.totalAmount} SAR
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2" size={20} />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>Popular payment methods breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Credit Card</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {payments.filter(payment => payment.paymentMethod === 'Credit Card').length}
                        </span>
                        <Badge variant="outline" className="text-blue-600">
                          {Math.round((payments.filter(payment => payment.paymentMethod === 'Credit Card').length / payments.length) * 100) || 0}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bank Transfer</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">
                          {payments.filter(payment => payment.paymentMethod === 'Bank Transfer').length}
                        </span>
                        <Badge variant="outline" className="text-green-600">
                          {Math.round((payments.filter(payment => payment.paymentMethod === 'Bank Transfer').length / payments.length) * 100) || 0}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Orders Management</CardTitle>
                    <CardDescription>View and manage all customer orders</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2" size={16} />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search orders by ID or amount..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Orders Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => {
                        const user = users.find(u => u.id === order.userId);
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>
                              {user ? `${user.firstName} ${user.lastName}` : 'Unknown Customer'}
                              <div className="text-sm text-gray-500">{user?.email}</div>
                            </TableCell>
                            <TableCell className="font-bold">{order.totalAmount} SAR</TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.paymentStatus} />
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Eye className="mr-1" size={14} />
                                      View
                                    </Button>
                                  </DialogTrigger>
                                  <OrderDetailsModal order={order} users={users} />
                                </Dialog>
                                
                                <Select
                                  value={order.status || ""}
                                  onValueChange={(value) => 
                                    updateOrderMutation.mutate({ id: order.id, status: value })
                                  }
                                >
                                  <SelectTrigger className="w-28">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No orders found matching your criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payments Overview</CardTitle>
                <CardDescription>Track all payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">#{payment.id}</TableCell>
                          <TableCell>#{payment.orderId}</TableCell>
                          <TableCell className="font-bold">{payment.amount} {payment.currency}</TableCell>
                          <TableCell>{payment.paymentMethod || 'N/A'}</TableCell>
                          <TableCell>
                            <StatusBadge status={payment.status} />
                          </TableCell>
                          <TableCell>{payment.transactionId || 'N/A'}</TableCell>
                          <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>View and manage customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Last Login</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">#{user.id}</TableCell>
                          <TableCell>
                            {user.firstName} {user.lastName}
                            <div className="text-sm text-gray-500">@{user.username}</div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Briefs Tab */}
          <TabsContent value="briefs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Briefs</CardTitle>
                <CardDescription>View customer project requirements and briefs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Brief ID</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectBriefs.map((brief) => (
                        <TableRow key={brief.id}>
                          <TableCell className="font-medium">#{brief.id}</TableCell>
                          <TableCell>{brief.companyName}</TableCell>
                          <TableCell>{brief.industry}</TableCell>
                          <TableCell>{brief.budget || 'Not specified'}</TableCell>
                          <TableCell>{brief.deadline || 'Flexible'}</TableCell>
                          <TableCell>{brief.email}</TableCell>
                          <TableCell>{new Date(brief.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}