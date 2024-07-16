import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import { Avatar } from 'antd';
import { UserOutlined,CommentOutlined} from '@ant-design/icons';
import { firestore } from '../../../firebaseConfig'; 
import { collection, addDoc, onSnapshot, orderBy, query, where, Timestamp } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset  } from '@fortawesome/free-solid-svg-icons';
import { faComments  } from '@fortawesome/free-solid-svg-icons';

const ChatBox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userName = localStorage.getItem("userName");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const userMessagesQuery = query(
      collection(firestore, 'chatMessages'),
      where('sender', '==', userName)
    );

    const receivedMessagesQuery = query(
      collection(firestore, 'chatMessages'),
      where('recipient', '==', userName)
    );

    const unsubscribeUserMessages = onSnapshot(userMessagesQuery, (snapshot) => {
      const userMessagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(prevMessages => {
        const combinedMessages = [...prevMessages.filter(m => m.sender !== userName), ...userMessagesData];
        return combinedMessages.sort((a, b) => a.sentTime.toDate() - b.sentTime.toDate());
      });
    });

    const unsubscribeReceivedMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
      const receivedMessagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(prevMessages => {
        const combinedMessages = [...prevMessages.filter(m => m.recipient !== userName), ...receivedMessagesData];
        return combinedMessages.sort((a, b) => a.sentTime.toDate() - b.sentTime.toDate());
      });
    });

    return () => {
      unsubscribeUserMessages();
      unsubscribeReceivedMessages();
    };
  }, [userName]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const message = {
      text: newMessage,
      recipient: 'admin',
      sender: userName,
      sentTime: Timestamp.now()
    };

    try {
      await addDoc(collection(firestore, 'chatMessages'), message);
      setNewMessage('');
      console.log('Message sent successfully');
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-box-container">
      <div className="chat-header">
      <CommentOutlined style={{color:'white'}}/>
        <h3>Live Chat</h3>
        
        <button onClick={onClose}>Close</button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === userName ? 'user' : 'admin'}`}
          >
            <Avatar className="avatar" icon={message.sender === userName ? <UserOutlined />: <FontAwesomeIcon icon={faHeadset } />} />
            <div className="message-content-wrapper">
              <div className="message-content">
                <p>{message.text}</p>
              </div>
              <span className="message-time">
                {message.sentTime instanceof Timestamp 
                  ? message.sentTime.toDate().toLocaleString() 
                  : new Date(message.sentTime).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
