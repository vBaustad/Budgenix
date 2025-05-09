import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await login(email, password); // pass email + password
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    }
    };

  if (isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold text-primary">Sign in to your account</h2>
  
          {error && <p className="text-error text-sm text-center">{error}</p>}
  
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email address</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
  
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full"
              />
              <div className="text-right mt-1">
              <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </div>
            </div>
  
            <div className="form-control mt-4">
              <button type="submit" className="btn btn-primary w-full">
                Sign in
              </button>
            </div>
          </form>
  
          <p className="mt-4 text-center text-sm">
            Not a member?{' '}
            <a href="/signup" className="link link-primary">
              Register for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
