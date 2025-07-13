# Blog Management with Gemini AI Integration

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 2. Configure the API Key
In the admin page (`/client/src/pages/admin.tsx`), find line ~288 and replace `"YOUR_GEMINI_API_KEY"` with your actual API key:

```typescript
const GEMINI_API_KEY = "your_actual_api_key_here";
```

**Important Security Note:** For production, store the API key in environment variables or a secure config file, not directly in the code.

### 3. Features Available

#### AI Article Generation
- **Custom Generation**: Manually input article details and generate content
- **Calendar-Based Generation**: Generate articles directly from the content calendar
- **Smart Prompting**: AI considers Saudi Arabia context and business audience
- **SEO Optimization**: Integrates target keywords naturally

#### Content Calendar
The system includes a pre-loaded content calendar with 12 articles covering:
- Cloud services in Saudi Arabia
- Managed IT services
- Cybersecurity solutions
- Digital transformation & Vision 2030
- SMB IT challenges
- Disaster recovery planning
- AI in IT infrastructure
- Compliance requirements

#### Generated Content Management
- **Preview**: Full article preview with word count
- **Save**: Save articles for future use
- **Copy**: Copy content to clipboard
- **Clear**: Reset the generator

#### Analytics Dashboard
- Total articles in calendar
- Generated articles count
- Average word count
- Unique topic categories

### 4. How to Use

1. **Navigate to Admin**: Go to `/admin` and click the "Blog Management" tab
2. **Generate from Calendar**: Click "Generate This Article" on any calendar item
3. **Custom Generation**: Fill in the custom form fields and click "Generate Article with AI"
4. **Review & Save**: Preview the generated content, make edits if needed, then save or copy

### 5. Article Structure
Generated articles include:
- Engaging introduction
- Clear headings and subheadings
- Saudi Arabia context and local insights
- Practical advice and actionable tips
- SEO-optimized content with target keywords
- Professional business tone
- Strong conclusion with key takeaways

### 6. Content Calendar Data
The calendar includes articles optimized for:
- **Cloud Services**: Migration, backup, platform comparisons
- **IT Management**: Monitoring, support, managed services
- **Cybersecurity**: Compliance, SOC services, provider selection
- **Digital Transformation**: Vision 2030 alignment, AI integration
- **Business Continuity**: Disaster recovery, planning strategies

### 7. API Integration Details
- **Provider**: Google Gemini AI
- **Model**: gemini-pro
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Method**: POST with JSON payload
- **Response**: Structured content with candidates array

### 8. Error Handling
The system includes:
- API key validation
- Network error handling
- Content generation failure recovery
- User feedback via toast notifications

### 9. Future Enhancements
Consider adding:
- Database integration for saved articles
- Scheduled publishing
- Multi-language support
- Advanced SEO analysis
- Social media integration
- Performance analytics
