import React from "react";
import "./Header.css"; // optional separate styling


const Header = () => {
  return (
    <header className="header">
      <div className="container header-content">
        <h1 className="logo">Salomo</h1>
        <nav className="nav">
          <a href="/">ホーム</a>
          <a href="/stylists">スタイリスト</a>
          <a href="/about">について</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
