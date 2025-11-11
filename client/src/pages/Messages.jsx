// src/pages/Messages.jsx
// src/pages/Messages.jsx
import React, { useEffect, useState, useRef } from 'react';
import { getConversations, getMessages, sendMessage } from '../services/api';
import { getStoredUser } from '../services/auth';
import './Messages.css';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const user = getStoredUser();
  const chatBodyRef = useRef(null); // for auto-scroll
  const sendingRef = useRef(false);

  // normalize current user id for robust comparisons
  const myId = user?.id || user?._id || null;

  // helper to scroll to bottom
  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  // Fetch all conversations
  const loadConversations = async () => {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  };

  // Fetch messages for a given partner (partner = other user's id)
  const loadMessages = async (partnerId) => {
    if (!partnerId) return[];
    try {
      const data = await getMessages(partnerId);
      setMessages(data);
      setTimeout(scrollToBottom, 50); // scroll after loading
      return data;
    } catch (err) {
      console.error('Failed to load messages', err);
      return [];
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // helper: get participant id string from participant entry (object or string)
  const participantId = (p) => (typeof p === 'string' ? p : (p?._id || p?.id || ''));

  // helper: get participant display name
  const participantDisplayName = (p) => {
    if (!p) return null;
    if (typeof p === 'string') return p;
    return p.name || p.fullName || p.username || p.phone || participantId(p) || null;
  };

  // helper: derive partner user id (other participant) from a conversation object
  const getPartnerIdFromConv = (conv) => {
    if (!conv) return null;
    const participants = Array.isArray(conv.participants) ? conv.participants : [];
    const other = participants.find(p => String(participantId(p)) !== String(myId));
    if (!other) return null;
    return typeof other === 'string' ? other : (other._id || other.id || null);
  };

  // When selectedConv changes: load messages for the partner user and start polling
  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      return;
    }

    const partnerId = getPartnerIdFromConv(selectedConv);
    if (!partnerId) {
      console.warn('No partnerId found for selected conversation', selectedConv);
      setMessages([]);
      return;
    }

    // load messages for partner user
    loadMessages(partnerId);

    const interval = setInterval(() => loadMessages(partnerId), 10000);
    return () => clearInterval(interval);
  }, [selectedConv]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async (e) => {
  e.preventDefault();
  if (!text.trim() || !selectedConv) return;

  // prevent re-entrancy/double submit (fast clicks / double Enter)
  if (sendingRef.current) return;
  sendingRef.current = true;

  const trimmed = text.trim();

  const newMessage = {
    _id: `tmp-${Date.now()}`, // temporary ID
    text: trimmed,
    sender: myId,
    createdAt: new Date().toISOString(),
  };

  // Optimistically add message to UI
  setMessages((prev) => [...prev, newMessage]);
  setText('');
  setTimeout(scrollToBottom, 50);

  setLoading(true);
  try {
    const partnerId = getPartnerIdFromConv(selectedConv);
    if (!partnerId) throw new Error('Partner id not found for this conversation');

    // Send once
    await sendMessage(partnerId, trimmed);

    // replace optimistic messages with server state (no duplicates)
    // loadMessages now returns server data
    const serverData = await loadMessages(partnerId);
    // serverData replaces messages (loadMessages already set state),
    // but in case you want to ensure serverData contains the latest:
    if (Array.isArray(serverData) && serverData.length) {
      setMessages(serverData);
    }
  } catch (err) {
    console.error('Send failed', err);
    // remove optimistic message if send failed
    setMessages((prev) => prev.filter((m) => m._id !== newMessage._id));
  } finally {
    setLoading(false);
    sendingRef.current = false; // release guard
    setTimeout(scrollToBottom, 100);
  }
};


  return (
    <div className="messages-page">
      <aside className="conv-list">
        <h3>Conversations</h3>
        {conversations.length === 0 ? (
          <p>No conversations yet.</p>
        ) : (
          <ul>
            {conversations.map((conv) => {
              const participants = Array.isArray(conv.participants) ? conv.participants : [];
              // find other participants (exclude me) and prefer one with a name
              const others = participants.filter(p => String(participantId(p)) !== String(myId));
              let partner = others.find(p => typeof p !== 'string' && (p.name || p.fullName || p.username));
              if (!partner) partner = others[0] || participants[0] || null;
              const partnerName = participantDisplayName(partner) || `User (${conv._id})`;

              return (
                <li
                  key={conv._id}
                  className={selectedConv?._id === conv._id ? 'active' : ''}
                  onClick={() => setSelectedConv(conv)}
                >
                  <strong>{partnerName}</strong>
                  <span className="last-msg">{conv.lastMessage?.text}</span>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <section className="chat-area">
        {selectedConv ? (
          <>
            <header className="chat-header">
              <h4>
                Chat with{' '}
                {(() => {
                  const participants = Array.isArray(selectedConv.participants) ? selectedConv.participants : [];
                  const others = participants.filter(p => String(participantId(p)) !== String(myId));
                  let partner = others.find(p => typeof p !== 'string' && (p.name || p.fullName || p.username));
                  if (!partner) partner = others[0] || participants[0] || null;
                  return participantDisplayName(partner) || 'Unknown';
                })()}
              </h4>
            </header>

            <div className="chat-body" ref={chatBodyRef}>
              {messages.map((m) => {
                // determine sender id robustly (m.sender may be id string or object)
                const senderId = (m.sender && (m.sender._id || m.sender.id)) || m.sender || m.senderId || null;
                const isOwn = myId && String(senderId) === String(myId);
                return (
                  <div
                    key={m._id}
                    className={`msg-bubble ${isOwn ? 'own' : ''}`}
                  >
                    <p>{m.text}</p>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSend} className="chat-input">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Messages;
