import { ConstructionSharp } from '@mui/icons-material';
import React, { useState,useRef } from 'react';



const LogViewer = ({}) => {
  const [lines, setLines] = useState(5); // Default number of lines
  const [text, setText] = useState('');

  const addLogMessage = (message) => {
    setText((prevLogs) => [...prevLogs, message]);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleLinesChange = (event) => {
    setLines(parseInt(event.target.value, 10));
  };

  const rotateLines = () => {
    const textArray = text.split('\n');
    const additionalLines = textArray.slice(lines);
    const rotatedText = [...additionalLines, ...textArray.slice(0, lines)].join('\n');
    setText(rotatedText);
  };

  return (
    <div>
      <textarea
        rows={lines}
        cols={50}
        value={text}
        onChange={handleTextChange}
        readOnly
      />
      <br />
      <select value={lines} onChange={handleLinesChange}>
        <option value={5}>5 lines</option>
        <option value={10}>10 lines</option>
        <option value={15}>15 lines</option>
        {/* Add more options as needed */}
      </select>
      <button onClick={rotateLines}>Rotate</button>
    </div>
  );
};

export default LogViewer;
