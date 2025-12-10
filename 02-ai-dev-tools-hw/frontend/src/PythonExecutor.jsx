// src/PythonExecutor.jsx
import React, { useState, useEffect } from 'react';

export default function PythonExecutor({ code }) {
  const [output, setOutput] = useState('');
  const [pyodide, setPyodide] = useState(null);

  useEffect(() => {
    // Load Pyodide only once
    const loadPyodide = async () => {
      if (!window.loadPyodide) {
        // Load the Pyodide script from CDN
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/pyodide.js";
        script.onload = async () => {
          const pyodideInstance = await window.loadPyodide();
          setPyodide(pyodideInstance);
        };
        document.body.appendChild(script);
      } else {
        const pyodideInstance = await window.loadPyodide();
        setPyodide(pyodideInstance);
      }
    };
    loadPyodide();
  }, []);

  const runPython = async () => {
    if (!pyodide) {
      setOutput('Pyodide is still loading...');
      return;
    }
    try {
      // Redirect Python stdout to a variable
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
      pyodide.runPython(code);
      const result = pyodide.runPython('sys.stdout.getvalue()');
      setOutput(result);
    } catch (err) {
      setOutput(err.toString());
    }
  };

  return (
    <div>
      <button onClick={runPython}>Run Python</button>
      <pre>{output}</pre>
    </div>
  );
}