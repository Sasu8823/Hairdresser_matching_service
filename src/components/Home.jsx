import React, { useEffect } from "react";

export default function HomePage() {
    useEffect(() => {
        console.log("HomePage loaded");
    }, []);

    return <div className="home-container">Welcome to Hairdresser Matching</div>;
}