import { useState, useEffect } from 'react';
import './App.css';
const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json' 
  }
} 
export default function App() {
  const [items, setItems] = useState([])
  const [hasData, setHasData] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true', options)
    .then((response) => response.json())
    .then((json) => {setItems(json.data); setHasData(true); console.log(json)});
  },[])

  if(!hasData){
    return(
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Adjust this value if needed
      }}>
        <img style={{    
          display: "block",
          }} 
          src='https://media.tenor.com/HEPktnyoNAgAAAAi/loading.gif'></img>
      </div>
    )
  }
  const playVoiceLine = (waveUrl) => {
    const audioElement = new Audio(waveUrl);
    audioElement.play().then(() => {
      setAudioPlaying(true);
    });
  };

  const stopVoiceLine = () => {
    const audioElements = document.getElementsByTagName('audio');
    for (let i = 0; i < audioElements.length; i++) {
      audioElements[i].pause();
      audioElements[i].currentTime = 0;
    }
    setAudioPlaying(false);
  };
  return (
    <>
      <h1 className='title'>Valorant Agents</h1>
      <div className='container'>
        {items.map((item) => (
          <ul key={item.uuid} 
          className="agent-item">
            <li>
              <img style={{position: "relative", top: -20, left: 30, width: "400px", height: "65%"}} src= {item.background}></img>
              <img className='player-id' 
              src={item.fullPortraitV2}
              onMouseEnter={() => playVoiceLine(item.voiceLine.mediaList[0].wave)}
              onMouseLeave={() => stopVoiceLine()}>
              </img>
              <p className='desc'>{item.description}</p>
              <p className='display-name'>{item.displayName}</p>
              <audio id={`audio-${item.uuid}`}>
                <source src={item.voiceLine.mediaList[0].wave} type='audio/wav' />
            </audio>
            </li>
          </ul>
        ))}
      </div>
    </>
  );
}
