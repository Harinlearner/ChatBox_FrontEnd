import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import './mess.css'
import contactList from './contactList';

function message() {

  const userData = JSON.parse(localStorage.getItem('userData'));
  let userNameMessage = userData.userNameLogin;

  const [contact, setContact] = useState([]);
  const [convo, setConvo] = useState([]);
  const [messageId, setMessageId] = useState('6713b902a6c1f8602abfb9b4');
  const [message, setMessage] = useState('');
  const [person1, setPerson1] = useState('');
  const [userName, setUserName] = useState(userNameMessage);
  const [connectName, setConnctname] = useState('abc');
  const [addFlag, setAddFlag] = useState(false);
  const refer = useRef(null);

  function submitted(e) {
    e.preventDefault();
    setConvo([...convo, { person: person1, personConvo: message }]);
    axios.put(`https://chatbox-backend-1-46yg.onrender.com/user/update/${messageId}`, { updatedMessage: message, personCon: userName })
      .then((res) => console.log("success"))
      .then(error => console.log(error))

    axios.get(`https://chatbox-backend-1-46yg.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });
    console.log(message);
    setMessage('');
  }


  useEffect(() => {
    refer.current?.scrollIntoView({ behaviour: "smooth" });
    axios.get(`https://chatbox-backend-1-46yg.onrender.com/user/fetch/${userName}`)
      .then(response => { setContact(response.data); });

  }, [convo, addFlag]);

  return (
    <div className='frame' >
      <div className='container'>
        <div className='contactDiv'>
          {contact.map(contacts => (
            <div key={contacts._id}>
              {
                userName == contacts.person1 &&
                <button className='contact' onClick={() => { setMessageId(contacts._id); setConvo(contacts.convo); console.log(convo); setPerson1(contacts.person1) }}>{contacts.person2}</button>
              }
              {
                userName == contacts.person2 &&
                <button className='contact' onClick={() => { setMessageId(contacts._id); setConvo(contacts.convo); console.log(convo); setPerson1(contacts.person1) }}>{contacts.person1}</button>
              }
            </div>
          )
          )}
          {/* <form>
          <input type="text" value={connectName} onChange={(e)=>{e.preventDefault();setConnctname(e.target.value);}}></input>
          <button onClick={console.log(connectName)}>submit</button>
          </form> */}
        </div>
        <div style={{ width: '1000px' }}>
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
                          <div ref={refer} className="messageContent" style={{ marginRight: "12px", backgroundColor: 'goldenrod', width: 'fit-content', marginBottom: '-62px', float: 'right', height: "38px" }}><h1>{mess.personConvo}</h1>
                          </div>
                        }
                        {userName !== mess.person &&
                          <div ref={refer} className="messageContent" style={{ marginLeft: "8px", backgroundColor: 'goldenrod', width: 'fit-content', marginBottom: '-62px', float: 'left', height: "38px" }}><h1>{mess.personConvo}</h1>
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
            <div style={{ marginTop: "99px" }} ></div>
          </div>
          <div>
            <form onSubmit={(e) => { submitted(e); }}>
              <input className='messageBox' type='text' value={message} onChange={(e) => { setMessage(e.target.value) }}></input>
            </form>
          </div>
        </div>
      </div>
      <div>
        <button className='AddConvo' onClick={() => { setAddFlag(!addFlag) }}></button>
        {addFlag &&
          <iframe className="iframeStyle" width="350px" height="500px" src='/contacts'></iframe>
        }
      </div>
    </div>
  )
}

export default message;

