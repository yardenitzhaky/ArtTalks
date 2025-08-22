// Realtime chat for an artwork using Socket.IO
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage } from '../types';
import './ChatInterface.css';

interface ChatInterfaceProps {
  artworkId: number;
}

// Random, human-readable username for anonymous users
const generateRandomUsername = (): string => {
  const adjectives = ['Creative', 'Artistic', 'Colorful', 'Vibrant', 'Inspiring', 'Elegant', 'Mystic', 'Bold', 'Serene', 'Dynamic'];
  const nouns = ['Artist', 'Dreamer', 'Painter', 'Viewer', 'Creator', 'Explorer', 'Wanderer', 'Observer', 'Admirer', 'Connoisseur'];
  const randomNum = Math.floor(Math.random() * 1000);
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective}${noun}${randomNum}`;
};

const getOrCreateUsername = (): string => {
  const storedUsername = localStorage.getItem('chatUsername');
  if (storedUsername) {
    return storedUsername;
  }
  const newUsername = generateRandomUsername();
  localStorage.setItem('chatUsername', newUsername);
  return newUsername;
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ artworkId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username] = useState(getOrCreateUsername());
  const [isConnected, setIsConnected] = useState(false);
  
  // Demo seed messages shown before any realtime messages arrive
  const sampleMessages: ChatMessage[] = [
    { id: -1, username: 'ArtLover42', message: 'Such a beautiful picture!', timestamp: new Date().toISOString() },
    { id: -2, username: 'Jorge410', message: 'Lorem Ipsum!', timestamp: new Date().toISOString() },
    { id: -3, username: 'sal89920', message: 'Indeed!', timestamp: new Date().toISOString() }
  ];

  useEffect(() => {
    // Connect and join the artwork-specific room
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join-discussion', artworkId);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('previous-messages', (previousMessages: ChatMessage[]) => {
      setMessages(previousMessages);
    });

    newSocket.on('new-message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // Leave room and close socket on unmount or artworkId change
    return () => {
      newSocket.emit('leave-discussion', artworkId);
      newSocket.close();
    };
  }, [artworkId]);

  // Send a message to the current artwork room
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send-message', {
      artworkId,
      message: newMessage.trim(),
      username: username.trim()
    });

    setNewMessage('');
  };

  // HH:MM local time for message timestamps
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Chat</h3>
        <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
        </span>
      </div>

      <div className="messages-container">
        {[...sampleMessages, ...messages].map((message) => (
          <div key={message.id} className={`message ${message.id < 0 ? 'sample-message' : ''}`}>
            <div className="message-header">
              <span className="message-username">{message.username}:</span>
              <span className="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            <div className="message-content">{message.message}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
          disabled={!isConnected}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!newMessage.trim() || !isConnected}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;