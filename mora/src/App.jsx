import { useState, useEffect } from 'react'
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

      return data ? JSON.parse(data) : [
        {id: "deck_123", name: "Genki Chapter 1 Vocab", cards: [{id: "card_1", front: "おかあさん", back: "Mother"}, {id: "card_2", front: "おとうさん", back: "Father"}, {id: "card_3", front: "おねえさん", back: "Older Sister"}, {id: "card_4", front: "おにいさん", back: "Older Brother"}, {id: "card_5", front: "いもうと", back: "Younger Sister"}, {id: "card_6", front: "おとうと", back: "Younger Brother"}, {id: "card_7", front: "いぬ", back: "Dog"}, {id: "card_8", front: "ねこ", back: "Cat"}, {id: "card_9", front: "いしゃ", back: "Doctor"}, {id: "card_10", front: "べんごし", back: "Lawyer"}, {id: "card_11", front: "れきし", back: "History"}, {id: "card_12", front: "コンピューター", back: "Computer"}]},
        {id: "deck_456", name: "Genki Chapter 1 Verb Conjugation", cards: []},
        {id: "deck_789", name: "Japanese Numbers & Dates", cards: []},
        {id: "deck_101112", name: "Kanji (ew)", cards: []}
      ];
    }

    catch(err)
    {
      return [
        {id: "deck_123", name: "Genki Chapter 1 Vocab", cards: []},
        {id: "deck_456", name: "Genki Chapter 1 Verb Conjugation", cards: []},
        {id: "deck_789", name: "Japanese Numbers & Dates", cards: []},
        {id: "deck_101112", name: "Kanji (ew)", cards: []}
      ];
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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "Dark";
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [collapsed, setCollapsed] = useState(false);


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
              <DeckView decks={decks} setDecks={setDecks} selectedDeckId={selectedDeckId} setSelectedDeckId={setSelectedDeckId} selectedDeck={selectedDeck} showStudyModal = {showStudyModal} setShowStudyModal={setShowStudyModal} setIsStudying={setIsStudying} setStudyMode={setStudyMode}/>
            )}

            {selectedDeck && isStudying && (
              <StudyView selectedDeck={selectedDeck} setIsStudying={setIsStudying} studyMode={studyMode} setStudyMode={setStudyMode} showStudyModal = {showStudyModal} setShowStudyModal={setShowStudyModal}/>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
