import { useState, useEffect } from 'react';

const LogViewer = (props) => {
  const [text, setText] = useState('');
  //one each render add to the log message the log coming in props
  useEffect(() => {
    console.log(props);
    addLogMessage(props.log);
  }, [props, props.log]);

  const addLogMessage = (message) => {
    setText((prevLogs) => [message + "\n" + prevLogs]);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const clearLog = () => {
    setText('');
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
