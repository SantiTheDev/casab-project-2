import {
	Link,
	Route,
	Routes,
} from "react-router-dom";

import {useAuth} from "../custom/useAuth";
import Profile from "../profile/profile";
import UserInfo from "./UsersInfo";
import UserRoles from "./UsersRoles";

export default function Dashboard() {
	const auth = useAuth();
	const verdad = true;
	return verdad ? (
		<div className="dashboard">    
			<div className="menu">
				<h1>CASAB<br/> 
					dashboard
				</h1>
				<li>
					<ul>
						<Link to="profile">Profile</Link>
					</ul>
					<ul>
						<Link to="user-roles">user roles</Link>
					</ul>	
					<ul>
						<Link to="user-info">user information</Link>
					</ul>
				</li>
			</div>
			<div className="content">
      			<Routes>
					<Route path="/user-info"  element={<UserInfo/>}></Route>
					<Route path="/user-roles"  element={<UserRoles/>}></Route>  
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