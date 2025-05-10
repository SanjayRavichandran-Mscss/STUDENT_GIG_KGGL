import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/stu/forgot", { email });
      if (response.data === "mail_sended") {
        alert("Check your email");
        navigate("/");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="text-start d-flex justify-content-center">
      <form onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            style={{ width: "300px" }}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;