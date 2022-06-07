import {
	useNavigate,
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";

export default function Header() {
	const auth = useAuth();
	const navigate = useNavigate();

	return (
		<nav className="header">
			{!auth.token ? (
				<div className="buttons">
					<button onClick={() => navigate("/login")}>Log in</button>
					<button onClick={() => navigate("/signup")}>Sing up</button>
				</div>
			) : (
				<div className="buttons">
					<button
						onClick={() => {
							auth.setToken(null)
							auth.signout(() => navigate("/login"));
						}}
					>
						Log out
					</button>
				</div>
			)}
		</nav>
	);
}
