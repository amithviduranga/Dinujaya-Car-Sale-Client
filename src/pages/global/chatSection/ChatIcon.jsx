import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons';
import { CommentOutlined } from '@ant-design/icons';
import { Tag  } from 'antd';
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
 <Tag style={{boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.8)"}} color="#f50"><span style={{ marginRight: '10px', fontSize:16 ,fontWeight:500,}}>Chat with us</span></Tag>  
      <CommentOutlined style={{ fontSize: '44px', cursor: 'pointer', color:'green'}} onClick={toggleChatBox} />
    </div>
  );
};

export default ChatIcon;
