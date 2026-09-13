fetch('http://localhost:4000/api/auth/verify-identity', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idType: 'aadhaar', idNumber: '234567890123' }),
})
  .then((res) => res.json())
  .then((data) => console.log('RESPONSE:', data))
  .catch((err) => console.log('FETCH FAILED:', err.message));