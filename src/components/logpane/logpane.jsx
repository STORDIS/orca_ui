import { useState, useEffect } from 'react';

const LogViewer = (props) => {
  const [text, setText] = useState('');
  const log_txt=props.log
  useEffect(() => {
    addLogMessage(log_txt);
  }, [log_txt]);

  const addLogMessage = (message) => {
    setText((prevLogs) => [message + "\n" + prevLogs]);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const clearLog = () => {
    setText('');
    props.setLog([]);
  };

  return (
    <div>
      <textarea
        rows={5}
        cols={200}
        value={text}
        onChange={handleTextChange}
        readOnly
      />
      <br />
      <button onClick={clearLog}>clearLog</button>
    </div>
  );
};

export default LogViewer;
