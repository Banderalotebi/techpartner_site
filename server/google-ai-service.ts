import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI Studio (Gemini) client
// Note: You'll need to get your API key from https://makersuite.google.com/app/apikey
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || 'YOUR_GEMINI_API_KEY');

export interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface CodeGenerationRequest {
  description: string;
  language: string;
  framework?: string;
  requirements?: string[];
}

export interface ContentGenerationRequest {
  topic: string;
  type: 'blog-post' | 'product-description' | 'marketing-copy' | 'social-media';
  tone?: 'professional' | 'casual' | 'technical' | 'creative';
  language?: 'en' | 'ar';
  length?: 'short' | 'medium' | 'long';
}

export class GoogleAIService {
  private static instance: GoogleAIService;

  private constructor() {}

  public static getInstance(): GoogleAIService {
    if (!GoogleAIService.instance) {
      GoogleAIService.instance = new GoogleAIService();
    }
    return GoogleAIService.instance;
  }

  /**
   * Generate content using Gemini Pro
   */
  async generateContent(request: AIRequest): Promise<AIResponse> {
    try {
      const model = genAI.getGenerativeModel({ 
        model: request.model || 'gemini-1.5-flash',
        generationConfig: {
          maxOutputTokens: request.maxTokens || 2048,
          temperature: request.temperature || 0.7,
        }
      });

      const result = await model.generateContent(request.prompt);
      const response = await result.response;
      const content = response.text();

      return {
        content,
        model: request.model || 'gemini-1.5-flash',
        usage: {
          promptTokens: 0, // Gemini doesn't provide token counts in the same way
          completionTokens: 0,
          totalTokens: 0,
        }
      };
    } catch (error: any) {
      console.error('AI content generation error:', error);
      throw new Error(`AI content generation failed: ${error.message}`);
    }
  }

  /**
   * Generate code based on requirements
   */
  async generateCode(request: CodeGenerationRequest): Promise<string> {
    const prompt = `
Generate ${request.language} code based on the following requirements:

Description: ${request.description}
${request.framework ? `Framework: ${request.framework}` : ''}
${request.requirements ? `Requirements:\n${request.requirements.map(req => `- ${req}`).join('\n')}` : ''}

Please provide clean, well-documented, and production-ready code. Include comments explaining key parts of the implementation.
`;

    const response = await this.generateContent({ prompt });
    return response.content;
  }

  /**
   * Generate marketing content
   */
  async generateMarketingContent(request: ContentGenerationRequest): Promise<string> {
    const lengthMap = {
      short: '100-200 words',
      medium: '300-500 words',
      long: '800-1200 words'
    };

    const prompt = `
Create ${request.type} content about "${request.topic}".

Requirements:
- Tone: ${request.tone || 'professional'}
- Language: ${request.language || 'en'}
- Length: ${lengthMap[request.length || 'medium']}
- Target audience: Technology services and digital solutions
- Company context: TechPartner - A leading technology solutions provider

${request.type === 'blog-post' ? 'Include a compelling title, introduction, main content with subheadings, and conclusion.' : ''}
${request.type === 'product-description' ? 'Focus on benefits, features, and value proposition.' : ''}
${request.type === 'marketing-copy' ? 'Include a strong call-to-action and emphasize unique selling points.' : ''}
${request.type === 'social-media' ? 'Make it engaging, shareable, and include relevant hashtags.' : ''}

Make sure the content is original, engaging, and optimized for conversion.
`;

    const response = await this.generateContent({ prompt });
    return response.content;
  }

  /**
   * Enhance existing content with AI
   */
  async enhanceContent(content: string, instructions: string): Promise<string> {
    const prompt = `
Please enhance the following content based on these instructions: ${instructions}

Original content:
${content}

Enhanced content:
`;

    const response = await this.generateContent({ prompt });
    return response.content;
  }

  /**
   * Generate SEO-optimized content
   */
  async generateSEOContent(topic: string, keywords: string[], language: 'en' | 'ar' = 'en'): Promise<{
    title: string;
    description: string;
    content: string;
    keywords: string[];
  }> {
    const prompt = `
Generate SEO-optimized content for the topic "${topic}" in ${language}.

Target keywords: ${keywords.join(', ')}

Please provide:
1. An SEO-optimized title (50-60 characters)
2. A meta description (150-160 characters)
3. Main content (500-800 words) that naturally incorporates the keywords
4. Additional related keywords that could be used

Format the response as JSON with the following structure:
{
  "title": "...",
  "description": "...",
  "content": "...",
  "keywords": ["..."]
}
`;

    const response = await this.generateContent({ prompt });
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        title: topic,
        description: response.content.substring(0, 160),
        content: response.content,
        keywords: keywords
      };
    }
  }

  /**
   * Generate project requirements and specifications
   */
  async generateProjectSpec(description: string, projectType: string): Promise<{
    requirements: string[];
    timeline: string;
    technologies: string[];
    deliverables: string[];
  }> {
    const prompt = `
Based on the following project description, generate a comprehensive project specification:

Project Type: ${projectType}
Description: ${description}

Please provide:
1. Detailed functional requirements (list format)
2. Estimated timeline with milestones
3. Recommended technologies and tools
4. Key deliverables and phases

Format the response as JSON with the following structure:
{
  "requirements": ["..."],
  "timeline": "...",
  "technologies": ["..."],
  "deliverables": ["..."]
}
`;

    const response = await this.generateContent({ prompt });
    
    try {
      return JSON.parse(response.content);
    } catch (error) {
      // Fallback if JSON parsing fails
      return {
        requirements: [description],
        timeline: "8-12 weeks",
        technologies: ["React", "Node.js", "TypeScript"],
        deliverables: ["Web Application", "Documentation", "Testing"]
      };
    }
  }

  /**
   * Chat with AI for technical support
   */
  async chatWithAI(message: string, context?: string): Promise<string> {
    const prompt = `
${context ? `Context: ${context}\n\n` : ''}
User: ${message}

Please provide a helpful, technical, and accurate response. If this is about web development, design, or technology services, provide practical advice and solutions.
`;

    const response = await this.generateContent({ prompt });
    return response.content;
  }
}

export const googleAIService = GoogleAIService.getInstance();
