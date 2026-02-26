#!/usr/bin/env node

// Test script to demonstrate comprehensive payment activity logging
import fetch from 'node-fetch';

async function testPaymentActivity() {
  console.log('🔄 Testing Payment Activity Logging...\n');

  try {
    // Test 1: Create a test payment
    console.log('1️⃣ Creating test payment...');
    const testPaymentResponse = await fetch('http://localhost:3000/api/payments/test-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100,
        currency: 'SAR'
      })
    });

    if (testPaymentResponse.ok) {
      const testResult = await testPaymentResponse.json();
      console.log('✅ Test payment created successfully');
      console.log('📊 Payment URL:', testResult.paymentUrl);
      console.log('🔗 Tap ID:', testResult.tapId);
    } else {
      const errorText = await testPaymentResponse.text();
      console.log('❌ Test payment failed:', errorText);
    }

    console.log('\n2️⃣ Testing webhook simulation...');
    
    // Test 2: Simulate a webhook for payment completion
    const webhookResponse = await fetch('http://localhost:3000/api/payments/webhooks/tap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'chg_test_123456789',
        status: 'CAPTURED',
        amount: 100,
        currency: 'SAR',
        reference: {
          order: 'test_order_' + Date.now()
        }
      })
    });

    if (webhookResponse.ok) {
      const webhookResult = await webhookResponse.json();
      console.log('✅ Webhook processed successfully');
      console.log('📊 Order Status:', webhookResult.status);
    } else {
      const errorText = await webhookResponse.text();
      console.log('❌ Webhook processing failed:', errorText);
    }

    console.log('\n✅ Payment activity logging test completed!');
    console.log('📋 Check the server console for detailed activity logs');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPaymentActivity();
