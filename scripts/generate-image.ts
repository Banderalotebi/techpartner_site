// scripts/generate-image.ts
// Open-Source Image Generation using Qwen 2.5 (Local) + Stable Diffusion XL (Hugging Face)
// This generates featured images for blog posts automatically

import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

const HF_API_TOKEN = process.env.HF_API_TOKEN!;
const OLLAMA_URL = 'http://localhost:11434/api/generate';

// 1. Qwen 7B writes the prompt (Running locally on your EC2)
async function writeImagePrompt(articleTitle: string): Promise<string> {
    console.log(`🧠 Asking Qwen to design an image for: "${articleTitle}"`);
    
    const prompt = `
    Write a highly detailed, cinematic prompt for a blog featured image titled: "${articleTitle}".
    The style should be flat vector art, isometric, modern tech startup, corporate blue and cyan colors.
    No text in the image. Under 40 words.
    `;

    const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: "qwen2.5:7b", prompt: prompt, stream: false })
    });

    const data = await response.json() as { response: string };
    return data.response.trim();
}

// 2. Hugging Face generates the image using Open-Source Stable Diffusion XL
export async function generateArticleImage(articleTitle: string, slug: string) {
    try {
        const imagePrompt = await writeImagePrompt(articleTitle);
        console.log(`🎨 Sending to Hugging Face (SDXL): "${imagePrompt}"`);

        // Calling the free open-source model hosted on Hugging Face
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${HF_API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: imagePrompt,
                    parameters: {
                        negative_prompt: "text, words, letters, ugly, blurry, deformed",
                        guidance_scale: 7.5,
                    }
                }),
            }
        );

        if (!response.ok) {
            throw new Error(`Hugging Face Error: ${await response.text()}`);
        }

        // 3. Save the image as a highly compressed WebP for Core Web Vitals
        const imagesDir = path.join(__dirname, '../pseo-engine/public/images');
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, { recursive: true });
        }
        
        const imagePath = path.join(imagesDir, `${slug}.webp`);
        const imageBuffer = await response.arrayBuffer();
        
        fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
        console.log(`✅ Featured Image saved successfully: /images/${slug}.webp`);
        
        return `/images/${slug}.webp`;

    } catch (error) {
        console.error("Open-Source Image Generation Failed:", error);
        return null; 
    }
}

// 4. Batch generate images for all campaigns
export async function generateAllCampaignImages() {
    const campaigns = [
        { slug: "riyadh", title: "Elite SaaS & Web Design in Riyadh" },
        { slug: "jeddah", title: "Elite SaaS & Web Design in Jeddah" },
        { slug: "dammam", title: "Elite SaaS & Web Design in Dammam" },
        { slug: "makkah", title: "Elite SaaS & Web Design in Makkah" },
        { slug: "madinah", title: "Elite SaaS & Web Design in Madinah" },
        { slug: "khobar", title: "Elite SaaS & Web Design in Khobar" },
        { slug: "tabuk", title: "Elite SaaS & Web Design in Tabuk" },
        { slug: "abha", title: "Elite SaaS & Web Design in Abha" },
    ];

    console.log("🚀 Starting batch image generation for all campaigns...\n");
    
    for (const campaign of campaigns) {
        console.log(`\n📸 Generating image for ${campaign.slug}...`);
        await generateArticleImage(campaign.title, campaign.slug);
        // Add delay to avoid rate limiting on Hugging Face free tier
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log("\n✨ All campaign images generated successfully!");
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const command = process.argv[2];
    
    if (command === 'batch') {
        generateAllCampaignImages();
    } else if (command === 'single' && process.argv[3] && process.argv[4]) {
        generateArticleImage(process.argv[3], process.argv[4]);
    } else {
        console.log(`
Usage:
  npx tsx scripts/generate-image.ts batch
  npx tsx scripts/generate-image.ts single "Article Title" article-slug

Examples:
  npx tsx scripts/generate-image.ts batch
  npx tsx scripts/generate-image.ts single "How to Build a SaaS" saas-guide
        `);
    }
}

export { writeImagePrompt };
