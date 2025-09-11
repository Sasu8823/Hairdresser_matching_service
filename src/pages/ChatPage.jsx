import React, { useState, useEffect, useRef } from "react";

export default function ChatPage({ user, matchingId }) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (matchingId) {
      fetchMessages();
      // 定期的にメッセージを更新（簡易的なリアルタイム機能）
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [matchingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/chat/${matchingId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        
        // 既読にする
        if (data.length > 0) {
          markAsRead();
        }
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`${apiUrl}/api/chat/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matching_id: matchingId,
          user_id: user.id || 1
        }),
      });
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matching_id: matchingId,
          sender_id: user.id || 1,
          message: messageText,
          message_type: 'text'
        }),
      });

      if (response.ok) {
        // メッセージを即座に表示（楽観的更新）
        const tempMessage = {
          id: Date.now(), // 一時的なID
          sender_id: user.id || 1,
          sender_name: user.displayName || user.name,
          sender_avatar: user.pictureUrl || user.avatar_url,
          message: messageText,
          message_type: 'text',
          is_read: false,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMessage]);
        
        // 実際のメッセージを再取得
        setTimeout(fetchMessages, 500);
      } else {
        const error = await response.json();
        alert(error.error || "メッセージの送信に失敗しました。");
        setNewMessage(messageText); // 失敗した場合はメッセージを復元
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert("エラーが発生しました。");
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <div className="chat-loading">メッセージを読み込み中...</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>チャット</h3>
        <button 
          className="close-chat-btn"
          onClick={() => window.history.back()}
        >
          ×
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>まだメッセージがありません。</p>
            <p>最初のメッセージを送信してみましょう！</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender_id === (user.id || 1) ? 'own' : 'other'}`}
            >
              <div className="message-content">
                <div className="message-avatar">
                  <img 
                    src={message.sender_avatar || "/default-avatar.png"} 
                    alt={message.sender_name}
                  />
                </div>
                <div className="message-bubble">
                  <div className="message-text">{message.message}</div>
                  <div className="message-time">{formatTime(message.created_at)}</div>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <div className="chat-input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="chat-input"
            disabled={sending}
          />
          <button 
            type="submit" 
            className="send-btn"
            disabled={!newMessage.trim() || sending}
          >
            {sending ? "送信中..." : "送信"}
          </button>
        </div>
      </form>
    </div>
  );
}
