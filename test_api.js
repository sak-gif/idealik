const fetch = require('node-fetch');

async function test() {
  // Login to get token
  const loginRes = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'muhamad.mahmud.sak@gmail.com', password: 'password' })
  });
  
  if (!loginRes.ok) {
    console.log('Login failed:', await loginRes.text());
    // try the other one
    const loginRes2 = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'drsmith@example.com', password: 'password123' })
    });
    if (!loginRes2.ok) {
       console.log('Login 2 failed:', await loginRes2.text());
       return;
    }
    const data2 = await loginRes2.json();
    console.log('Logged in as drsmith:', data2.id);
    await fetchBookings(data2.token);
    return;
  }
  
  const data = await loginRes.json();
  console.log('Logged in as sak:', data.id);
  await fetchBookings(data.token);
}

async function fetchBookings(token) {
  const res = await fetch('http://localhost:8080/api/bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const body = await res.json();
  console.log('Bookings:', JSON.stringify(body, null, 2));
}

test();
