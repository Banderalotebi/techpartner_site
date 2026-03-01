// server/aws-secrets.ts - AWS Secrets Manager Integration
// Fetches environment variables from AWS Secrets Manager in production
// Falls back to local .env file in development

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv";

// Load secrets from AWS Secrets Manager (production) or .env file (development)
// This function MUST be called and awaited BEFORE any other imports that use process.env
export async function loadSecrets(): Promise<void> {
  const nodeEnv = process.env.NODE_ENV || "development";
  
  // In development, use local .env file
  if (nodeEnv === "development") {
    console.log("🔧 [Secrets] Development mode - loading from .env file");
    dotenv.config();
    console.log("✅ [Secrets] Environment variables loaded from .env");
    return;
  }
  
  // In production, fetch from AWS Secrets Manager
  console.log("🔐 [Secrets] Production mode - fetching from AWS Secrets Manager");
  
  const secretName = process.env.AWS_SECRET_NAME || "prod/techpartner/env";
  const region = process.env.AWS_REGION || "us-east-1";
  
  try {
    // Initialize Secrets Manager client
    // IMPORTANT: No credentials passed - relies on EC2 IAM Role
    const client = new SecretsManagerClient({
      region,
      // No credentials property - will use IAM Role attached to EC2 instance
    });
    
    console.log(`🔐 [Secrets] Fetching secret: ${secretName} from region: ${region}`);
    
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });
    
    const response = await client.send(command);
    
    if (!response.SecretString) {
      throw new Error("SecretString is empty - secret may be binary or missing");
    }
    
    // Parse the JSON secret
    const secrets = JSON.parse(response.SecretString);
    
    // Inject all secrets into process.env
    // This ensures all existing code that reads process.env works without changes
    let injectedCount = 0;
    for (const [key, value] of Object.entries(secrets)) {
      if (typeof value === "string") {
        process.env[key] = value;
        injectedCount++;
      }
    }
    
    console.log(`✅ [Secrets] Successfully loaded ${injectedCount} environment variables from AWS Secrets Manager`);
    
    // Verify critical variables are present
    const requiredVars = ["DATABASE_URL", "ADMIN_SECRET"];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`⚠️  [Secrets] Missing critical variables: ${missingVars.join(", ")}`);
    } else {
      console.log("✅ [Secrets] All critical environment variables verified");
    }
    
  } catch (error) {
    console.error("❌ [Secrets] CRITICAL ERROR: Failed to load secrets from AWS Secrets Manager");
    
    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
      
      // Provide helpful error messages for common issues
      if (error.message.includes("Credentials")) {
        console.error("   → Check that the EC2 instance has an IAM Role attached with secretsmanager:GetSecretValue permission");
      }
      if (error.message.includes("ResourceNotFoundException")) {
        console.error(`   → Secret "${secretName}" not found. Verify the secret name in AWS Console.`);
      }
      if (error.message.includes("AccessDenied")) {
        console.error("   → IAM Role does not have permission to read this secret. Check IAM policy.");
      }
    }
    
    // Critical failure - exit the process
    // This prevents the app from starting with missing configuration
    console.error("❌ [Secrets] Exiting process due to failed secret loading");
    process.exit(1);
  }
}

// Verify that required environment variables are present
// Call this after loadSecrets() to validate configuration
export function verifyRequiredEnvVars(requiredVars: string[]): boolean {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`❌ [Secrets] Missing required environment variables: ${missing.join(", ")}`);
    return false;
  }
  
  console.log(`✅ [Secrets] All ${requiredVars.length} required variables present`);
  return true;
}
