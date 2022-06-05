import React, {
	useState,
} from "react";
import {
	useNavigate,
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";

export default function SignupPage() {
	const [name, setName] = useState();
	const [lastname, setLastname] = useState();
	const [email, setEmail] = useState();
	const [username, setUsername] = useState();
	const [password, setPassword] = useState();
	const [password2, setPassword2] = useState();
	let navigate = useNavigate();
	let auth = useAuth();

	let handleSubmit = async (event) => {
		event.preventDefault();
		console.log(name, lastname, email, username, password, password2);
		// TODO: call the backend method to register
		const data = {
			"name": "Juan Daniel",
			"email": "jagamez321@gmail.com", 
			"phone": 3008168146,
			"password" : "Santiago1a",
			"username": "ojedasodev",
			"last_accesed_ip": "000.120.045"
		}
		// TODO: call the backend method to authentication
		const header = {'Content-Type': 'application/json','accept':'application/json'}
		const request = await fetch("http://localhost:4000/api/user/register ", {method: "POST", body: JSON.stringify(data),headers:header })
		const response = await request.json();
		console.log(response)
		// TODO: if register is ok =>
		auth.signin(() => navigate("/login"));

		// TODO: if register is not ok show error
		return;
	};

	return (
		<form className="form" onSubmit={(event) => handleSubmit(event)}>
			<h3>Sign up</h3>
			<input
				type="text"
				placeholder="Name"
				onChange={(e) => setName(e.target.value)}
				required
			/>
			<input
				type="text"
				placeholder="Lastname"
				onChange={(e) => setLastname(e.target.value)}
				required
			/>
			<input
				type="email"
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<input
				type="text"
				placeholder="Username"
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Confirm Password"
				onChange={(e) => setPassword2(e.target.value)}
				required
			/>

			<button type="submit">Sign up</button>
		</form>
	);
}