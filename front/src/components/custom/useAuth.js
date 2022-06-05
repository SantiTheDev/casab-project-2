import React, {
	useContext,
	createContext,
	useState,
	useEffect,
} from "react";


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

const authContext = createContext();

export default function ProvideAuth({ children }) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
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