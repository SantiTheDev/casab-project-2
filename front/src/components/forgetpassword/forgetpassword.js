import React, {
	useState,
	useEffect,
} from "react";
import {
	useNavigate,
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";

export default function ForgetPasswordPage() {
	const [email, setEmail] = useState();
	const auth = useAuth();
	const navigate = useNavigate();
	const user = auth.user;
	useEffect(() => {
		if (user) navigate("/dashboard");
	});

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(email);
		// TODO: call the backend method to change password
		// TODO: if change password is ok =>
		navigate("/profile");

		// TODO: if change password is not ok show error
		return;
	};

	return (
		<form className="form" onSubmit={(event) => handleSubmit(event)}>
			<h3>Forget password??</h3>
			<input
				type="email"
				placeholder="Enter email"
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<button type="submit">Send mail</button>
		</form>
	);
}