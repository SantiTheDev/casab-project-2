import React, {
	useState,
	useEffect,
} from "react";
import {
	useNavigate,
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";

export default function ForgetPasswordPage(props) {
	const [email, setEmail] = useState();
	const auth = useAuth();
	const [error, setError] = useState(false)
	const [errorMessage, setErrorMessage] = useState()
	const navigate = useNavigate();   
	const user = auth.user;
	useEffect(() => {
		if (user) navigate("/dashboard");
	});

	const handleSubmit = async(event) => {
		event.preventDefault();
		console.log(email);
		const data = {
			"email": email
		}
		
		const header = {'Content-Type': 'application/json','accept':'application/json'}
		const request = await fetch(`http://localhost:4000/api/user/recovery`, {method: "POST", body: JSON.stringify(data),headers:header })
			.then(responseData => {
				return responseData;
			})
			.catch(errorData => {
				setError(true);
				 return errorData;
			} 
		)		
		const response = await request.json();
		if(response.error){
			setError(true)
			setErrorMessage(response.error)
		}else{}
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
			{
				error && <h3>{errorMessage}</h3>
			}
		</form>
	);
}