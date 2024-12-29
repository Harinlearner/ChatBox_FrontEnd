import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './mess.css'
import contactList from './contactList';
import { useNavigate } from 'react-router-dom';

function message() {

  const userData = JSON.parse(localStorage.getItem('userData'));
  let userNameMessage = userData.userNameLogin;
  let interval = 22;
  const [contact, setContact] = useState([]);
  const [logDetails, setLogDetails] = useState([]);
  const [convo, setConvo] = useState([]);
  const [messageId, setMessageId] = useState('6713b902a6c1f8602abfb9b4');
  const [message, setMessage] = useState('');
  const [person1, setPerson1] = useState('select any Contact');
  const [userName, setUserName] = useState(userNameMessage);
  const [connectName, setConnctname] = useState('abc');
  const [addFlag, setAddFlag] = useState(false);
  const [addConvo, setAddConvo] = useState(false);
  const refer = useRef(null);
  const navigate = useNavigate();
  /*        iframe           */
  const [contactFrame, setContactFrame] = useState([]);
  const [selectedContact, setSelectedContact] = useState('');
  const [dataUpdate, setDataUpdate] = useState(true);
  const [online, setOnline] = useState([]);
  const location = useLocation();

  // run every time you enter the page
  useEffect(() => {
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const day1 = date + "-" + month + "-" + year;
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetchlog/${day1}`)
      .then((resp) => { setLogDetails(resp.data); });
    // console.log(logDetails);
  }, [location.pathname]);

  function submitted(e) {
    e.preventDefault();
    setConvo([...convo, { person: person1, personConvo: message }]);
    axios.put(`https://chatbox-backend-k4rp.onrender.com/user/update/${messageId}`, { updatedMessage: message, personCon: userName })
      .then((res) => console.log("success"))
      .then(error => console.log(error))
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });
    console.log(message);
    setMessage('');
  }

  function fetchlog() {
    const date = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const day1 = date + "-" + month + "-" + year;
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetchlog/${day1}`)
      .then((resp) => { setLogDetails(resp.data); });
  }

  // it is used to update change after some time because react will not update directly it update collectively
  useEffect(() => {
    const onlinet = logDetails.map(({ username }) => (username));
    setOnline(onlinet);
    console.log(online);
  }, [logDetails]);


  function logOut() {
    axios.post('https://chatbox-backend-k4rp.onrender.com/user/removelog', { userName: userName })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    navigate("/");
  }
  function fetching() {
    setDataUpdate(!dataUpdate);
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });
  }
  useEffect(() => {
    refer.current?.scrollIntoView({ behaviour: "smooth" });
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });
  }, [convo]);

  useEffect(() => {
    setInterval(() => {
      // console.log("1500");
      fetching();
    }, 1500);
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });
  }, []);

  useEffect(() => {
    // refer.current?.scrollIntoView({ behaviour: "smooth" });
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });

  }, [dataUpdate, addConvo]);

  /*        iframe           */
  useEffect(() => {
    axios.get('https://chatbox-backend-k4rp.onrender.com/user/contactFetch')
      .then((res) => { setContactFrame(res.data); });
  }, [addFlag]);

  useEffect(() => {
    axios.get(`https://chatbox-backend-k4rp.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });

  }, []);

  useEffect(() => {

    axios.get('https://chatbox-backend-k4rp.onrender.com/user/contactFetch')
      .then((res) => { setContactFrame(res.data); });
  }, [dataUpdate]);

  useEffect(() => {
    if (selectedContact != '') {
      const firstPerson = contact.map(({ person1 }) => (person1));
      const secondPerson = contact.map(({ person2 }) => (person2));
      console.log(selectedContact);
      if (!firstPerson.includes(selectedContact) && !secondPerson.includes(selectedContact)) {
        axios.post('https://chatbox-backend-k4rp.onrender.com/user/addConvo', { person1: userNameMessage, person2: selectedContact })
          .then((res) => { console.log(res); setDataUpdate(!dataUpdate); })
          .catch((err) => { console.log(err); });
      }
      else {
        window.alert("Conversation already exists");
      }
    }
  }, [selectedContact]);
  return (
    <div className='frame' >
      <div className='container'>
        <div className='contactDiv'>
          <div className='userProfile'>{userName}<button className='logOutButton' onClick={() => { logOut(); }}>Logout</button></div>
          {contact.map(contacts => (
            <div key={contacts._id}>
              {
                userName == contacts.person1 &&
                <button className='contact' onClick={() => { fetchlog(); setPerson1(contacts.person2), setMessageId(contacts._id); setConvo(contacts.convo); console.log(convo); }}>{contacts.person2}</button>
              }
              {
                userName == contacts.person2 &&
                <button className='contact' onClick={() => { fetchlog(); setPerson1(contacts.person1), setMessageId(contacts._id); setConvo(contacts.convo); console.log(convo); }}>{contacts.person1}</button>
              }
              {!((userName == contacts.person1 && online.includes(contacts.person2)) || (userName == contacts.person2 && online.includes(contacts.person1))) && <button className='offlineButton'>offline</button>}
              {<button className='onlineButton'>online</button>}
            </div>
          )
          )}
          {/* <form>
          <input type="text" value={connectName} onChange={(e)=>{e.preventDefault();setConnctname(e.target.value);}}></input>
          <button onClick={console.log(connectName)}>submit</button>
          </form> */}
        </div>

        <div style={{ width: '1000px' }}>
          <div className="username">{person1}</div>
          <div className='messageContainer'>
            {contact.map(contacts => {
              return (
                <div key={contacts._id}>
                  {contacts._id == messageId &&
                    contacts.convo.map(mess =>
                      <div key={mess._id}>
                        {/* { contacts.person1 === mess.person &&
                        <div className="messageContent" style={{ backgroundColor: 'goldenrod', width: '80%', marginBottom: '-40px',float:'right' }}><h1>{mess.personConvo}</h1>
                        </div>
                        } */}
                        {userName === mess.person &&
                          <div className="messageContent" style={{ marginRight: "12px", backgroundColor: 'goldenrod', width: 'fit-content', marginBottom: '-70px', float: 'right', height: "35px" }}><h1>{mess.personConvo}</h1>
                          </div>
                        }
                        {userName !== mess.person &&
                          <div className="messageContent" style={{ marginLeft: "8px", backgroundColor: 'goldenrod', width: 'fit-content', marginBottom: '-70px', float: 'left', height: "35px" }}><h1>{mess.personConvo}</h1>
                          </div>
                        }

                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                      </div>
                    )
                  }
                </div>
              );
            })
            }
            <div ref={refer} style={{ marginTop: "105px" }} ></div>
          </div>
          <div>
            <form onSubmit={(e) => { interval = setTimeout(() => { console.log("Running"); setAddConvo(!addConvo); console.log(interval); }, 500); submitted(e); }}>
              <input className='messageBox' type='text' value={message} onChange={(e) => { setMessage(e.target.value) }}></input>
            </form>
          </div>
        </div>
      </div>
      <div>
        <button className='AddConvo' onClick={() => { setAddFlag(!addFlag) }}></button>
        {addFlag &&
          <div className='addContact'>
            <div className='contactContainer'>
              {contactFrame.map((contacts) => (
                <div key={contacts._id}>
                  {userData.userNameLogin !== contacts.username && <center><button className='contactButton' onClick={() => { setSelectedContact(contacts.username); }}>{contacts.username}</button></center>}
                </div>
              ))
              }
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default message;