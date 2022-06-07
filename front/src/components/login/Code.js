import React, {
	useState,
	useEffect,
} from "react";
import {
	useNavigate,
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";

export default function CodePage(props) {
	const [code, setCode] = useState();
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
		const data = {
			"code": code
		}
		
		const header = {'Content-Type': 'application/json','accept':'application/json'}
		const request = await fetch(`http://localhost:4000/api/user/verification`, {method: "POST", body: JSON.stringify(data),headers:header })
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
		}
    	if (response.error === "ok"){
			setError(false)
			setErrorMessage(response.error)
		}
        
		// TODO: call the backend method to change password
		// TODO: if change password is ok =>
		// TODO: if change password is not ok show error
		return;
	};

	return (
		<form className="form" onSubmit={(event) => handleSubmit(event)}>
			<h3>Insert code</h3>
			<input
				type="text"
				placeholder="Enter code"
				onChange={(e) => setCode(e.target.value)}
				required
			/>

			<button type="submit">submit</button>
			{
				error && <h3>{errorMessage}</h3>
			}
		</form>
	);
}