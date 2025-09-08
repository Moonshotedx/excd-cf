import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const Welcome = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const generateSessionId = () => {
    // Generate a UUID-like string
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const parseSessionCode = (input: string) => {
    const trimmedInput = input.trim();

    // Check if it's a URL
    if (trimmedInput.includes("/excalidraw/")) {
      const match = trimmedInput.match(/\/excalidraw\/([^/?#]+)/);
      return match ? match[1] : null;
    }

    // If it's not a URL, treat it as a session code
    return trimmedInput || null;
  };

  const handleEnterSession = () => {
    const sessionCode = parseSessionCode(inputValue);
    if (sessionCode) {
      navigate({ to: "/excalidraw/$id", params: { id: sessionCode } });
    }
  };

  const handleNewSession = () => {
    const newSessionId = generateSessionId();
    navigate({ to: "/excalidraw/$id", params: { id: newSessionId } });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnterSession();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Welcome to DrawX
        </h1>

        <p
          style={{
            fontSize: "1.1rem",
            color: "#666",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          Create and collaborate on diagrams, sketches, and visual ideas in
          real-time.
        </p>

        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter link or session code"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "2px solid #e5e7eb",
              fontSize: "1rem",
              marginBottom: "1rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#4f46e5";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          />

          <div
            style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
          >
            <button
              onClick={handleEnterSession}
              disabled={!inputValue.trim()}
              style={{
                backgroundColor: inputValue.trim() ? "#4f46e5" : "#9ca3af",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontSize: "1.1rem",
                fontWeight: "500",
                cursor: inputValue.trim() ? "pointer" : "not-allowed",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (inputValue.trim()) {
                  e.currentTarget.style.backgroundColor = "#4338ca";
                }
              }}
              onMouseLeave={(e) => {
                if (inputValue.trim()) {
                  e.currentTarget.style.backgroundColor = "#4f46e5";
                }
              }}
            >
              Enter Session
            </button>

            <button
              onClick={handleNewSession}
              style={{
                backgroundColor: "#10b981",
                color: "white",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontSize: "1.1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#059669";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#10b981";
              }}
            >
              Create New Session
            </button>
          </div>
        </div>

        <p
          style={{
            fontSize: "0.9rem",
            color: "#888",
            margin: 0,
          }}
        >
          Enter a session link or code to join an existing session, or create a
          new one to start drawing.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
