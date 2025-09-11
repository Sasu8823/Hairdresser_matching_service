import React, { useState, useEffect } from "react";

export default function RequestList({ user }) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState({
    offer_price: "",
    offer_message: "",
    estimated_duration: "",
    location_type: "salon",
    location_address: ""
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/requests`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async (requestId) => {
    try {
      const response = await fetch(`${apiUrl}/api/offers/${requestId}`);
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    fetchOffers(request.id);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...offerForm,
          request_id: selectedRequest.id,
          stylist_id: user.id || 1, // 仮のID
          offer_price: parseInt(offerForm.offer_price)
        }),
      });

      if (response.ok) {
        alert("オファーを送信しました！");
        setShowOfferForm(false);
        setOfferForm({
          offer_price: "",
          offer_message: "",
          estimated_duration: "",
          location_type: "salon",
          location_address: ""
        });
        fetchOffers(selectedRequest.id);
      } else {
        const error = await response.json();
        alert(error.error || "オファーの送信に失敗しました。");
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert("エラーが発生しました。");
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!user) {
      alert("ログインが必要です。");
      return;
    }

    if (!confirm("このオファーを受け入れますか？マッチングが成立します。")) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/accept-offer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer_id: offerId,
          customer_id: user.id || 1 // 仮のID
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setSelectedRequest(null);
        fetchRequests(); // リクエスト一覧を更新
      } else {
        const error = await response.json();
        alert(error.error || "オファーの受け入れに失敗しました。");
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert("エラーが発生しました。");
    }
  };

  const getRankColor = (rankCode) => {
    switch (rankCode) {
      case 'S': return '#FFD700';
      case 'A': return '#C0C0C0';
      case 'B': return '#CD7F32';
      case 'C': return '#808080';
      default: return '#808080';
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="request-list-container">
      <h1>施術希望一覧</h1>
      
      <div className="requests-grid">
        {requests.map((request) => (
          <div 
            key={request.id} 
            className="request-card"
            onClick={() => handleRequestClick(request)}
          >
            <div className="request-header">
              <div className="customer-info">
                <img 
                  src={request.customer_avatar || "/default-avatar.png"} 
                  alt="customer" 
                  className="customer-avatar"
                />
                <span className="customer-name">{request.customer_name}</span>
              </div>
              <div 
                className="rank-badge"
                style={{ backgroundColor: getRankColor(request.rank_code) }}
              >
                {request.rank_code}ランク
              </div>
            </div>
            
            <div className="request-content">
              <h3>{request.menu}</h3>
              <div className="request-details">
                <p><strong>日時:</strong> {request.date} {request.time}</p>
                <p><strong>予算:</strong> ¥{request.price.toLocaleString()}</p>
                <p><strong>エリア:</strong> {request.area}</p>
                {request.is_model_work && <span className="type-badge model">モデル施術</span>}
                {request.is_wedding && <span className="type-badge wedding">結婚式</span>}
                {request.is_photo_shoot && <span className="type-badge photo">撮影</span>}
              </div>
              {request.condition && (
                <p className="condition"><strong>条件:</strong> {request.condition}</p>
              )}
              {request.note && (
                <p className="note"><strong>備考:</strong> {request.note}</p>
              )}
            </div>
            
            <div className="request-footer">
              <span className="commission-info">
                {request.is_free ? "無料案件" : `手数料: ¥500 (${request.commission_rate}%)`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>オファー詳細</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedRequest(null)}
              >
                ×
              </button>
            </div>
            
            <div className="request-detail">
              <h3>{selectedRequest.menu}</h3>
              <p><strong>顧客:</strong> {selectedRequest.customer_name}</p>
              <p><strong>日時:</strong> {selectedRequest.date} {selectedRequest.time}</p>
              <p><strong>予算:</strong> ¥{selectedRequest.price.toLocaleString()}</p>
              <p><strong>エリア:</strong> {selectedRequest.area}</p>
            </div>

            <div className="offers-section">
              <h3>オファー一覧</h3>
              {offers.length > 0 ? (
                <div className="offers-list">
                  {offers.map((offer) => (
                    <div key={offer.id} className="offer-card">
                      <div className="stylist-info">
                        <img 
                          src={offer.stylist_avatar || "/default-avatar.png"} 
                          alt="stylist" 
                          className="stylist-avatar"
                        />
                        <div>
                          <h4>{offer.stylist_name}</h4>
                          <p>★ {offer.rating || "0.0"} ({offer.experience_years || 0}年経験)</p>
                        </div>
                      </div>
                      <div className="offer-details">
                        <p><strong>オファー価格:</strong> ¥{offer.offer_price.toLocaleString()}</p>
                        <p><strong>予想時間:</strong> {offer.estimated_duration}分</p>
                        <p><strong>場所:</strong> {offer.location_type === 'salon' ? 'サロン' : offer.location_type === 'home' ? '出張' : 'スタジオ'}</p>
                        {offer.location_address && <p><strong>住所:</strong> {offer.location_address}</p>}
                        {offer.offer_message && <p><strong>メッセージ:</strong> {offer.offer_message}</p>}
                      </div>
                      <div className="offer-actions">
                        <button 
                          className="accept-offer-btn"
                          onClick={() => handleAcceptOffer(offer.id)}
                        >
                          このオファーを受け入れる
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>まだオファーがありません。</p>
              )}
            </div>

            <div className="offer-form-section">
              <button 
                className="offer-btn"
                onClick={() => setShowOfferForm(!showOfferForm)}
              >
                {showOfferForm ? "オファーフォームを閉じる" : "オファーを送信"}
              </button>
              
              {showOfferForm && (
                <form onSubmit={handleOfferSubmit} className="offer-form">
                  <div className="form-group">
                    <label>
                      オファー価格:
                      <input
                        type="number"
                        value={offerForm.offer_price}
                        onChange={(e) => setOfferForm({...offerForm, offer_price: e.target.value})}
                        placeholder="例: 4500"
                        required
                      />
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      予想施術時間:
                      <input
                        type="number"
                        value={offerForm.estimated_duration}
                        onChange={(e) => setOfferForm({...offerForm, estimated_duration: e.target.value})}
                        placeholder="例: 120"
                        required
                      />
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      施術場所:
                      <select
                        value={offerForm.location_type}
                        onChange={(e) => setOfferForm({...offerForm, location_type: e.target.value})}
                      >
                        <option value="salon">サロン</option>
                        <option value="home">出張</option>
                        <option value="studio">スタジオ</option>
                      </select>
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      住所（出張の場合）:
                      <input
                        type="text"
                        value={offerForm.location_address}
                        onChange={(e) => setOfferForm({...offerForm, location_address: e.target.value})}
                        placeholder="出張の場合は住所を入力"
                      />
                    </label>
                  </div>
                  
                  <div className="form-group">
                    <label>
                      メッセージ:
                      <textarea
                        value={offerForm.offer_message}
                        onChange={(e) => setOfferForm({...offerForm, offer_message: e.target.value})}
                        placeholder="お客様へのメッセージ"
                        rows="3"
                      />
                    </label>
                  </div>
                  
                  <button type="submit" className="submit-offer-btn">オファーを送信</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}