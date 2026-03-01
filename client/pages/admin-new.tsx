// This is a partial update - focusing on the generateArticle function and content display
// The full file would be too large to include here

// NEW: State for articles list
const [articles, setArticles] = useState<any[]>([]);
const [articlesLoading, setArticlesLoading] = useState(false);

// NEW: Fetch articles on mount
useEffect(() => {
  fetchArticles();
}, []);

// NEW: Fetch articles function
const fetchArticles = async () => {
  setArticlesLoading(true);
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch('/api/content/articles', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles || []);
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error);
  } finally {
    setArticlesLoading(false);
  }
};

// UPDATED: Generate article using local API instead of Gemini
const generateArticleWithAI = async (articleData: any) => {
  setIsGenerating(true);
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch('/api/content/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: articleData.title,
        topicFocus: articleData.topicFocus,
        targetKeyword: articleData.targetKeyword,
        wordCount: parseInt(articleData.wordCount.replace(/[^\d]/g, '')) || 800,
        author: articleAuthor || "TechPartner Team"
      })
    });

    if (!res.ok) {
      throw new Error('Failed to generate article');
    }

    const data = await res.json();
    
    if (data.success) {
      setGeneratedContent(data.article.content);
      setArticleTitle(data.article.title);
      setArticleCategory(articleData.topicFocus);
      setTargetKeyword(data.article.targetKeyword);
      setTargetWordCount(data.article.wordCount);
      
      // Refresh articles list
      fetchArticles();
      
      toast({
        title: "Success",
        description: `Article generated! ${data.article.wordCount} words. Saved as draft.`,
      });
    } else {
      throw new Error(data.error || 'Generation failed');
    }
  } catch (error) {
    console.error('Error generating article:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to generate article. Check if Ollama is running.",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
};

// NEW: Publish article function
const publishArticle = async (slug: string, platform: string = 'wordpress') => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`/api/content/publish/${slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ platform })
    });

    if (res.ok) {
      const data = await res.json();
      toast({
        title: "Published!",
        description: `Article published to ${platform}. URL: ${data.url}`,
      });
      fetchArticles();
    } else {
      throw new Error('Publish failed');
    }
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to publish article.",
      variant: "destructive",
    });
  }
};

// NEW: Articles list component to add to the Blog Management Tab
const ArticlesList = () => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Generated Articles</span>
        <Badge variant="outline">{articles.length} total</Badge>
      </CardTitle>
      <CardDescription>All AI-generated and manually created articles</CardDescription>
    </CardHeader>
    <CardContent>
      {articlesLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin" />
          <p className="mt-2 text-sm text-gray-500">Loading articles...</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2">No articles generated yet</p>
          <p className="text-sm">Click "Generate This Article" from the content calendar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{article.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {article.status}
                    </Badge>
                    <Badge variant="outline" className="text-blue-600">
                      {article.wordCount} words
                    </Badge>
                    <Badge variant="outline" className="text-green-600">
                      {article.source}
                    </Badge>
                    <span className="text-gray-400">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {article.targetKeyword && (
                    <p className="text-xs text-gray-500 mt-1">
                      Keyword: {article.targetKeyword}
                    </p>
                  )}
                  {article.url && (
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 block"
                    >
                      {article.url}
                    </a>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {article.status === 'draft' && (
                    <Button 
                      size="sm" 
                      onClick={() => publishArticle(article.slug)}
                    >
                      <Upload className="mr-1" size={14} />
                      Publish
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedArticle(article);
                      setGeneratedContent(article.content);
                      setArticleTitle(article.title);
                    }}
                  >
                    <Eye className="mr-1" size={14} />
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
