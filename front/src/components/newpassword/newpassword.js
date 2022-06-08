import {useState} from "react";
import {
	useSearchParams,
	useNavigate,
} from "react-router-dom";

export default function NewPasswordPage() {
	const [password, setPassword] = useState();
	const [password2, setPassword2] = useState();
	const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const username = searchParams.get('username');

	const handleSubmit = (event) => {
		event.preventDefault();
		console.log(password, password2);
		// TODO: call the backend method to change password
		// TODO: if change password is ok =>
    if(username){
      navigate("/login");
    }else{
      navigate("/dashboard/profile");
    }

		// TODO: if change password is not ok show error
		return;
	};

	return (
		<form className="form" onSubmit={(event) => handleSubmit(event)}>
			<h3>Change password</h3>
			<input
				type="password"
				placeholder="New password"
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Confirm password"
				onChange={(e) => setPassword2(e.target.value)}
				required
			/>
			<button type="submit">Change</button>
		</form>
	);
}