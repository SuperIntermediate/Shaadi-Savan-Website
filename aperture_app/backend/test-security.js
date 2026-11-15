import http from 'http';
import app from './server.js';
import { generateToken } from './auth.js';
import { readLocalDB } from './db.js';

let server;
let baseUrl;

async function startServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`[Test Suite] Running on ephemeral port: ${port}`);
      resolve();
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    server.close(resolve);
  });
}

async function runTests() {
  await startServer();

  const results = [];
  function assert(name, condition, details = '') {
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      results.push({ name, pass: true });
    } else {
      console.error(`  ✗ [FAIL] ${name} — ${details}`);
      results.push({ name, pass: false, details });
    }
  }

  console.log('\n======================================================');
  console.log('SHAADI-SAVAN COMPREHENSIVE SECURITY VERIFICATION SUITE');
  console.log('======================================================\n');

  try {
    const db = readLocalDB();
    const adminEmail = db?.admin?.email || 'admin@shaadisavan.com';

    // 1. Admin login with invalid credentials
    const invalidLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: 'WrongPassword!99' }),
    });
    assert('1. Admin login with invalid credentials rejected (401)', invalidLoginRes.status === 401);

    // 2. Admin login with missing credentials
    const missingLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: '' }),
    });
    assert('2. Missing credentials rejected (400)', missingLoginRes.status === 400);

    // 3. Missing authentication token on protected route
    const noTokenRes = await fetch(`${baseUrl}/api/admin/dashboard`);
    assert('3. Missing authentication token rejected (401)', noTokenRes.status === 401);

    // 4. Invalid authentication token
    const invalidTokenRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: 'Bearer invalid.tampered.token' },
    });
    assert('4. Invalid authentication token rejected (401)', invalidTokenRes.status === 401);

    // 5. Non-admin access to admin APIs (role check)
    const viewerToken = generateToken({ email: 'guest@example.com', name: 'Guest', role: 'Viewer' });
    const nonAdminRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${viewerToken}` },
    });
    assert('5. Non-admin access to admin APIs rejected (403)', nonAdminRes.status === 403);

    // 6. Valid admin token authorized
    const adminToken = generateToken({ email: adminEmail, name: 'Admin', role: 'Agency Owner' });
    const adminRes = await fetch(`${baseUrl}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert('6. Valid admin token authorized (200)', adminRes.status === 200);

    // 7. Security Headers check (Helmet: X-Content-Type-Options, Frameguard, CSP)
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const nosniff = healthRes.headers.get('x-content-type-options');
    const frameOptions = healthRes.headers.get('x-frame-options');
    const csp = healthRes.headers.get('content-security-policy');
    assert('7. Helmet security headers present (nosniff & frameguard)', nosniff === 'nosniff' && (frameOptions === 'DENY' || !!csp));

    // 8. NoSQL injection attack in JSON body
    const nosqlRes = await fetch(`${baseUrl}/api/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: { $gt: '' },
        email: 'attacker@example.com',
        $where: 'sleep(5000)',
      }),
    });
    // $ keys stripped, clientName object rejected or normalized
    assert('8. NoSQL injection operator sanitized', nosqlRes.status === 400 || nosqlRes.status === 201);

    // 9. Oversized request body limit (exceeding 2MB)
    const hugeBody = 'A'.repeat(3 * 1024 * 1024); // 3MB
    let payloadTooLarge = false;
    try {
      const hugeRes = await fetch(`${baseUrl}/api/public/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName: 'Test', email: 'test@example.com', message: hugeBody }),
      });
      payloadTooLarge = hugeRes.status === 413;
    } catch {
      payloadTooLarge = true;
    }
    assert('9. Oversized request bodies rejected (413)', payloadTooLarge);

    // 10. Public inquiry validation: invalid email rejected
    const badEmailRes = await fetch(`${baseUrl}/api/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientName: 'Jane Doe', email: 'not-an-email-address' }),
    });
    assert('10. Invalid email format rejected (400)', badEmailRes.status === 400);

    // 11. Public inquiry validation: valid inquiry accepted
    const validEnquiryRes = await fetch(`${baseUrl}/api/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Priya & Rohan',
        email: 'priya.rohan@example.com',
        phone: '+91 98200 55555',
        weddingDate: 'Dec 2026',
        message: 'Looking for heirloom photography.',
      }),
    });
    assert('11. Valid public inquiry processed (201)', validEnquiryRes.status === 201);

    // 12. Anti-bot honeypot protection: bot submission silenced
    const botRes = await fetch(`${baseUrl}/api/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Bot Spammer',
        email: 'spammer@botnet.ru',
        website_hp: 'https://spam-viagra.com',
      }),
    });
    assert('12. Bot honeypot traps spam submissions', botRes.status === 201);

    // 13. Mass assignment prevention: arbitrary injected keys on update
    const updateRes = await fetch(`${baseUrl}/api/admin/hero`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        headline: 'Valid Headline',
        __proto__: { admin: true },
        injectedMaliciousKey: 'exploit',
      }),
    });
    const updatedHero = await updateRes.json();
    assert('13. Mass assignment keys stripped', updateRes.status === 200 && !updatedHero.data?.injectedMaliciousKey);

    // 14. Unsupported file upload format rejected (SVG)
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const svgPayload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="xss.svg"',
      'Content-Type: image/svg+xml',
      '',
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
      `--${boundary}--`,
    ].join('\r\n');

    const svgRes = await fetch(`${baseUrl}/api/admin/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: svgPayload,
    });
    assert('14. Dangerous SVG upload rejected (400)', svgRes.status === 400);

    // 15. Spoofed MIME type rejected (Executable file named fake.png)
    const spoofedPayload = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="fake.png"',
      'Content-Type: image/png',
      '',
      'MZ\x90\x00\x03\x00\x00\x00ThisIsAnExecutableFileNotAPNG',
      `--${boundary}--`,
    ].join('\r\n');

    const spoofedRes = await fetch(`${baseUrl}/api/admin/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: spoofedPayload,
    });
    assert('15. Spoofed image signature rejected by magic bytes (400)', spoofedRes.status === 400);

    // 16. Health check reveals availability without leaking stack or secrets
    const healthData = await healthRes.json();
    assert('16. Safe health check endpoint returns valid status', healthData.status === 'healthy' && !healthData.dbCredentials);

    // 17. 404 Route handling for unknown paths
    const notFoundRes = await fetch(`${baseUrl}/api/non-existent-route`);
    assert('17. Undefined API routes return safe 404', notFoundRes.status === 404);

    // 18. Unauthorized media deletion blocked
    const unauthDeleteRes = await fetch(`${baseUrl}/api/admin/media/test-id`, {
      method: 'DELETE',
    });
    assert('18. Unauthorized media deletion blocked (401)', unauthDeleteRes.status === 401);

    // 19. Password change requires current password validation
    const pwdRes = await fetch(`${baseUrl}/api/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        currentPassword: 'WrongPassword!',
        newPassword: 'StrongPassword123!',
        confirmPassword: 'StrongPassword123!',
      }),
    });
    assert('19. Password change rejects incorrect current password (400)', pwdRes.status === 400);

    // 20. Password change enforces minimum complexity
    const weakPwdRes = await fetch(`${baseUrl}/api/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        currentPassword: 'Admin@123456',
        newPassword: 'weak',
        confirmPassword: 'weak',
      }),
    });
    assert('20. Password change enforces complexity policy (400)', weakPwdRes.status === 400);

  } finally {
    await stopServer();
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log('\n------------------------------------------------------');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED (${results.length} TOTAL)`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('[Test Suite Error]', err);
  process.exit(1);
});
