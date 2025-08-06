import React, { useState } from 'react';

function ChatBox() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: 'user', text: input };
    const botReply = {
      from: 'bot',
      text: `"${input}"에 대한 답변을 준비 중이에요!`,
    };

    setMessages([...messages, userMsg, botReply]);
    setInput('');
  };

  return (
    <>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          minHeight: '300px',
          marginBottom: '20px',
          background: '#f9f9f9',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.from === 'user' ? 'right' : 'left',
              marginBottom: '10px',
            }}
          >
            <strong>{msg.from === 'user' ? '나' : 'AI'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary" onClick={handleSend}>
          보내기
        </button>
      </div>
    </>
  );
}

export default ChatBox;
