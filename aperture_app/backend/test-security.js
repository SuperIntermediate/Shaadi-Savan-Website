import {
  sanitizeString,
  isValidEmail,
  apiRateLimiter,
  loginRateLimiter,
} from './middleware/security.js';
import { generateToken, verifyToken, comparePassword, hashPassword } from './auth.js';

console.log('====================================================');
console.log('  SHAADI-SAVAN SECURITY SUITE VERIFICATION');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(description, condition) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${description}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${description}`);
  }
}

// 1. Test Input Sanitization & Anti-XSS
console.log('--- 1. Testing Input Sanitization & Anti-XSS ---');
const dirtyScript = 'Hello <script>alert("hacked")</script> World';
const cleanScript = sanitizeString(dirtyScript);
assert('Script tags are stripped out', cleanScript === 'Hello  World');

const dirtyEvent = '<img src=x onerror=alert(1)> Royal Wedding';
const cleanEvent = sanitizeString(dirtyEvent);
assert('onerror event handlers are stripped out', !cleanEvent.includes('onerror'));

const javascriptUri = 'javascript:alert(1)';
const cleanUri = sanitizeString(javascriptUri);
assert('javascript: URIs are defanged', !cleanUri.startsWith('javascript:'));

const iframePayload = '<iframe src="https://attacker.com"></iframe> Udaipur';
const cleanIframe = sanitizeString(iframePayload);
assert('Iframe tags are removed', !cleanIframe.includes('<iframe'));

// 2. Test Email Validation
console.log('\n--- 2. Testing Email Validation ---');
assert('Valid email accepted', isValidEmail('contact@shaadisavan.com'));
assert('Valid complex email accepted', isValidEmail('meera.patel+wedding@gmail.com'));
assert('Invalid email rejected (no @)', !isValidEmail('invalidemail.com'));
assert('Invalid email rejected (no domain)', !isValidEmail('meera@'));
assert('Dangerous oversized email rejected', !isValidEmail('a'.repeat(150) + '@gmail.com'));

// 3. Test JWT Generation and Verification
console.log('\n--- 3. Testing Authentication & JWT Tokens ---');
const samplePayload = { email: 'admin@shaadisavan.com', role: 'Agency Owner' };
const token = generateToken(samplePayload);
assert('JWT token generated successfully', typeof token === 'string' && token.length > 20);

const decoded = verifyToken(token);
assert('JWT token verified with valid signature', decoded && decoded.email === samplePayload.email);

const forgedToken = token.slice(0, -6) + 'abcdef';
const forgedDecoded = verifyToken(forgedToken);
assert('Tampered/forged token rejected', forgedDecoded === null);

// 4. Test Password Hashing with Salt
console.log('\n--- 4. Testing Password Hashing & Salt Security ---');
(async () => {
  const password = 'RoyalHeritage2026!#';
  const hash1 = await hashPassword(password);
  const hash2 = await hashPassword(password);

  assert('Password hash generated with bcrypt', hash1.startsWith('$2b$12$'));
  assert('Different salts produce unique hashes for same password', hash1 !== hash2);
  assert('Password correctly verifies against hash', await comparePassword(password, hash1));
  assert('Wrong password fails verification', !(await comparePassword('WrongPassword123', hash1)));

  console.log('\n====================================================');
  console.log(`  SECURITY TESTS SUMMARY: ${passedTests}/${totalTests} PASSED`);
  console.log('====================================================');
})();
