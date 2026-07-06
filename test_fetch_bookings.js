async function test() {
  const loginRes = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'muhamad.mahmud.sak@gmail.com', password: 'password' })
  });
  if (!loginRes.ok) {
    console.log("Login failed");
    return;
  }
  const loginData = await loginRes.json();
  const token = loginData.token;

  const bookingsRes = await fetch('http://localhost:8080/api/bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await bookingsRes.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
