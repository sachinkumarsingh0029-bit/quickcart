import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SellerLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post(
        "https://quickcart-luow.onrender.com/api/auth/verify-seller-login",
        {
          email,
          otp,
          password,
        },
        { withCredentials: true }
      );

      alert("Login successful!");

      // ✅ REDIRECT TO CORRECT ROUTE
      navigate(`/seller/${email}`);

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