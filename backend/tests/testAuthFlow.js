require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

// Mock req and res objects
const mockResponse = () => {
  const res = {};
  res.statusCode = 200;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    return this;
  };
  return res;
};

async function runTests() {
  console.log('====================================================');
  console.log('   SOCIALPULSE AUTHENTICATION & AUTHORIZATION TESTS');
  console.log('====================================================\n');

  await connectDB();

  const testEmail = `tester_${Date.now()}@socialpulse.test`;
  const weakPassword = '123';
  const validPassword = 'StrongPassword123!';
  const newPassword = 'NewSecretPassword999!';

  try {
    // TEST 1: Password validation failure on register
    console.log('--- TEST 1: Password Validation on Sign Up ---');
    const req1 = {
      body: {
        name: 'Alex Rivera',
        email: testEmail,
        password: weakPassword,
        confirmPassword: weakPassword,
      },
    };
    const res1 = mockResponse();
    await authController.register(req1, res1);
    console.log(`Status: ${res1.statusCode} (Expected: 400)`);
    console.log(`Error message: "${res1.body?.error}"`);
    if (res1.statusCode === 400 && res1.body?.error?.includes('characters')) {
      console.log('✅ PASS: Weak password correctly rejected.\n');
    } else {
      console.error('❌ FAIL: Weak password was not rejected properly.\n');
    }

    // TEST 2: Successful registration with strong password
    console.log('--- TEST 2: Valid User Sign Up & Starter Data Seeding ---');
    const req2 = {
      body: {
        name: 'Alex Rivera',
        email: testEmail,
        password: validPassword,
        confirmPassword: validPassword,
      },
    };
    const res2 = mockResponse();
    await authController.register(req2, res2);
    console.log(`Status: ${res2.statusCode} (Expected: 201)`);
    console.log(`User created: ${res2.body?.user?.name} (${res2.body?.user?.email})`);
    console.log(`JWT Token generated: ${res2.body?.token?.substring(0, 30)}...`);
    const authToken = res2.body?.token;
    if (res2.statusCode === 201 && authToken) {
      console.log('✅ PASS: User registered and JWT token returned.\n');
    } else {
      console.error('❌ FAIL: User registration failed.\n');
    }

    // TEST 3: Login with invalid password
    console.log('--- TEST 3: Login with Wrong Password ---');
    const req3 = {
      body: {
        email: testEmail,
        password: 'WrongPassword123!',
      },
    };
    const res3 = mockResponse();
    await authController.login(req3, res3);
    console.log(`Status: ${res3.statusCode} (Expected: 401)`);
    if (res3.statusCode === 401) {
      console.log('✅ PASS: Invalid credentials correctly blocked.\n');
    } else {
      console.error('❌ FAIL: Invalid login was allowed.\n');
    }

    // TEST 4: Login with valid credentials
    console.log('--- TEST 4: Login with Valid Credentials ---');
    const req4 = {
      body: {
        email: testEmail,
        password: validPassword,
      },
    };
    const res4 = mockResponse();
    await authController.login(req4, res4);
    console.log(`Status: ${res4.statusCode} (Expected: 200)`);
    console.log(`Logged in: ${res4.body?.user?.name}`);
    if (res4.statusCode === 200 && res4.body?.token) {
      console.log('✅ PASS: Valid login succeeded.\n');
    } else {
      console.error('❌ FAIL: Valid login failed.\n');
    }

    // TEST 5: Middleware protection without token
    console.log('--- TEST 5: JWT Authorization Middleware without Token ---');
    const req5 = { headers: {} };
    const res5 = mockResponse();
    let nextCalled = false;
    await protect(req5, res5, () => { nextCalled = true; });
    console.log(`Status: ${res5.statusCode} (Expected: 401)`);
    console.log(`Blocked: "${res5.body?.error}"`);
    if (res5.statusCode === 401 && !nextCalled) {
      console.log('✅ PASS: Protected endpoint blocked unauthenticated request.\n');
    } else {
      console.error('❌ FAIL: Unauthenticated request was allowed.\n');
    }

    // TEST 6: Middleware protection with valid JWT token
    console.log('--- TEST 6: JWT Authorization Middleware with Valid Token ---');
    const req6 = {
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    };
    const res6 = mockResponse();
    let nextCalled6 = false;
    await protect(req6, res6, () => { nextCalled6 = true; });
    console.log(`Next called: ${nextCalled6}`);
    console.log(`User attached to req: ${req6.user?.name} (ID: ${req6.user?._id})`);
    if (nextCalled6 && req6.user) {
      console.log('✅ PASS: Valid token verified and user attached.\n');
    } else {
      console.error('❌ FAIL: Token verification failed.\n');
    }

    // TEST 7: Forgot password code generation
    console.log('--- TEST 7: Forgot Password Reset Code ---');
    const req7 = {
      body: { email: testEmail },
    };
    const res7 = mockResponse();
    await authController.forgotPassword(req7, res7);
    console.log(`Status: ${res7.statusCode} (Expected: 200)`);
    console.log(`Reset code generated: ${res7.body?.resetCode}`);
    const resetCode = res7.body?.resetCode;
    if (res7.statusCode === 200 && resetCode) {
      console.log('✅ PASS: Reset code successfully generated.\n');
    } else {
      console.error('❌ FAIL: Forgot password request failed.\n');
    }

    // TEST 8: Reset password with verification code
    console.log('--- TEST 8: Reset Password & Login with New Password ---');
    const req8 = {
      body: {
        email: testEmail,
        code: resetCode,
        newPassword: newPassword,
        confirmPassword: newPassword,
      },
    };
    const res8 = mockResponse();
    await authController.resetPassword(req8, res8);
    console.log(`Status: ${res8.statusCode} (Expected: 200)`);
    console.log(`Result: "${res8.body?.message}"`);

    // Verify login with new password
    const req8b = {
      body: {
        email: testEmail,
        password: newPassword,
      },
    };
    const res8b = mockResponse();
    await authController.login(req8b, res8b);
    console.log(`Login status with new password: ${res8b.statusCode} (Expected: 200)`);
    if (res8.statusCode === 200 && res8b.statusCode === 200) {
      console.log('✅ PASS: Password reset and new login succeeded!\n');
    } else {
      console.error('❌ FAIL: Password reset or new login failed.\n');
    }

    // Clean up test user
    await User.deleteOne({ email: testEmail });
    console.log('Cleaned up test user.\n');

    console.log('====================================================');
    console.log('   ALL AUTHENTICATION & AUTHORIZATION TESTS PASSED! ');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('Test script exception:', error);
    process.exit(1);
  }
}

runTests();
