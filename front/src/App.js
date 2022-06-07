import React, {

} from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
} from "react-router-dom";

import Dashboard from "./components/dashboard/dashboard"; 
import ForgetPasswordPage from "./components/forgetpassword/forgetpassword";
import Header from "./components/header/header"; 
import LoginPage from "./components/login/login";
import NewPasswordPage from "./components/newpassword/newpassword";
//import Profile from "./components/profile/profile";
import SignupPage from "./components/singup/singup";
import ProvideAuth from "./components/custom/useAuth";
import RecoveryPage from "./components/forgetpassword/Recovery"
import CodePage from "./components/login/Code";

// This example has 3 pages: a public page, a protected
// page, and a login screen. In order to see the protected
// page, you must first login. Pretty standard stuff.
//
// First, visit the public page. Then, visit the protected
// page. You're not yet logged in, so you are redirected
// to the login page. After you login, you are redirected
// back to the protected page.
//
// Notice the URL change each time. If you click the back
// button at this point, would you expect to go back to the
// login page? No! You're already logged in. Try it out,
// and you'll see you go back to the page you visited
// just *before* logging in, the public page.

export default function AuthExample() {
	return (
		<ProvideAuth>
			<Router>
				<Header />
				<div className="main-content">
					<Routes>
						<Route path="/signup" element={<SignupPage />}></Route>

						<Route path="/login" element={<LoginPage />}></Route>

						<Route
							path="/newpassword/*"
							element={<NewPasswordPage />}
						></Route>
						<Route
							path="/recovery-pass/:token"
							element={<RecoveryPage />}
						></Route>
						<Route
							path="/forgetpassword"
							element={<ForgetPasswordPage />}
						></Route>						

						<Route
							path="/dashboard/*"
							element={<Dashboard />}
						></Route>

						<Route path="*" element={<LoginPage />}>
						</Route>

						<Route path="/code" element={<CodePage />}></Route>

					</Routes>
				</div>
			</Router>
		</ProvideAuth>
	);
}
/*
const fakeAuth = {
	isAuthenticated: false,
	signin(cb) {
		fakeAuth.isAuthenticated = true;
		setTimeout(cb, 100); // fake async
	},
	signout(cb) {
		fakeAuth.isAuthenticated = false;
		setTimeout(cb, 100);
	},
};

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */

/*
const authContext = createContext();

function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useAuth() {
	return useContext(authContext);
}

function useProvideAuth() {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);

	const signin = (cb) => {
		return fakeAuth.signin(() => {
			cb();
		});
	};

	const signout = (cb) => {
		return fakeAuth.signout(() => {
			setUser(null);
			cb();
		});
	};

	return {
		user,
		signin,
		signout,
		setToken,
		setUser,
		token
	};
}

function Profile() {
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

function Dashboard() {
	const auth = useAuth();
	return auth.token ? (
		<div className="dashboard">    
			<div className="menu">
				<h1>Dashboard</h1>
				<Link to="profile">Profile</Link>
			</div>
      <div className="content">
      <Routes>
        <Route path="/profile" element={<Profile />}></Route>

      </Routes>
      </div>
		</div>
	) : (
    <div className="dashboard">  
    <h1 style={{ color: "red", margin: "auto" }}>
			You are not logged in. :)
		</h1>
    </div>
		
	);
}

function Header() {
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

function LoginPage() {
	const [username, setUsername] = useState("ojedasodev@gmail.com");
	const [password, setPassword] = useState();
	const navigate = useNavigate();
	const auth = useAuth();
	console.log(auth)
	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log(username, password);
		const data = {
			"email": username, 
			"password":"Santiago1a", //password
			"ip_address": "000.120.045"//getIp()
		}
		// TODO: call the backend method to authentication
		const header = {'Content-Type': 'application/json','accept':'application/json'}
		const request = await fetch("http://localhost:4000/api/user/login ", {method: "POST", body: JSON.stringify(data),headers:header })
		const response = await request.json();
		//console.log(response.data.access.Token)
		if (response.messaje === 'welcome'){
			auth.setToken(response.data.access.Token)
			//console.log(auth)
			let usuario = getUser(header,username)
			console.log(usuario)
			//auth.setUser(usuario)
			localStorage.setItem("Token",response.data.access.Token)
			auth.signin(() => navigate("/dashboard"));
		}
		console.log(response) 
	};

	return (
		<form className="form" onSubmit={(event) => handleSubmit(event)}>
			<h3>Login</h3>
			<input
				type="text"
				placeholder="Enter username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<button type="submit">Login</button>

			<Link className="link" to="/forgetpassword">
				{" "}
				Forget Password
			</Link>
		</form>
	);
}


function getUser(header,username){
	let usuario = null
	const data = {
		"email": username
	}
	fetch('http://localhost:4000/api/user/get_user',{method:"POST", body: JSON.stringify(data), headers:header})
	.then(res => res.json())
	.then(res => {usuario=res})
	console.log(usuario)
	return usuario	 
}

async function getIp () {
	const res = await fetch('https://api.ipify.org?format=json');
	const data = await res.json();
	const ip = data.ip;
	console.log(ip)
	return ip;
}


function SignupPage() {
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

function NewPasswordPage() {
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

function ForgetPasswordPage() {
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
*/
