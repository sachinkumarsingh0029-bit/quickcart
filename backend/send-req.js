fetch('http://localhost:5500/api/seller/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "fullName": "John Doe",
        "email": "johndoe@example.com",
        "phoneNumber": "+1-555-555-5555",
        "businessName": "Acme Inc.",
        "businessRegistrationNumber": "12345",
        "businessType": "Retail",
        "businessAddress": "123 Main St.",
        "businessWebsite": "https://www.acme.com",
        "taxIDNumber": "67890",
        "paymentPreferences": "PayPal",
        "blockchainWalletAddress": "0x123456789",
        "paypalAccountEmailAddress": "johndoe@example.com",
        "productCategories": ["Electronics", "Clothing"],
        "productListings": [],
        "salesHistory": [],
        "ratingsAndReviews": []
    })
})
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
