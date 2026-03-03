// type ExtractedData = z.infer<typeof ExtractedDataSchema>;
interface ExtractedData {
  domain: string;
  email: string;
  phone: string;
  address: string;
}

// async function generateWithOllama(prompt: string): Promise<GeneratedContent> {
//   const response = await fetch(OLLAMA_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: "qwen2.5:7b",
//       prompt: prompt,
//       stream: false,
//       format: "json"
//     })
//   });
//   const data = await response.json();
//   return data;
// }

// async function generatePages() {
//   console.log("🚀 Starting Programmatic SEO Generator...");
//   console.log(`📍 Cities: ${CITIES.join(", ")}`);
//   console.log(`🏢 Industries: ${INDUSTRIES.join(", ")}`);
//   console.log(`🔧 Services: ${SERVICES.join(", ")}`);
//   ...
// Added new function to extract data
function extractData(): ExtractedData {
  const data = {
    domain: "example.com",
    email: "example@example.com",
    phone: "123-456-7890",
    address: "123 Main St, Anytown, USA"
  };
  return data;
}
