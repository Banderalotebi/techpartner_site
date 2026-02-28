import fs from 'fs/promises';
import path from 'path';

// Point this to your local Ollama instance
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";
const AI_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b"; // Change to llama3.2:3b if using that instead

const targetLangCode = process.argv[2]; // e.g., 'ar', 'fr'
const targetLangName = process.argv[3]; // e.g., 'Arabic', 'French'

if (!targetLangCode || !targetLangName) {
  console.error("Usage: node scripts/translate-locales.js <code (e.g., ar)> <name (e.g., Arabic)>");
  console.error("Example: node scripts/translate-locales.js ar Arabic");
  console.error("Example: node scripts/translate-locales.js fr French");
  process.exit(1);
}

// Ensure locales directory exists
const localesDir = path.resolve('client/i18n/locales');

async function ensureLocalesDir() {
  try {
    await fs.access(localesDir);
  } catch {
    await fs.mkdir(localesDir, { recursive: true });
  }
}

async function translateFile() {
  try {
    await ensureLocalesDir();
    
    const enPath = path.resolve('client/i18n/locales/en.json');
    const targetPath = path.resolve(`client/i18n/locales/${targetLangCode}.json`);

    let enData;
    
    // Try to read en.json, if it doesn't exist, create it from default translations
    try {
      enData = await fs.readFile(enPath, 'utf-8');
    } catch {
      console.log("en.json not found. Creating from default translations...");
      // Create en.json from embedded defaults
      const defaultEn = {
        "nav.home": "Home",
        "nav.about": "About",
        "nav.services": "Services",
        "nav.portfolio": "Portfolio",
        "nav.blog": "Blog",
        "nav.contact": "Contact",
        "nav.dashboard": "Dashboard",
        "nav.categories": "Categories",
        "nav.ai-studio": "AI Studio",
        "footer.rights": "All rights reserved",
        "footer.company": "TechPartner",
        "language.switch": "Switch Language",
        "loading": "Loading...",
        "error": "Error",
        "success": "Success",
        "hero.title": "Design personalized to fit your needs perfectly.",
        "hero.subtitle": "Get custom designs that perfectly match your vision.",
        "hero.cta.primary": "Start Your Project",
        "hero.cta.secondary": "View Portfolio",
        "services.title": "Our Design and Development",
        "services.subtitle": "Professional design and development solutions",
        "service.logo.title": "Logo & branding design",
        "service.logo.description": "Create a memorable brand identity",
        "service.web.title": "Website & app design",
        "service.web.description": "Modern, responsive designs for digital experiences",
        "service.business.title": "Business & advertising",
        "service.business.description": "Professional marketing materials that convert",
        "service.art.title": "Art & illustration",
        "service.art.description": "Custom artwork and illustrations",
        "service.packaging.title": "Packaging & label",
        "service.packaging.description": "Product packaging that attracts and sells",
        "service.development.title": "Custom web & apps development",
        "service.development.description": "Professional custom development using modern full stack solutions",
        "development.title": "Custom Web Development",
        "development.subtitle": "Professional full-stack development solutions using modern technologies.",
        "development.feature1": "Custom UI/UX Design",
        "development.feature2": "Full-Stack Development",
        "development.feature3": "CMS Integration & Backend",
        "development.feature4": "8-Step Technical Assessment",
        "development.cta": "Start Development Project",
        "development.pricing": "Starting from",
        "development.price": "25,000 SAR",
        "business.title.part1": "Your business",
        "business.title.part2": "exceptional design",
        "business.description": "Our trusted designer community specializes in logos, websites, packaging design, and more.",
        "business.feature1": "Expert designers with proven track records",
        "business.feature2": "Custom solutions tailored to your brand",
        "business.feature3": "Fast turnaround with unlimited revisions",
        "business.cta": "Start Your Brand",
        "logo.main.title": "Everything begins with a logo.",
        "logo.main.subtitle": "Whether you're starting fresh or refining your brand, our solutions are tailored to suit your business.",
        "logo.ai.title": "Try Our AI Logo Maker",
        "logo.ai.description": "Easily craft your unique logo in just minutes with our intuitive, AI-powered tool.",
        "logo.ai.cta": "Create a logo, it's free",
        "logo.contest.title": "Start a logo contest.",
        "logo.contest.description": "Elevate your branding journey with custom logo options from our talented community.",
        "logo.contest.pricing": "Logos from SAR1500",
        "portfolio.title": "Portfolio Highlights",
        "portfolio.subtitle": "See the exceptional work we've delivered for clients",
        "testimonials.title": "What Our Clients Say",
        "testimonials.subtitle": "Real feedback from satisfied customers",
        "team.badge": "Expert Development Team",
        "team.title": "Meet Your TechPartner Experts",
        "team.description": "Our skilled developers and designers bring years of experience in creating cutting-edge digital solutions.",
        "auth.login": "Login",
        "auth.logout": "Logout",
        "auth.register": "Register",
        "auth.email": "Email",
        "auth.password": "Password",
        "auth.forgotPassword": "Forgot Password?",
        "auth.noAccount": "Don't have an account?",
        "auth.hasAccount": "Already have an account?",
        "profile.edit": "Edit Profile",
        "profile.save": "Save Changes",
        "profile.cancel": "Cancel",
        "profile.firstName": "First Name",
        "profile.lastName": "Last Name",
        "profile.phone": "Phone",
        "profile.address": "Address",
        "orders.title": "My Orders",
        "orders.history": "Order History",
        "orders.noOrders": "No orders yet",
        "orders.status.pending": "Pending",
        "orders.status.completed": "Completed",
        "orders.status.cancelled": "Cancelled",
        "stats.projects": "Projects Delivered",
        "stats.clients": "Happy Clients",
        "stats.rating": "Satisfaction Rate",
        "cta.title": "Ready to bring your vision to life?",
        "cta.subtitle": "Join thousands of satisfied clients who've transformed their brands with our design services.",
        "cta.button": "Get Started Today"
      };
      
      enData = JSON.stringify(defaultEn, null, 2);
      await fs.writeFile(enPath, enData + '\n');
      console.log("Created en.json with default translations");
    }
    
    console.log(`Reading en.json and sending to local AI (${AI_MODEL})...`);
    console.log(`Translating to ${targetLangName}. This might take a minute on a CPU...`);

    const prompt = `
You are a highly skilled JSON translation API. 
Translate the values of this JSON object from English to ${targetLangName}.
CRITICAL RULES:
1. ONLY translate the VALUES. Do NOT translate the KEYS.
2. Maintain all formatting variables like {{name}} or {{count}}.
3. Maintain the exact same JSON structure.
4. Output ONLY valid JSON, no explanations or markdown.

JSON to translate:
${enData}
`;

    // Call the local Ollama AI
    console.log(`\n🤖 Calling Ollama at ${OLLAMA_URL}...`);
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: AI_MODEL,
        prompt: prompt,
        format: "json", // This forces Ollama to output STRICT JSON
        stream: false,
        options: {
          temperature: 0.3 // Low temperature for more consistent translations
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API failed: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    const targetText = result.response;

    // Parse and save the translated file
    const targetJson = JSON.parse(targetText);
    const formatted = JSON.stringify(targetJson, null, 2);
    await fs.writeFile(targetPath, formatted + '\n');

    console.log(`\n✅ Success! ${targetLangCode}.json created for ${targetLangName}.`);
    console.log(`📁 Saved to: ${targetPath}`);
    console.log(`📝 Translation keys: ${Object.keys(targetJson).length}`);

  } catch (error) {
    console.error("\n❌ Translation Error:", error.message || error);
    console.error("\nTroubleshooting tips:");
    console.error("1. Make sure Ollama is running: ollama serve");
    console.error("2. Make sure the model is installed: ollama pull qwen2.5:7b");
    console.error("3. Check the OLLAMA_URL in the script matches your setup");
    process.exit(1);
  }
}

translateFile();

