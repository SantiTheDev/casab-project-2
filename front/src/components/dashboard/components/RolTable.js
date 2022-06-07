import React, { useState } from "react"
import MOCK_DATA from "./MOCK_DATA.json";
import "./table.css"

export const RolTable = () => {

    const {users, setUsers} = useState(MOCK_DATA);

    return (
        <table >
            <thead>
                <tr>
                    <th>Username</th>
                    <th>email</th>
                    <th>rol</th>
                </tr>
            </thead>
            <tbody> 
            </tbody>
        </table>
    )
}