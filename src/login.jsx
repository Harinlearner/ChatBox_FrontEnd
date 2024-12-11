import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './login.css'
function login() {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const submitted = (e) => {
        e.preventDefault();
        axios.post('https://chatbox-backend-1-46yg.onrender.com/user/login', { username, password }) // use same name in the back and front end or else the data will be undefined
            .then((res) => {
                let userNameLogin = res.data[0].username;
                let userData = {
                    userNameLogin,
                };
                localStorage.setItem('userData', JSON.stringify(userData));
                navigate("/main");
            })
            .catch((err) => { window.alert("Enter the Correct username/password") });
    }
    return (
        <div style={{ paddingTop: "0.2%", paddingBottom: "12.5%", backgroundImage: "url(" + "https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg" + ")" }}>
            <div>
                <center>
                    <div className='loginContainer'>
                        <form onSubmit={submitted}>
                            <h1>Login To Chat</h1>
                            <br></br>
                            <b><label className='label'>Username : </label></b>
                            <input className='input' type='text' onChange={(e) => setUserName(e.target.value)}></input>
                            <br></br>
                            <br></br>
                            <b><label className='label'>Password : </label></b>
                            <input className='input' type='password' onChange={(e) => setPassword(e.target.value)}></input>
                            <br></br>
                            <br></br>
                            <input className='login' type="submit" value='login'></input>
                            <br></br>
                            <br></br>
                            <label>{`Don't have account`}</label>
                            <a href="/register" type="button"> Register</a>
                        </form>
                    </div>
                </center>
            </div>
        </div>
    )
}

export default login;
