import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import MonacoEditor from '@monaco-editor/react';

const BACKEND_URL = 'http://localhost:4000';

function App() {
  const [sessionId, setSessionId] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [socket, setSocket] = useState(null);

  // Create session
  const createSession = async () => {
    const res = await fetch(`${BACKEND_URL}/session`, { method: 'POST' });
    const data = await res.json();
    setSessionId(data.sessionId);
    window.history.replaceState(null, '', `/session/${data.sessionId}`);
  };

  // Join session
  useEffect(() => {
    const pathSessionId = window.location.pathname.split('/session/')[1];
    if (pathSessionId) setSessionId(pathSessionId);

    const s = io(BACKEND_URL);
    setSocket(s);

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (socket && sessionId) {
      socket.emit('joinSession', { sessionId });

      socket.on('codeUpdate', ({ code, language }) => {
        setCode(code);
        setLanguage(language);
      });
    }
  }, [socket, sessionId]);

  // Handle code change
  const handleCodeChange = (value) => {
    setCode(value);
    if (socket && sessionId) {
      socket.emit('codeChange', { sessionId, code: value, language });
    }
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (socket && sessionId) {
      socket.emit('codeChange', { sessionId, code, language: e.target.value });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Online Coding Interview Platform</h1>
      {!sessionId && <button onClick={createSession}>Create Interview Session</button>}
      {sessionId && (
        <>
          <p>
            Share this link: <b>{window.location.origin}/session/{sessionId}</b>
          </p>
          <select value={language} onChange={handleLanguageChange}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          <MonacoEditor
            height="400px"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
          />
        </>
      )}
    </div>
  );
}

export default App;