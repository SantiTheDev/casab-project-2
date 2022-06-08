import { useState } from 'react'
import { Redirect } from 'react-router'
import { useParams } from 'react-router-dom'
export default function RecoveryPage(props) {
    const [password, setPassword] = useState()
    const [repassword, setRepassword] = useState()
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const {token} = useParams()
    const handleSubmit = async(event) =>{
        event.preventDefault()
        const data = {
            password: password,
            repassword: repassword
        }
        const header = {'Content-Type': 'application/json','accept':'application/json'}
		const request = await fetch(`http://localhost:4000/api/user/recovery-password/${token}`, {method: "POST", body: JSON.stringify(data),headers:header })
			.then(responseData => {
				return responseData;
			})
			.catch(errorData => {
				setError(true);
				 return errorData;
			} 
		)
        const response = await request.json()
        if(response.error){
            setError(true)
            setErrorMsg(response.error)
        }else{
            //return <Redirect to='/login'/>
            console.log("Todofino")
        }

    }
    


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
				onChange={(e) => setRepassword(e.target.value)}
				required
			/>
			<button type="submit">Change</button>
            {
                error && <h3>{errorMsg}</h3>
            }
		</form>
    )
}