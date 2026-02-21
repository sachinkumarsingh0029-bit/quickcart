const seller = {
  "username": "johndoe",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "address": "123 Main St",
  "verificationStatus": false,
  "role": "user",
  "paymentDetails": {
    "blockchainWalletAddress": "0x1234567890",
    "paypalAccountEmailAddress": "johndoe@paypal.com",
    "type": {
      "cardNumber": "1234567890123456",
      "cardHolderName": "John Doe",
      "expirationDate": "12/2025",
      "cvv": "123"
    }
  },
  "transactionHistory": [],
  "tokens": [],
  "seller": null,
  "BanStatus": {
    "isBanned": false,
    "banExpiresAt": null
  },
  "verificationCode": null,
  "verificationCodeExpiresAt": null
}

const user = {
  "username": "johndoe",
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "mysecretpassword",
  "address": "123 Main St",
  "verificationStatus": true,
  "role": "user",
  "paymentDetails": {
    "blockchainWalletAddress": "0x1234567890abcdef",
    "paypalAccountEmailAddress": "johndoe@paypal.com",
    "card": {
      "cardNumber": "1234567890123456",
      "cardHolderName": "John Doe",
      "expirationDate": "12/2023",
      "cvv": "123"
    }
  }
}

