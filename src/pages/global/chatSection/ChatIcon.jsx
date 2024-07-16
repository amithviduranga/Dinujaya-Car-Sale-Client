import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { CommentOutlined } from '@ant-design/icons';
import { Icon } from 'antd';
import ChatBox from './ChatBox'; // Assuming you have a ChatBox component

const ChatIcon = () => {
  const [showChatBox, setShowChatBox] = useState(false);

  const toggleChatBox = () => {
    setShowChatBox(!showChatBox);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '1000', // Ensure it's above other content
    }}>
 {showChatBox && <ChatBox onClose={() => setShowChatBox(false)} />}
      <span style={{ marginRight: '10px', fontSize:15}}>Chat with us</span>
      <CommentOutlined style={{ fontSize: '44px', cursor: 'pointer', color:'green'}} onClick={toggleChatBox} />
    </div>
  );
};

export default ChatIcon;
