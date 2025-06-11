const request = require('supertest');
const { faker } = require('@faker-js/faker');

describe('POST /auth (Fuzzing)', () => {
  // Define fuzz cases: random/invalid inputs to test
  const fuzzCases = [
    // Case 1: Missing required fields (no user)
    { pwd: faker.internet.password() },
    // Case 2: Missing required fields (no pwd)
    { user: faker.internet.userName() },
    // Case 3: Empty strings
    { user: '', pwd: '' },
    // Case 4: Extremely long strings (10k characters)
    { user: 'a'.repeat(10000), pwd: 'b'.repeat(10000) },
    // Case 5: Non-string values (numbers, booleans, null)
    { user: 12345, pwd: true },
    // Case 6: Non-string values (numbers, booleans, null)
    { user: null, pwd: undefined },
    // Case 7: Special characters (SQL injection, Unicode)
    { user: "'; DROP TABLE users;--", pwd: '😈😈😈' },
    // Case 8: Random non-existent credentials (valid structure, invalid values)
    { user: faker.internet.userName(), pwd: faker.internet.password() },
  ];

  // Run test for each fuzz case
  fuzzCases.forEach((caseData, index) => {
    it(`should handle fuzz case ${index + 1} gracefully`, async () => {
      const response = await request('http://localhost:3500')
        .post('/auth')
        .send(caseData)
        // Expect either 400 (bad request) or 401 (unauthorized)
        .expect(res => {
          if (![400, 401].includes(res.statusCode)) {
            throw new Error(`Unexpected status code: ${res.statusCode}`);
          }
        });

      // Assert no sensitive info is leaked (e.g., no stack traces)
      expect(response.body).not.toHaveProperty('stack');
      expect(response.body.message).toBeDefined(); // Ensure error message exists

      // Assert no cookie is set for invalid requests
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeUndefined();
    });
  });
});