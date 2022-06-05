import {
	Link,
	Route,
	Routes
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";
import Profile from "../profile/profile";

export default function Dashboard() {
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