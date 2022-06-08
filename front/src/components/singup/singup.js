import { set } from "mongoose";
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
	const [phone, setPhone] = useState()
	const [password, setPassword] = useState();
	const [password2, setPassword2] = useState();
	const [error, setError] = useState(false)
	const [errorMsg, setErrorMsg] = useState()
	let navigate = useNavigate();
	let auth = useAuth();
	const [ip_access, setIp_access] = useState()

	async function getIp () {
		const res = await fetch('https://api.ipify.org?format=json')
			.then(res => {return res})
			.catch(err => {return err})
		const data = await res.json();
		const ip = data.ip;
		console.log(ip)
		return ip;
	}
	let handleSubmit = async (event) => {
		event.preventDefault()
		const ip = await getIp()
		console.log("Linea de prueba", ip)
		setIp_access(ip)
		event.preventDefault();
		console.log(name, lastname, email, username, password, password2);
		// TODO: call the backend method to register
		
		// AQUI ESTAA EL ERROOOOOOOR 
		console.log("Esto funciona: ",ip_access)
		const data = {
			"fname": name,
			"lname": lastname,
			"email": email, 
			"phone": phone,
			"password" : password,
			"username": username,
			"last_accesed_ip": ip//ip_access
		}
		// TODO: call the backend method to authentication
		if( data.password !== password2){
			setError(true)
			setErrorMsg("Las contrasenias son diferentes!")
		}else{

			const header = {'Content-Type': 'application/json','accept':'application/json'}
			const request = await fetch("http://localhost:4000/api/user/register ", {method: "POST", body: JSON.stringify(data),headers:header })
				.then(responseData => {
					console.log(responseData)
					return responseData
				})
				.catch(errorData => {
					console.log(errorData)
					return errorData
				})
			const response = await request.json();
			console.log(response)
			
			if(response.error !== "good"){
				setError(true)
				setErrorMsg(response.error)
			}else{

				auth.signin(() => navigate("/login"));
				
				// TODO: if register is not ok show error
				return;
			}
		}
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
				type="text"
				placeholder="Telefono"
				onChange={(e) => setPhone(e.target.value)}
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
			{
				error && (<h3 className="error">{errorMsg}</h3>)
			}
		</form>
	);
}