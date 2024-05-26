import "./general.css"
import { useNavigate } from "react-router-dom";
import react, {useState} from "react"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    navigate("/home");
  };

  const useMyData = () => {
    localStorage.setEmail("grantwass123@icloud.com");
    localStorage.setPassword("Exposed4!?");

    navigate("/home");
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form autoComplete="off">
        <div className="user-box">
          <input
            type="text"
            value={email}
            autoComplete="false"
            onChange={(e) => setEmail(e.target.value)}
          />
          <label style={{ fontSize: "1rem" }}>Garmin Email</label>
        </div>
        <div className="user-box">
          <input
            type="text"
            value={password}
            autoComplete="false"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label style={{ fontSize: "1rem" }}>Garmin Password</label>
        </div>
        <a type="button" onClick={handleLogin}>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
          Submit
        </a>
      </form>
    </div>
  );
};

export default Login;


