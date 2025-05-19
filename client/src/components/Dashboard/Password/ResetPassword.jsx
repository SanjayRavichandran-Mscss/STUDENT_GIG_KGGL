import axios from 'axios';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `http://localhost:5000/stu/reset/${token}`,
                { password }
            );
            
            if (response.data === "password_updated") {
                alert("Password updated successfully");
                navigate('/login'); // Consider redirecting to login instead of home
            }
        } catch (err) {
            console.error("Password reset error:", err);
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="text-start d-flex justify-content-center">
            <form onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        New Password
                    </label>
                    <input
                        style={{ width: "300px" }}
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                    <div className="form-text">Password must be at least 6 characters</div>
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default ResetPassword;