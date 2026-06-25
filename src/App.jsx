import { useState, useEffect, useRef } from 'react'
import './App.css'
import DeckList from './DeckList.jsx';
import DeckView from './DeckView.jsx';
import StudyView from './StudyView.jsx';

function App() 
{
  const [decks, setDecks] = useState(() => {
    try
    {
      const data = localStorage.getItem("decks");
      return data ? JSON.parse(data) : [];
    }

    catch(err)
    {
      return [];
    }
  });

  useEffect(() => { localStorage.setItem("decks", JSON.stringify(decks)); }, [decks]);

  const [selectedDeckId, setSelectedDeckId] = useState(() => {
    return localStorage.getItem("selectedDeckId") || null;
  });

  useEffect(() => {
    if(selectedDeckId === null)
    {
      localStorage.removeItem("selectedDeckId");
    } 
    
    else
    {
      localStorage.setItem("selectedDeckId", selectedDeckId);
    }
  }, [selectedDeckId]);

  const selectedDeck = decks.find(d => d.id === selectedDeckId);

  const [showStudyModal, setShowStudyModal] = useState(false);
  const [isStudying, setIsStudying] = useState(false);
  const [studyMode, setStudyMode] = useState(null);

  useEffect(() => {
    if(selectedDeck)
    {
      document.title = selectedDeck.name;
    } 
    
    else 
    {
      document.title = "Mora";
    }
  }, [selectedDeck]);

  const exportDecks = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      decks
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "mora-decks.json";
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const fileInputRef = useRef(null);

  const importDecks = () => {
    fileInputRef.current.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];

    if(!file)
    {
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try
      {
        const data = JSON.parse(event.target.result);

        if(!Array.isArray(data.decks))
        {
          alert("Invalid mora deck import file.");
          return;
        }

        setDecks(data.decks);
        e.target.value = "";
      }

      catch(err)
      {
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "Dark";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [collapsed, setCollapsed] = useState(true);
  const [reverseMode, setReverseMode] = useState(false);

  return (
    <>
      <div className='mora-layout'>
        <div className={`mora-sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className='sidebar-header'>
            <h2></h2>
            <h2>Menu</h2>
            <button className='sidebar-toggle' onClick={() => setCollapsed(!collapsed)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M0 0h25v24H0z" fill="none" />
                <path fill="currentColor" d="M3.563 6a.75.75 0 0 1 .75-.75h16a.75.75 0 0 1 0 1.5h-16a.75.75 0 0 1-.75-.75m0 12a.75.75 0 0 1 .75-.75h16a.75.75 0 0 1 0 1.5h-16a.75.75 0 0 1-.75-.75m.75-6.75a.75.75 0 0 0 0 1.5h16a.75.75 0 0 0 0-1.5z" />
              </svg>
            </button>
          </div>

          <div className='sidebar-item' onClick={() => {setSelectedDeckId(null); setIsStudying(false); setStudyMode(null);}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
	            <g fill="none" fillRule="evenodd">
		            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
		            <path fill="currentColor" d="M10.772 2.688a2 2 0 0 1 2.456 0l8.384 6.52c.753.587.337 1.792-.615 1.792H20v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8h-.997c-.953 0-1.367-1.206-.615-1.791z" />
	            </g>
            </svg>
            <span>Home</span>
          </div>

          <div className='sidebar-item' onClick={() => exportDecks()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
              <path d="M0 0h16v16H0z" fill="none" />
              <path fill="currentColor" d="M8.505 1c.422-.003.844.17 1.166.516l1.95 2.05c.213.228.213.6 0 .828a.52.52 0 0 1-.771 0L9 2.451v7.993c0 .307-.224.556-.5.556s-.5-.249-.5-.556v-7.96l-1.82 1.91a.52.52 0 0 1-.77 0a.617.617 0 0 1 0-.829l1.95-2.05A1.58 1.58 0 0 1 8.5 1zM4.18 7c-.473 0-.88.294-.972.703l-1.189 5.25a1 1 0 0 0-.019.172c0 .483.444.875.99.875h11.02q.098 0 .194-.017c.537-.095.885-.556.778-1.03l-1.19-5.25C13.7 7.294 13.293 7 12.822 7zM6 6v1h5V6h1.825c.946 0 1.76.606 1.946 1.447l1.19 5.4c.215.975-.482 1.923-1.556 2.118a2 2 0 0 1-.39.035H2.985C1.888 15 1 14.194 1 13.2q0-.179.039-.353l1.19-5.4C2.414 6.606 3.229 6 4.174 6z" />
            </svg>
            <span>Export Decks</span>
          </div>

          <div className='sidebar-item' onClick={() => importDecks()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16">
              <path d="M0 0h16v16H0z" fill="none" />
              <path fill="currentColor" d="m9 10.114l1.85-1.943a.52.52 0 0 1 .77 0c.214.228.214.6 0 .829l-1.95 2.05a1.55 1.55 0 0 1-2.31 0L5.41 9a.617.617 0 0 1 0-.829a.52.52 0 0 1 .77 0L8 10.082V1.556C8 1.249 8.224 1 8.5 1s.5.249.5.556zM4.18 6a.99.99 0 0 0-.972.804l-1.189 6Q2 12.9 2 13c0 .552.444 1 .99 1h11.02q.098 0 .194-.02a1 1 0 0 0 .778-1.176l-1.19-6a.99.99 0 0 0-.97-.804zM6 5v1h5V5h1.825c.946 0 1.76.673 1.946 1.608l1.19 6A2 2 0 0 1 14.016 15H2.984a1.992 1.992 0 0 1-1.945-2.392l1.19-6C2.414 5.673 3.229 5 4.174 5z" />
            </svg>
            <span>Import Decks</span>
            <input type="file" accept=".json" ref={fileInputRef} style={{ display: "none" }} onChange={handleImport}/>
          </div>

          <div className='sidebar-item' onClick={() => setTheme(theme === "Dark" ? "Light" : "Dark")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
	            <path d="M0 0h32v32H0z" fill="none" />
	            <path fill="currentColor" d="M15.653 7.25c-3.417 0-8.577.983-8.577 3.282c0 1.91 2.704 3.23 1.69 3.89c-1.02.665-2.683-1.85-4.047-1.85c-1.654 0-2.816 1.435-2.816 2.927c0 4.557 6.326 8.25 13.75 8.25c7.423 0 13.442-3.693 13.442-8.25c0-4.556-6.02-8.25-13.443-8.25zm-5.345 6.27c0-.644.887-1.165 1.98-1.165s1.98.52 1.98 1.166s-.887 1.167-1.98 1.167s-1.98-.523-1.98-1.166zm3.98 8.78c-1.057 0-1.913-.68-1.913-1.52s.856-1.517 1.914-1.517c1.056 0 1.913.68 1.913 1.518s-.857 1.52-1.914 1.52zm5.323-.53c-1.056 0-1.912-.68-1.912-1.518c0-.84.856-1.52 1.913-1.52c1.06 0 1.915.68 1.915 1.52s-.855 1.52-1.914 1.52zm.465-11.11c0-.838.856-1.518 1.914-1.518s1.912.68 1.912 1.518c0 .84-.855 1.518-1.913 1.518c-1.056 0-1.915-.68-1.915-1.518zm4.2 8.822c-1.057 0-1.914-.68-1.914-1.52s.858-1.517 1.915-1.517c1.06 0 1.914.68 1.914 1.518s-.856 1.52-1.915 1.52zm1.01-4.007c-1.057 0-1.913-.68-1.913-1.52c0-.837.856-1.517 1.914-1.517s1.913.68 1.913 1.518c0 .84-.857 1.52-1.914 1.52z" />
            </svg>
            <span>{theme}</span>
          </div>
        </div>

        <div className={`mora-content-container ${collapsed ? "sidebar-collapsed" : ""}`}>
          <div className='mora-content'>
            {!selectedDeck && (
              <DeckList decks={decks} setDecks={setDecks} selectedDeckId={selectedDeckId} setSelectedDeckId={setSelectedDeckId}/>
            )}

            {selectedDeck && !isStudying && (
              <DeckView decks={decks} setDecks={setDecks} selectedDeckId={selectedDeckId} setSelectedDeckId={setSelectedDeckId} selectedDeck={selectedDeck} showStudyModal = {showStudyModal} setShowStudyModal={setShowStudyModal} reverseMode={reverseMode} setReverseMode={setReverseMode} setIsStudying={setIsStudying} setStudyMode={setStudyMode}/>
            )}

            {selectedDeck && isStudying && (
              <StudyView setDecks={setDecks} selectedDeck={selectedDeck} setIsStudying={setIsStudying} studyMode={studyMode} setStudyMode={setStudyMode} showStudyModal = {showStudyModal} setShowStudyModal={setShowStudyModal} reverseMode={reverseMode} setReverseMode={setReverseMode}/>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
