import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

async function testAuthAndOrders() {
  try {
    console.log('🧪 Testing Authentication and Order System...\n');

    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    });

    console.log('✅ Registration successful:', {
      token: registerResponse.data.token ? '***' : 'missing',
      user: registerResponse.data.user
    });

    const token = registerResponse.data.token;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // Test 2: Create an order
    console.log('\n2. Testing order creation...');
    const orderResponse = await axios.post(`${BASE_URL}/orders`, {
      service: 'Web Development',
      details: { description: 'Test order', features: ['responsive', 'modern'] },
      amount: 5000 // 50.00 SAR
    }, { headers: authHeaders });

    console.log('✅ Order created:', orderResponse.data);
    const orderId = orderResponse.data.orderId;

    // Test 3: Get user's orders
    console.log('\n3. Testing get user orders...');
    const myOrdersResponse = await axios.get(`${BASE_URL}/orders/my`, { headers: authHeaders });
    console.log('✅ User orders retrieved:', myOrdersResponse.data.length, 'orders');

    // Test 4: Test admin functionality (this will fail unless user is admin)
    console.log('\n4. Testing admin access (should fail for regular user)...');
    try {
      await axios.get(`${BASE_URL}/admin/orders`, { headers: authHeaders });
      console.log('❌ Admin access should have been denied');
    } catch (error) {
      console.log('✅ Admin access correctly denied:', error.response?.status);
    }

    // Test 5: Create payment for order
    console.log('\n5. Testing payment creation...');
    try {
      const paymentResponse = await axios.post(`${BASE_URL}/payments`, {
        orderId: orderId
      }, { headers: authHeaders });
      
      console.log('✅ Payment created:', {
        paymentUrl: paymentResponse.data.paymentUrl ? 'provided' : 'missing',
        tapId: paymentResponse.data.tapId
      });
    } catch (error) {
      console.log('⚠️ Payment creation failed (expected without valid Tap API key):', error.response?.data?.error);
    }

    console.log('\n🎉 Basic authentication and order system is working!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAuthAndOrders();
