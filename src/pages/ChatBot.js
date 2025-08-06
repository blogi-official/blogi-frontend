import React from 'react';
import ChatBox from '../components/ChatBox';

function ChatBot() {
  return (
    <div className="container my-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center">🤖 AI 대화</h2>
      <ChatBox />
    </div>
  );
}

export default ChatBot;
