import { useState, useEffect } from 'react'
import './App.css'
import DeckList from './DeckList.jsx';
import DeckView from "./DeckView.jsx";
import StudyView from './StudyView.jsx';

function App() 
{
  const [decks, setDecks] = useState(() => {
    try
    {
      const data = localStorage.getItem("decks");

      return data ? JSON.parse(data) : [
        {id: "deck_123", name: "Genki Chapter 1 Vocab", cards: []},
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

  const [isStudying, setIsStudying] = useState(false);

  if(!selectedDeck)
  {
    return (
      <DeckList decks={decks} setDecks={setDecks} selectedDeckId={selectedDeckId} setSelectedDeckId={setSelectedDeckId}/>
    )
  }

  else if(selectedDeck && !isStudying)
  {
    return (
      <DeckView decks={decks} setDecks={setDecks} selectedDeckId={selectedDeckId} setSelectedDeckId={setSelectedDeckId} selectedDeck={selectedDeck} setIsStudying={setIsStudying}/>
    )
  }

  else if(selectedDeck && isStudying){
    return (
      <StudyView selectedDeck={selectedDeck} setIsStudying={setIsStudying}/>
    )
  }
}

export default App
