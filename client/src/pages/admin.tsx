import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Activity,
  PenTool,
  BookOpen,
  Wand2,
  Upload,
  Save,
  Copy
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

  // Blog management states
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleCategory, setArticleCategory] = useState("");
  const [articleTags, setArticleTags] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");
  const [targetWordCount, setTargetWordCount] = useState(800);
  const [targetKeyword, setTargetKeyword] = useState("");

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

  // Blog calendar data from CSV
  const blogCalendarData = [
    { time: "10:00 AM", title: "Why Saudi Businesses Are Migrating to Cloud in 2025", topicFocus: "Cloud adoption trends in KSA", targetKeyword: "cloud services Saudi Arabia", wordCount: "800–1000" },
    { time: "2:00 PM", title: "Managed IT Services: A Smart Investment for Growing Companies", topicFocus: "Business case for managed IT", targetKeyword: "managed IT services Saudi Arabia", wordCount: "800" },
    { time: "6:00 PM", title: "How to Choose the Right Cybersecurity Provider in Saudi Arabia", topicFocus: "Cybersecurity service selection", targetKeyword: "cybersecurity solutions KSA", wordCount: "850" },
    { time: "10:00 PM", title: "The Role of Digital Transformation in Vision 2030", topicFocus: "National initiatives & tech", targetKeyword: "digital transformation Saudi Arabia", wordCount: "900" },
    { time: "2:00 AM", title: "Top 5 IT Challenges Facing SMBs in Saudi Arabia (and How to Solve Them)", topicFocus: "Pain points & solutions", targetKeyword: "IT support for SMBs Saudi Arabia", wordCount: "800" },
    { time: "10:00 AM", title: "What is Cloud Backup and Why Does Your Business Need It?", topicFocus: "Data protection & continuity", targetKeyword: "cloud backup services Saudi Arabia", wordCount: "850" },
    { time: "2:00 PM", title: "Explained: SOC-as-a-Service for Saudi Enterprises", topicFocus: "Cybersecurity infrastructure", targetKeyword: "SOC as a service Saudi Arabia", wordCount: "800" },
    { time: "6:00 PM", title: "Microsoft Azure vs. AWS: Which Cloud Platform is Right for Saudi Businesses?", topicFocus: "Comparison article", targetKeyword: "Azure vs AWS Saudi Arabia", wordCount: "1000" },
    { time: "10:00 AM", title: "Disaster Recovery Planning for Saudi Companies in 2025", topicFocus: "Business continuity", targetKeyword: "disaster recovery Saudi Arabia", wordCount: "900" },
    { time: "2:00 PM", title: "Why Your Business Needs Proactive IT Monitoring", topicFocus: "Remote monitoring benefits", targetKeyword: "IT monitoring services Saudi Arabia", wordCount: "850" },
    { time: "6:00 PM", title: "The Future of AI in Saudi IT Infrastructure", topicFocus: "AI integration & outlook", targetKeyword: "AI IT services Saudi Arabia", wordCount: "900" },
    { time: "10:00 PM", title: "Cybersecurity Compliance in Saudi Arabia: What You Need to Know", topicFocus: "Regulations & standards", targetKeyword: "cybersecurity compliance Saudi Arabia", wordCount: "950" }
  ];

  // Function to generate article using Gemini API
  const generateArticleWithGemini = async (articleData: any) => {
    setIsGenerating(true);
    try {
      // You'll need to replace this with your actual Gemini API key
      const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
      
      const prompt = `Write a comprehensive blog article with the following specifications:

Title: ${articleData.title}
Topic Focus: ${articleData.topicFocus}
Target Keyword: ${articleData.targetKeyword}
Word Count: ${articleData.wordCount} words
Target Audience: Saudi Arabian businesses and IT decision makers

Please create a well-structured article that includes:
1. An engaging introduction that establishes the importance of the topic
2. Clear headings and subheadings for better readability
3. Practical insights and actionable advice
4. Local context relevant to Saudi Arabia and the region
5. A strong conclusion with key takeaways
6. Natural integration of the target keyword throughout the content
7. Professional tone suitable for business executives and IT professionals

The article should be informative, authoritative, and provide real value to readers while being optimized for SEO with the target keyword "${articleData.targetKeyword}".`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      setGeneratedContent(generatedText);
      setArticleTitle(articleData.title);
      setArticleCategory(articleData.topicFocus);
      setTargetKeyword(articleData.targetKeyword);
      setTargetWordCount(parseInt(articleData.wordCount.replace(/[^\d]/g, '')));
      
      toast({
        title: "Success",
        description: "Article generated successfully!",
      });
    } catch (error) {
      console.error('Error generating article:', error);
      toast({
        title: "Error",
        description: "Failed to generate article. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save article (you can extend this to save to database)
  const saveArticle = async () => {
    try {
      // Here you would typically save to your database
      // For now, we'll just show a success message
      const articleData = {
        title: articleTitle,
        content: generatedContent,
        category: articleCategory,
        tags: articleTags.split(',').map(tag => tag.trim()),
        author: articleAuthor || "TechPartner Team",
        targetKeyword: targetKeyword,
        wordCount: generatedContent.split(' ').length,
        createdAt: new Date().toISOString()
      };

      console.log('Article to save:', articleData);
      
      toast({
        title: "Success",
        description: "Article saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article.",
        variant: "destructive",
      });
    }
  };

  // Function to copy content to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Content copied to clipboard!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      });
    }
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Article Generation Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PenTool className="mr-2" size={20} />
                    AI Article Generator
                  </CardTitle>
                  <CardDescription>Generate high-quality blog articles using Gemini AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Manual Article Generation */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Custom Article Generation</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <Input
                        placeholder="Article Title"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                      />
                      <Input
                        placeholder="Topic Focus"
                        value={articleCategory}
                        onChange={(e) => setArticleCategory(e.target.value)}
                      />
                      <Input
                        placeholder="Target Keyword"
                        value={targetKeyword}
                        onChange={(e) => setTargetKeyword(e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Word Count"
                          type="number"
                          value={targetWordCount}
                          onChange={(e) => setTargetWordCount(Number(e.target.value))}
                        />
                        <Input
                          placeholder="Author"
                          value={articleAuthor}
                          onChange={(e) => setArticleAuthor(e.target.value)}
                        />
                      </div>
                      <Textarea
                        placeholder="Article Tags (comma separated)"
                        value={articleTags}
                        onChange={(e) => setArticleTags(e.target.value)}
                        rows={2}
                      />
                      <Button
                        onClick={() => generateArticleWithGemini({
                          title: articleTitle,
                          topicFocus: articleCategory,
                          targetKeyword: targetKeyword,
                          wordCount: `${targetWordCount}`,
                        })}
                        disabled={isGenerating || !articleTitle || !articleCategory}
                        className="w-full"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2" size={16} />
                            Generate Article with AI
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Generated Content Preview */}
                  {generatedContent && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">Generated Article</h4>
                        <Badge variant="outline" className="text-green-600">
                          {generatedContent.split(' ').length} words
                        </Badge>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {generatedContent}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={saveArticle} size="sm">
                          <Save className="mr-2" size={14} />
                          Save Article
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(generatedContent)}
                          size="sm"
                        >
                          <Copy className="mr-2" size={14} />
                          Copy Content
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setGeneratedContent("")}
                          size="sm"
                        >
                          <Trash2 className="mr-2" size={14} />
                          Clear
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Blog Calendar Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2" size={20} />
                    Content Calendar
                  </CardTitle>
                  <CardDescription>Planned articles from your content strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {blogCalendarData.map((article, index) => (
                      <div key={index} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 text-sm leading-tight mb-1">
                              {article.title}
                            </h5>
                            <div className="text-xs text-gray-600 mb-2">
                              <span className="font-medium">Topic:</span> {article.topicFocus}
                            </div>
                            <div className="flex flex-wrap gap-1 text-xs">
                              <Badge variant="outline" className="text-blue-600">
                                {article.targetKeyword}
                              </Badge>
                              <Badge variant="outline" className="text-green-600">
                                {article.wordCount} words
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 ml-2">
                            {article.time}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateArticleWithGemini(article)}
                          disabled={isGenerating}
                          className="w-full mt-2"
                        >
                          <Wand2 className="mr-2" size={14} />
                          Generate This Article
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blog Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2" size={20} />
                  Blog Analytics & Management
                </CardTitle>
                <CardDescription>Track performance and manage your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-blue-600">Total Articles</div>
                    <div className="text-2xl font-bold text-blue-900">{blogCalendarData.length}</div>
                    <div className="text-xs text-blue-600">In content calendar</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Generated</div>
                    <div className="text-2xl font-bold text-green-900">
                      {generatedContent ? 1 : 0}
                    </div>
                    <div className="text-xs text-green-600">Ready to publish</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-purple-600">Avg. Word Count</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {Math.round(blogCalendarData.reduce((sum, article) => 
                        sum + parseInt(article.wordCount.replace(/[^\d]/g, '')), 0) / blogCalendarData.length)}
                    </div>
                    <div className="text-xs text-purple-600">Words per article</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-orange-600">Categories</div>
                    <div className="text-2xl font-bold text-orange-900">
                      {new Set(blogCalendarData.map(article => article.topicFocus)).size}
                    </div>
                    <div className="text-xs text-orange-600">Unique topics</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2" size={14} />
                      Export Calendar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2" size={14} />
                      Import Articles
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart3 className="mr-2" size={14} />
                      View Analytics
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="mr-2" size={14} />
                      Schedule Posts
                    </Button>
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