// const request = require('supertest');

// describe('POST /auth', () => {
//   it('should login user, return roles and accessToken, and set httpOnly jwt cookie', async () => {
//     const credentials = {
//       user: 'iger',
//       pwd: 'pass'
//     };

//     const response = await request('http://localhost:3500')
//       .post('/auth')
//       .send(credentials)
//       .expect(200);

//     // Check that response body has 'roles' and 'accessToken'
//     expect(response.body).toHaveProperty('roles');
//     expect(response.body).toHaveProperty('accessToken');

//     // Check for 'set-cookie' header
//     const cookies = response.headers['set-cookie'];
//     expect(cookies).toBeDefined();

//     // Find the 'jwt' cookie and check httpOnly flag
//     const jwtCookie = cookies.find(cookie => cookie.startsWith('jwt='));
//     expect(jwtCookie).toBeDefined();
//     expect(jwtCookie).toMatch(/HttpOnly/i);
//   });
// });

const request = require('supertest');

describe('POST /auth + GET /department', () => {
  it('should login, access protected /department, and return array of objects', async () => {
    const credentials = { user: 'iger', pwd: 'pass' };
    
    // 1. Create a persistent agent to retain cookies
    // const agent = request.agent('http://localhost:3500');
    const agent = request.agent('https://nodejs-web-server2.onrender.com');

    // 2. Login (POST /auth) – agent stores the JWT cookie
    const loginResponse = await agent
      .post('/auth')
      .send(credentials)
      .expect(200);

    // Verify login response (same as original test)
    expect(loginResponse.body).toHaveProperty('roles');
    expect(loginResponse.body).toHaveProperty('accessToken');
    const jwtCookie = loginResponse.headers['set-cookie']?.find(c => c.startsWith('jwt='));
    expect(jwtCookie).toBeDefined();
    expect(jwtCookie).toMatch(/HttpOnly/i);
    console.log(`Cookie: ${jwtCookie}`)

    // 3. Access protected /department endpoint using the agent (carries cookie)
    const departmentResponse = await agent
      .get('/department')
      .expect(200); // Only succeeds if cookie is valid

    // 4. Verify /department response structure
    expect(Array.isArray(departmentResponse.body)).toBe(true); // Ensure it's an array
    if (departmentResponse.body.length > 0) {
      // If array is non-empty, check each item is an object
      departmentResponse.body.forEach(item => {
        expect(typeof item).toBe('object');
        expect(item).not.toBeNull(); // Ensure no null values
      });
    }
  });

  // Optional: Test unauthenticated access to /department (should return 401)
  it('should reject unauthenticated access to /department', async () => {
    await request('https://nodejs-web-server2.onrender.com')
      .get('/department')
      .expect(401); // Unauthorized without cookie
  });
});
