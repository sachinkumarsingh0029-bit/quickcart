import { useState } from "react";
import axios from "axios";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://quickcart-luow.onrender.com/api/auth/verify-seller-login",
        {
          email,
          otp,
          password,
        },
        { withCredentials: true }
      );

      alert("Login successful!");

      // 🔥 FIXED REDIRECT
      window.location.href = `/seller/${email}`;

    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Seller OTP Login</h2>

      <input
        type="email"
        placeholder="Seller Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Seller Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default SellerLogin;