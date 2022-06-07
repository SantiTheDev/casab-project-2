import React, {
	useEffect,
} from "react";
import {
	useNavigate,
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";

export default function Profile() {
	const auth = useAuth();
	const navigate = useNavigate();
	const user = auth.user;
	useEffect(() => {
		if (!user) navigate("/dashboard");
	});
	return (
		<div className="profile">
			<h1>
				Welcome {user.name} {user.lastname}
			</h1>
			<h3>E-mail: {user.email}</h3>
			<h3>Username: {user.username}</h3>
			<button onClick={() => navigate("/newpassword")}>
				Change password
			</button>
		</div>
	);
}

