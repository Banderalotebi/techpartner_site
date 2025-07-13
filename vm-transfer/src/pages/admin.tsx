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

  // Blog Management State
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [blogFilter, setBlogFilter] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // Blog Calendar Data (from CSV)
  const blogCalendarData = [
    { id: 1, title: "Digital Transformation in Saudi Arabia", category: "Technology", scheduledDate: "2024-01-15", status: "scheduled", keywords: ["digital transformation", "saudi arabia", "technology", "innovation"], difficulty: "intermediate", estimatedReadTime: "8-10 minutes" },
    { id: 2, title: "Cloud Computing Benefits for Saudi Businesses", category: "Cloud", scheduledDate: "2024-01-22", status: "draft", keywords: ["cloud computing", "business benefits", "saudi arabia", "efficiency"], difficulty: "beginner", estimatedReadTime: "6-8 minutes" },
    { id: 3, title: "Cybersecurity Best Practices in the Middle East", category: "Security", scheduledDate: "2024-02-05", status: "scheduled", keywords: ["cybersecurity", "middle east", "best practices", "protection"], difficulty: "advanced", estimatedReadTime: "10-12 minutes" },
    { id: 4, title: "AI and Machine Learning Applications in Saudi Vision 2030", category: "AI", scheduledDate: "2024-02-12", status: "draft", keywords: ["artificial intelligence", "machine learning", "saudi vision 2030", "applications"], difficulty: "intermediate", estimatedReadTime: "9-11 minutes" },
    { id: 5, title: "Web Development Trends for Saudi Market", category: "Development", scheduledDate: "2024-02-19", status: "scheduled", keywords: ["web development", "trends", "saudi market", "responsive design"], difficulty: "intermediate", estimatedReadTime: "7-9 minutes" },
    { id: 6, title: "E-commerce Solutions for Small Saudi Businesses", category: "E-commerce", scheduledDate: "2024-02-26", status: "draft", keywords: ["e-commerce", "small business", "saudi arabia", "online solutions"], difficulty: "beginner", estimatedReadTime: "8-10 minutes" },
    { id: 7, title: "Mobile App Development in the Saudi Tech Scene", category: "Mobile", scheduledDate: "2024-03-05", status: "scheduled", keywords: ["mobile app development", "saudi tech", "app store", "innovation"], difficulty: "intermediate", estimatedReadTime: "9-11 minutes" },
    { id: 8, title: "Data Analytics for Saudi Businesses", category: "Analytics", scheduledDate: "2024-03-12", status: "draft", keywords: ["data analytics", "business intelligence", "saudi businesses", "insights"], difficulty: "intermediate", estimatedReadTime: "8-10 minutes" },
    { id: 9, title: "DevOps Implementation in Saudi IT Companies", category: "DevOps", scheduledDate: "2024-03-19", status: "scheduled", keywords: ["devops", "implementation", "saudi it companies", "automation"], difficulty: "advanced", estimatedReadTime: "10-12 minutes" },
    { id: 10, title: "Blockchain Technology Adoption in Saudi Arabia", category: "Blockchain", scheduledDate: "2024-03-26", status: "draft", keywords: ["blockchain", "technology adoption", "saudi arabia", "innovation"], difficulty: "advanced", estimatedReadTime: "11-13 minutes" },
    { id: 11, title: "IoT Solutions for Smart Cities in Saudi Arabia", category: "IoT", scheduledDate: "2024-04-02", status: "scheduled", keywords: ["internet of things", "smart cities", "saudi arabia", "connectivity"], difficulty: "intermediate", estimatedReadTime: "9-11 minutes" },
    { id: 12, title: "Software Quality Assurance in Saudi Tech Industry", category: "QA", scheduledDate: "2024-04-09", status: "draft", keywords: ["quality assurance", "software testing", "saudi tech industry", "best practices"], difficulty: "intermediate", estimatedReadTime: "7-9 minutes" }
  ];

  // Generate article with Gemini AI
  const generateArticleWithGemini = async (articleData: any) => {
    setIsGenerating(true);
    try {
      // Replace with your actual Gemini API key
      const API_KEY = "YOUR_GEMINI_API_KEY";
      
      if (API_KEY === "YOUR_GEMINI_API_KEY") {
        // Fallback content when API key is not configured
        setGeneratedContent(`# ${articleData.title}

## Introduction
Welcome to our comprehensive guide on ${articleData.title.toLowerCase()}. This article explores the latest trends and best practices relevant to the Saudi Arabian market.

## Key Points
${articleData.keywords.map((keyword: string) => `- ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`).join('\n')}

## Market Overview
The Saudi Arabian technology landscape is rapidly evolving, with significant investments in digital transformation and innovation initiatives aligned with Vision 2030.

## Best Practices
1. **Strategic Planning**: Develop a comprehensive strategy aligned with local market needs
2. **Technology Adoption**: Leverage cutting-edge solutions while considering cultural and regulatory requirements
3. **Local Partnerships**: Collaborate with local technology providers and consultants
4. **Continuous Learning**: Stay updated with the latest industry trends and regulations

## Implementation Guide
This section would contain detailed steps for implementing the discussed concepts in a Saudi business context.

## Conclusion
${articleData.title} represents a significant opportunity for businesses in Saudi Arabia to enhance their technological capabilities and competitive advantage.

---
*Estimated reading time: ${articleData.estimatedReadTime}*
*Difficulty level: ${articleData.difficulty}*`);
        
        toast({
          title: "Article Generated",
          description: "Sample content generated. Please configure your Gemini API key for AI-powered content.",
        });
      } else {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Write a comprehensive blog article about "${articleData.title}" targeted at the Saudi Arabian market. 
                
                Article Details:
                - Category: ${articleData.category}
                - Keywords: ${articleData.keywords.join(', ')}
                - Difficulty: ${articleData.difficulty}
                - Estimated reading time: ${articleData.estimatedReadTime}
                - Target audience: Saudi businesses and technology professionals
                
                Please write a well-structured article with:
                1. An engaging introduction
                2. Main content sections with practical insights
                3. Saudi market-specific considerations
                4. Implementation tips for local businesses
                5. A strong conclusion
                
                Use a professional yet accessible tone. Include relevant examples and references to Saudi Vision 2030 where appropriate.`
              }]
            }]
          })
        });

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Failed to generate content.";
        setGeneratedContent(generatedText);
        
        toast({
          title: "Article Generated",
          description: "AI-powered content has been generated successfully!",
        });
      }
    } catch (error) {
      console.error('Error generating article:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate article. Please check your API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="briefs">Project Briefs ({projectBriefs.length})</TabsTrigger>
            <TabsTrigger value="blog">Blog Management</TabsTrigger>
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

          {/* Blog Management Tab */}
          <TabsContent value="blog" className="space-y-6">
            {/* Blog Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{blogCalendarData.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {blogCalendarData.filter(article => article.status === 'scheduled').length} scheduled
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {blogCalendarData.filter(article => {
                      const articleDate = new Date(article.scheduledDate);
                      return articleDate.getMonth() === currentMonth;
                    }).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Articles to publish</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(blogCalendarData.map(article => article.category)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">Topic categories</p>
                </CardContent>
              </Card>
            </div>

            {/* Blog Management Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Edit className="mr-2" size={20} />
                  AI Article Generator
                </CardTitle>
                <CardDescription>
                  Generate high-quality blog articles using Gemini AI based on your content calendar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Content Calendar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Content Calendar</h3>
                      <Select value={blogFilter} onValueChange={setBlogFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Articles</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="draft">Drafts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {blogCalendarData
                        .filter(article => blogFilter === 'all' || article.status === blogFilter)
                        .map((article) => (
                          <div 
                            key={article.id} 
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedArticle?.id === article.id 
                                ? 'border-[#01A1C1] bg-blue-50' 
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedArticle(article)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{article.title}</h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {article.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(article.scheduledDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge 
                                  variant={article.status === 'scheduled' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {article.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Article Generator */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Article Generator</h3>
                    
                    {selectedArticle ? (
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{selectedArticle.title}</CardTitle>
                            <CardDescription>
                              {selectedArticle.category} • {selectedArticle.estimatedReadTime} • {selectedArticle.difficulty}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium">Keywords:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {selectedArticle.keywords.map((keyword: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium">Scheduled Date:</span>
                                <span className="text-sm text-gray-600 ml-2">
                                  {new Date(selectedArticle.scheduledDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Button 
                          onClick={() => generateArticleWithGemini(selectedArticle)}
                          disabled={isGenerating}
                          className="w-full bg-[#01A1C1] hover:bg-[#0891B2]"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Generating Article...
                            </>
                          ) : (
                            <>
                              <Edit className="mr-2 h-4 w-4" />
                              Generate Article with AI
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>Select an article from the calendar to generate content</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Generated Content Preview */}
                {generatedContent && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Generated Article Preview</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-white max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono text-gray-700">
                        {generatedContent}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="flex items-center justify-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Post
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Bulk Generate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Management Tab */}
          <TabsContent value="blog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Management</CardTitle>
                <CardDescription>Schedule and manage blog articles</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Article Generation Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Generate New Article</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Article Title"
                      value={selectedArticle?.title || ""}
                      onChange={(e) => setSelectedArticle({ ...selectedArticle, title: e.target.value })}
                      className="col-span-2"
                    />
                    <Select
                      value={selectedArticle?.category || ""}
                      onValueChange={(value) => setSelectedArticle({ ...selectedArticle, category: value })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Cloud">Cloud</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="AI">AI</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Analytics">Analytics</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Blockchain">Blockchain</SelectItem>
                        <SelectItem value="IoT">IoT</SelectItem>
                        <SelectItem value="QA">QA</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => generateArticleWithGemini(selectedArticle)}
                      isLoading={isGenerating}
                      className="whitespace-nowrap"
                    >
                      Generate Article
                    </Button>
                  </div>
                  
                  {/* Generated Content Preview */}
                  {generatedContent && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                      <h4 className="text-md font-semibold mb-2">Generated Content Preview</h4>
                      <div className="prose max-w-none">
                        {generatedContent.split('\n').map((line, index) => (
                          <p key={index} className="text-sm text-gray-700 whitespace-pre-wrap">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Blog Calendar */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Blog Calendar</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {blogCalendarData.filter(article => blogFilter === "all" || article.status === blogFilter).map(article => (
                      <div key={article.id} className="p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="text-md font-semibold">{article.title}</h4>
                            <div className="text-sm text-gray-500">
                              {article.keywords.join(', ')}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-blue-600">
                            {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                          <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1">
                            {article.category}
                          </span>
                          <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1">
                            {article.difficulty}
                          </span>
                          <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1">
                            {article.estimatedReadTime}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <div>
                            <span className="mr-2">Scheduled:</span>
                            <strong>{new Date(article.scheduledDate).toLocaleDateString()}</strong>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedArticle(article);
                                setGeneratedContent("");
                              }}
                              className="mr-2"
                            >
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}