import React, { useState, useEffect } from "react";
import ChatPage from "./ChatPage.jsx";

export default function MatchingList({ user }) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [matchings, setMatchings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatching, setSelectedMatching] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMatchings();
    }
  }, [user]);

  const fetchMatchings = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/matchings/${user.id || 1}`);
      if (response.ok) {
        const data = await response.json();
        setMatchings(data);
      }
    } catch (error) {
      console.error('Failed to fetch matchings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (matchingId) => {
    try {
      const response = await fetch(`${apiUrl}/api/create-commission-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matching_id: matchingId,
          user_id: user.id || 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.payment_required) {
          // Stripe決済ページにリダイレクト
          window.location.href = data.url;
        } else {
          alert(data.message);
          fetchMatchings(); // 一覧を更新
        }
      } else {
        const error = await response.json();
        alert(error.error || "決済の開始に失敗しました。");
      }
    } catch (error) {
      console.error('Error starting payment:', error);
      alert("エラーが発生しました。");
    }
  };

  const handleConfirmMatching = async (matchingId) => {
    try {
      const response = await fetch(`${apiUrl}/api/confirm-matching`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matching_id: matchingId,
          user_id: user.id || 1
        }),
      });

      if (response.ok) {
        alert("マッチングを確認しました！");
        fetchMatchings(); // 一覧を更新
      } else {
        const error = await response.json();
        alert(error.error || "確認に失敗しました。");
      }
    } catch (error) {
      console.error('Error confirming matching:', error);
      alert("エラーが発生しました。");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'matched': return '#FFA500';
      case 'confirmed': return '#32CD32';
      case 'completed': return '#4169E1';
      case 'cancelled': return '#DC143C';
      default: return '#808080';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'matched': return 'マッチング成立';
      case 'confirmed': return '確認済み';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="matching-list-container">
      <h1>マッチング一覧</h1>
      
      {matchings.length === 0 ? (
        <div className="no-matchings">
          <p>まだマッチングがありません。</p>
        </div>
      ) : (
        <div className="matchings-grid">
          {matchings.map((matching) => (
            <div key={matching.id} className="matching-card">
              <div className="matching-header">
                <div className="status-badge" style={{ backgroundColor: getStatusColor(matching.status) }}>
                  {getStatusText(matching.status)}
                </div>
                <div className="matching-date">
                  {new Date(matching.matched_at).toLocaleDateString('ja-JP')}
                </div>
              </div>

              <div className="matching-content">
                <h3>{matching.menu}</h3>
                
                <div className="participants">
                  <div className="participant">
                    <img 
                      src={matching.customer_avatar || "/default-avatar.png"} 
                      alt="customer" 
                      className="participant-avatar"
                    />
                    <div>
                      <h4>お客様</h4>
                      <p>{matching.customer_name}</p>
                    </div>
                  </div>
                  
                  <div className="participant">
                    <img 
                      src={matching.stylist_avatar || "/default-avatar.png"} 
                      alt="stylist" 
                      className="participant-avatar"
                    />
                    <div>
                      <h4>施術者</h4>
                      <p>{matching.stylist_name}</p>
                    </div>
                  </div>
                </div>

                <div className="matching-details">
                  <p><strong>日時:</strong> {matching.date} {matching.time}</p>
                  <p><strong>エリア:</strong> {matching.area}</p>
                  <p><strong>リクエスト価格:</strong> ¥{matching.price.toLocaleString()}</p>
                  <p><strong>オファー価格:</strong> ¥{matching.offer_price.toLocaleString()}</p>
                  <p><strong>予想時間:</strong> {matching.estimated_duration}分</p>
                  <p><strong>場所:</strong> {matching.location_type === 'salon' ? 'サロン' : matching.location_type === 'home' ? '出張' : 'スタジオ'}</p>
                  {matching.location_address && <p><strong>住所:</strong> {matching.location_address}</p>}
                  {matching.offer_message && <p><strong>メッセージ:</strong> {matching.offer_message}</p>}
                </div>

                <div className="commission-info">
                  <p><strong>手数料:</strong> 
                    {matching.is_free ? "無料" : `¥${matching.commission_amount.toLocaleString()}`}
                  </p>
                  <p><strong>決済状況:</strong> 
                    {matching.commission_paid ? "✅ 完了" : "❌ 未決済"}
                  </p>
                </div>
              </div>

              <div className="matching-actions">
                {matching.status === 'matched' && !matching.commission_paid && (
                  <button 
                    className="payment-btn"
                    onClick={() => handlePayment(matching.id)}
                  >
                    {matching.is_free ? "確認する" : `¥${matching.commission_amount.toLocaleString()}を支払う`}
                  </button>
                )}
                
                {matching.status === 'matched' && matching.commission_paid && (
                  <button 
                    className="confirm-btn"
                    onClick={() => handleConfirmMatching(matching.id)}
                  >
                    マッチングを確認
                  </button>
                )}
                
                {matching.status === 'confirmed' && (
                  <div className="confirmed-status">
                    <p>✅ マッチング確認済み</p>
                    <p>チャット機能が利用可能です</p>
                    <button 
                      className="chat-btn"
                      onClick={() => setSelectedMatching(matching)}
                    >
                      チャットを開く
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMatching && (
        <div className="chat-modal">
          <div className="chat-modal-content">
            <ChatPage 
              user={user} 
              matchingId={selectedMatching.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
