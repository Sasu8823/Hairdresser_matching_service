// src/components/CustomerForm.jsx
import React, { useState, useEffect } from "react";

export default function CustomerForm({ user }) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [form, setForm] = useState({
    menu: "",
    date: "",
    time: "",
    price: "",
    area: "",
    condition: "",
    note: "",
    is_model_work: false,
    is_wedding: false,
    is_photo_shoot: false,
  });
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [customerRanks, setCustomerRanks] = useState([]);
  const [selectedRank, setSelectedRank] = useState(null);

  useEffect(() => {
    fetchCustomerRanks();
  }, []);

  const fetchCustomerRanks = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/customer-ranks`);
      if (response.ok) {
        const ranks = await response.json();
        setCustomerRanks(ranks);
      }
    } catch (error) {
      console.error('Failed to fetch customer ranks:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));

    // 価格が変更されたらランクを自動判定
    if (name === 'price' && value) {
      const price = parseInt(value);
      const rank = customerRanks.find(r => 
        price >= r.min_budget && (r.max_budget === null || price <= r.max_budget)
      );
      setSelectedRank(rank);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage("ログインが必要です。");
      return;
    }

    // 最低価格チェック（4000円以上）
    if (parseInt(form.price) < 4000 && !form.is_model_work) {
      setMessage("通常の施術は4,000円以上でお願いします。");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customer_id: user.id || 1, // 仮のID、実際はLINEユーザーIDから取得
          price: parseInt(form.price)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("投稿が完了しました！");
        
        // フォームをリセット
        setForm({
          menu: "",
          date: "",
          time: "",
          price: "",
          area: "",
          condition: "",
          note: "",
          is_model_work: false,
          is_wedding: false,
          is_photo_shoot: false,
        });
        setSelectedRank(null);
      } else {
        setMessage("投稿に失敗しました。");
      }
    } catch (err) {
      console.error(err);
      setMessage("エラーが発生しました。");
    }
  };

  return (
    <div className="customer-form-container">
      <h1>SALOMO施術希望投稿</h1>

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label>
            希望メニュー:
            <textarea
              name="menu"
              value={form.menu}
              onChange={handleChange}
              placeholder="例: カット、カラー、パーマなど"
              required
            />
          </label>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              希望日:
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              希望時間帯:
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              予算:
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="例: 5000"
                min="0"
                required
              />
            </label>
            {selectedRank && (
              <div className={`rank-badge rank-${selectedRank.rank_code.toLowerCase()}`}>
                {selectedRank.rank_name} ({selectedRank.rank_code}ランク)
                {selectedRank.is_free && <span className="free-badge">無料</span>}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              エリア:
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                required
              >
                <option value="">エリアを選択</option>
                <option value="立川">立川</option>
                <option value="新宿">新宿</option>
                <option value="渋谷">渋谷</option>
                <option value="池袋">池袋</option>
                <option value="その他">その他</option>
              </select>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>
            施術タイプ:
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_model_work"
                  checked={form.is_model_work}
                  onChange={handleChange}
                />
                モデル施術
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_wedding"
                  checked={form.is_wedding}
                  onChange={handleChange}
                />
                結婚式・ヘアセット
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_photo_shoot"
                  checked={form.is_photo_shoot}
                  onChange={handleChange}
                />
                撮影モデル
              </label>
            </div>
          </label>
        </div>

        <div className="form-group">
          <label>
            条件:
            <input
              type="text"
              name="condition"
              value={form.condition}
              onChange={handleChange}
              placeholder="例: 来店希望、出張可など"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            備考:
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="その他のご要望があればお書きください"
            />
          </label>
        </div>

        <button type="submit" className="submit-btn">投稿する</button>
      </form>

      {message && <div className={`message ${message.includes('完了') ? 'success' : 'error'}`}>{message}</div>}

      {suggestions.length > 0 && (
        <div className="user-grid">
          {suggestions.map((user, idx) => (
            <div key={idx} className="user-card">
              <img
                src={user.avatar_url || "default-avatar.png"}
                className="user-avatar"
                alt="avatar"
              />
              <div className="user-label">{user.name}</div>
              <div className="user-rating">★ {user.rating || "0.0"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
