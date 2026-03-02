#!/usr/bin/env tsx
/**
 * PHASE 3: Listmonk Template Registration
 * Registers the TP_Master_Audit_V1 template with dynamic merge tags
 */

import { execSync } from 'child_process';

const LISTMONK_HOST = process.env.LISTMONK_HOST || 'http://localhost:8000';
const LISTMONK_USER = process.env.LISTMONK_USER || 'admin';
const LISTMONK_PASS = process.env.LISTMONK_PASS || 'admin';

// HTML Email Template with merge tags for dynamic content
const EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>{{ .Context.subject_line }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        html, body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; }
        .primary-btn { background-color: #0033cc; color: #ffffff; border-radius: 12px; padding: 20px 40px; text-decoration: none; display: inline-block; font-weight: 900; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100%; border-radius: 0; }
            .content-padding { padding: 30px 20px; }
        }
    </style>
</head>
<body style="margin: 0; padding: 20px 0; background-color: #f8fafc;">
    <center style="width: 100%; background-color: #f8fafc;">
        <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; opacity: 0; overflow: hidden;">
            {{ .Context.personalized_audit_en }}
        </div>

        <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container">
            <!-- Branding Header -->
            <tr>
                <td style="padding: 30px; text-align: left; background-color: #ffffff;">
                    <table width="100%" role="presentation">
                        <tr>
                            <td>
                                <span style="font-size: 24px; font-weight: 900; color: #0033cc; letter-spacing: -1px;">TECH<span style="color: #1e293b;">partner</span></span>
                            </td>
                            <td style="text-align: right;">
                                <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Digital Audit 2026</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Scene 1: The Problem -->
            <tr>
                <td>
                    <img src="https://techpartner.sa/email-images/techpartner-hero.png" width="600" alt="TechPartner Hero" style="width: 100%; height: auto;">
                </td>
            </tr>

            <!-- Dynamic Content Block 1 -->
            <tr>
                <td class="content-padding" style="padding: 40px 40px 20px;">
                    <h1 style="margin: 0 0 20px; font-size: 28px; line-height: 36px; color: #0f172a; font-weight: 900;">
                        Building a website shouldn't feel like a puzzle. 🧩
                    </h1>
                    <!-- DYNAMIC ENGLISH CONTENT -->
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 26px; color: #475569;">
                        {{ .Context.personalized_audit_en }}
                    </p>
                    
                    <!-- DYNAMIC ARABIC CONTENT -->
                    <div dir="rtl" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
                        <h2 style="margin: 0 0 15px; font-size: 24px; color: #0033cc; font-weight: 700;">
                            نطاقك الجديد يستحق بداية مثالية.
                        </h2>
                        <p style="margin: 0; font-size: 17px; line-height: 28px; color: #475569;">
                            {{ .Context.personalized_audit_ar }}
                        </p>
                    </div>
                </td>
            </tr>

            <!-- Scene 2: The Success -->
            <tr>
                <td style="padding-top: 20px;">
                    <img src="https://techpartner.sa/email-images/techpartner-hereo.png" width="600" alt="Success" style="width: 100%; height: auto;">
                </td>
            </tr>

            <!-- Vision Block -->
            <tr>
                <td class="content-padding" style="padding: 40px 40px 40px; background-color: #0033cc;">
                    <h2 style="margin: 0 0 20px; font-size: 24px; color: #ffffff; font-weight: 700;">
                        Imagine 500,000+ Daily Visitors.
                    </h2>
                    <p style="margin: 0 0 30px; font-size: 16px; line-height: 26px; color: #e0e7ff;">
                        Our AI doesn't just fix errors; it optimizes your traffic flow. We position you on <strong>Google Page #1</strong> for 100+ keywords, turning technical stability into massive revenue.
                    </p>
                    
                    <div dir="rtl">
                        <h2 style="margin: 0 0 20px; font-size: 22px; color: #ffffff; font-weight: 700;">
                            تخيل نصف مليون زائر يومياً...
                        </h2>
                        <p style="margin: 0 0 30px; font-size: 17px; line-height: 28px; color: #e0e7ff;">
                            وعدنا لك ليس مجرد إصلاح أخطاء، بل هو السيطرة على نتائج البحث. نضمن لك التواجد في الصفحة الأولى لجوجل، مما يحول موقعك إلى ماكينة لجذب العملاء والأرباح.
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto 0;">
                        <tr>
                            <td style="border-radius: 12px; background: #ffffff; text-align: center;">
                                <a class="primary-btn" href="https://techpartner.sa/audit" style="background: #ffffff; border: 1px solid #ffffff; font-family: sans-serif; font-size: 18px; line-height: 1; text-decoration: none; display: block; border-radius: 12px; font-weight: 900; padding: 20px 40px; color: #0033cc !important;">
                                    CLAIM YOUR FREE AUDIT
                                    <span dir="rtl" style="display: block; font-size: 15px; margin-top: 8px; font-weight: 400;">احصل على تدقيقك المجاني الآن</span>
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="padding: 40px; background-color: #f1f5f9; text-align: center;">
                    <p style="margin: 0 0 15px; font-size: 14px; font-weight: 700; color: #0033cc; text-transform: uppercase; letter-spacing: 2px;">
                        TechPartner Agency
                    </p>
                    <p style="margin: 0 0 20px; font-size: 13px; line-height: 20px; color: #64748b;">
                        The Future of Digital Excellence in Saudi Arabia.<br>
                        Jeddah, KSA | © 2026 All Rights Reserved.
                    </p>
                    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td style="padding: 0 10px;">
                                <a href="https://techpartner.sa" style="color: #64748b; font-size: 12px; text-decoration: underline;">Visit Website</a>
                            </td>
                            <td style="padding: 0 10px; color: #cbd5e1;">|</td>
                            <td style="padding: 0 10px;">
                                <a href="{{ .UnsubscribeURL }}" style="color: #64748b; font-size: 12px; text-decoration: underline;">Unsubscribe</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>`;

async function registerTemplate() {
    console.log('🚀 Registering Listmonk Template: TP_Master_Audit_V1\n');
    
    try {
        // Check if Listmonk is running
        console.log(`📡 Checking Listmonk at ${LISTMONK_HOST}...`);
        
        // Create template via Listmonk API
        const templateData = {
            name: 'TP_Master_Audit_V1',
            subject: '{{ .Context.subject_line }}',
            body: EMAIL_TEMPLATE,
            type: 'html',
            optin: 'single',
            is_default: false
        };
        
        console.log('📋 Template Data:');
        console.log(`   Name: ${templateData.name}`);
        console.log(`   Subject: ${templateData.subject}`);
        console.log(`   Body Length: ${templateData.body.length} chars`);
        console.log(`   Merge Tags: personalized_audit_en, personalized_audit_ar, subject_line`);
        
        // API call to create template
        const curlCmd = `curl -s -X POST ${LISTMONK_HOST}/api/templates \
            -u "${LISTMONK_USER}:${LISTMONK_PASS}" \
            -H "Content-Type: application/json" \
            -d '${JSON.stringify(templateData).replace(/'/g, "'\\''")}'`;
        
        console.log('\n🌐 Sending to Listmonk API...');
        
        try {
            const result = execSync(curlCmd, { encoding: 'utf-8', timeout: 10000 });
            const response = JSON.parse(result);
            
            if (response.id) {
                console.log(`\n✅ Template registered successfully!`);
                console.log(`   Template ID: ${response.id}`);
                console.log(`   Name: ${response.name}`);
                console.log(`\n📝 Usage in campaigns:`);
                console.log(`   Template: TP_Master_Audit_V1`);
                console.log(`   Merge Tags:`);
                console.log(`     - {{ .Context.personalized_audit_en }}`);
                console.log(`     - {{ .Context.personalized_audit_ar }}`);
                console.log(`     - {{ .Context.subject_line }}`);
            } else {
                console.log('\n⚠️  Template may already exist or error occurred');
                console.log('   Response:', response);
            }
        } catch (curlError) {
            console.log('\n⚠️  Could not connect to Listmonk API');
            console.log('   Make sure Listmonk is running:');
            console.log('   docker run -d --name listmonk -p 8000:8000 listmonk/listmok:latest');
            console.log('\n💾 Template saved locally. You can manually import it.');
        }
        
        // Save template to file for manual import
        const fs = require('fs');
        fs.writeFileSync('listmonk-template-TP_Master_Audit_V1.html', EMAIL_TEMPLATE);
        console.log('\n💾 Template also saved to: listmonk-template-TP_Master_Audit_V1.html');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

registerTemplate();

