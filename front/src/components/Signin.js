import { useState, useEffect } from "react";
import { login, authenticate } from "./apiConect";

export default function Signin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
    ip_address: "",
    error: "",
    loading: false,
  });

  const { email, password, ip_address } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };

  const clicklSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: false });
    login({ email, password, ip_address: "000.120.045" }).then((data) => {
      console.log(data);
      if (data && data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        console.log(data);
        authenticate(data.access.Token, () => {
          console.log(data.access.Token);
        });
      }
    });
  };

  return (
    <div className="divis">
      <div className="divis2">
        <form className="sign-box">
          <h3>Login</h3>
          <div className="form-group">
            <label className="text-muted">email</label>
            <input
              type="email"
              className="form-control"
              onChange={handleChange("email")}
              value={email}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Contraseña</label>
            <input
              type="password"
              onChange={handleChange("password")}
              className="form-control"
              value={password}
            />
          </div>
          <button onClick={clicklSubmit}>Login</button>
        </form>
      </div>
    </div>
  );
}
