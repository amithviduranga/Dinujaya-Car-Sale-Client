import React, { useState, useEffect, useRef } from 'react';
import './AdminChat.css';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { firestore } from '../../../../firebaseConfig';
import { collection, onSnapshot, query, orderBy, where, Timestamp, addDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const AdminChatComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    const q = query(collection(firestore, 'chatMessages'), orderBy('sentTime'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data().sender);
      const uniqueUsers = [...new Set(usersData)];
      const filteredUsers = uniqueUsers.filter(user => user !== 'admin');
      setUsers(filteredUsers);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const userMessagesQuery = query(
        collection(firestore, 'chatMessages'),
        where('sender', '==', selectedUser)
      );

      const receivedMessagesQuery = query(
        collection(firestore, 'chatMessages'),
        where('recipient', '==', selectedUser)
      );

      const unsubscribeUserMessages = onSnapshot(userMessagesQuery, (snapshot) => {
        const userMessagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(prevMessages => {
          const combinedMessages = [...prevMessages.filter(m => m.sender !== selectedUser), ...userMessagesData];
          return combinedMessages.sort((a, b) => a.sentTime.toDate() - b.sentTime.toDate());
        });
      });

      const unsubscribeReceivedMessages = onSnapshot(receivedMessagesQuery, (snapshot) => {
        const receivedMessagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(prevMessages => {
          const combinedMessages = [...prevMessages.filter(m => m.recipient !== selectedUser), ...receivedMessagesData];
          return combinedMessages.sort((a, b) => a.sentTime.toDate() - b.sentTime.toDate());
        });
      });

      return () => {
        unsubscribeReceivedMessages();
        unsubscribeUserMessages();
        
      };
    }
  }, [selectedUser]);

  useEffect(() => {
    // Scroll to bottom of chat messages on selectedUser change or new message
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, selectedUser]);

  const sendMessage = async () => {
    if (!selectedUser || replyMessage.trim() === '') return;

    const message = {
      sender: 'admin',
      recipient: selectedUser,
      text: replyMessage,
      sentTime: Timestamp.now()
    };

    try {
      await addDoc(collection(firestore, 'chatMessages'), message);
      setReplyMessage('');
      console.log('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply: ', error);
    }
  };

  console.log("user",messages)
  return (
    <div className="admin-chat-container">
      
      <div className="user-list">
      <div className="user-list-header">
      <FontAwesomeIcon icon={faComments} style={{ fontSize:30,marginLeft:10, marginRight: '12px' }} />
          All Chats
        </div>
        {users.map((user) => (
          <div
        
            className={`user-item ${selectedUser === user ? 'selected' : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            <Avatar src={user.avatar} /> {/* Assuming user.avatar contains the URL to the avatar */}
            <span className="username">{user}</span>
          </div>
        ))}
      </div>
      <div className="chat-box">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <div className="selected-user-bar">
                <Avatar className="avatar" icon={<UserOutlined />} />
                <span className='userName'>{selectedUser}</span>
              </div>
            </div>
            <div className="chat-messages" ref={chatMessagesRef}>
              {messages.map((message, index) => (
                <div key={index} className={`adminmessage ${message.sender === selectedUser ? 'admin' : 'user'}`}>
                  <Avatar style={{ width: 40, height: 40, fontSize: 25 }} className="avatar" icon={message.sender === selectedUser ? <UserOutlined /> : <FontAwesomeIcon icon={faHeadset} />} />
                  <div className="message-content-wrapper">
                    <div className={`message-content ${message.sender === selectedUser ? 'admin' : 'user'}`}>
                      <p>{message.text}</p>
                    </div>
                    <span className="amessage-time">
                      {message.sentTime instanceof Timestamp
                        ? message.sentTime.toDate().toLocaleString()
                        : new Date(message.sentTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="reply-section">
              <input
                type="text"
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="no-user-selected">Select a user to view the chat</div>
        )}
      </div>
    </div>
  );
};

export default AdminChatComponent;
