import { useState, useEffect } from 'react'
import './App.css'

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

  const [editingId, setEditingId] = useState(null);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const selectedDeck = decks.find(d => d.id === selectedDeckId);

  const createDeck = () => {
    const deck = {
      id: "deck_" + crypto.randomUUID(),
      name: "Untitled Deck",
      cards: []
    };

    setDecks(decks => [...decks, deck]);

    setEditingId(deck.id);
  };

  const deleteDeck = (id) => {
    setDecks(decks => decks.filter(deck => deck.id !== id));
  };

  const renameDeck = (id, newName) => {
    setDecks(decks => decks.map(deck => deck.id === id ? {...deck, name: newName} : deck));
  };

  const createCard = () => {
    const card = {
      id: "card_" + crypto.randomUUID(),
      front: "",
      back: ""
    };

    setDecks(decks => decks.map(deck => deck.id === selectedDeckId ? { ...deck, cards: [...deck.cards, card] } : deck));
    setEditingId(card.id);
  };

  const renameCard = (id, newText, side) => {
    
  };

  const deleteCard= (id) => {
    setDecks(decks =>
      decks.map(deck =>
        deck.id === selectedDeckId
          ? { ...deck, cards: deck.cards.filter(card => card.id !== id) }
          : deck
      )
    );
  };

  if(!selectedDeck)
  {
    return (
      <>
        <section className='header'>
          <h1>Language Study Tool</h1>
        </section>

        <button className='create-deck' onClick={createDeck}>Create Deck</button>

        <div className='deck-list'>
          {decks.map((deck) => {
            return (
              <div key={deck.id} className='deck' onClick={() => {setSelectedDeckId(deck.id); setEditingId(null);}}>
                {editingId === deck.id ? (
                  <input autoFocus defaultValue={deck.name} 
                    onBlur={e => {
                      renameDeck(deck.id, e.target.value); 
                      setEditingId(null);
                    }}

                    onKeyDown={e => {
                      if(e.key === "Enter") 
                      {
                        renameDeck(deck.id, e.target.value);
                        setEditingId(null);
                      }
                    
                      else if(e.key === "Escape") 
                      {
                        setEditingId(null);
                      }
                    }}
                  />
                ) : 
                (
                  <h2 onClick={(e) => { e.stopPropagation(); setEditingId(deck.id); }}>{deck.name}</h2>
                )}

                <button className='delete-deck' onClick={(e) => {e.stopPropagation(); deleteDeck(deck.id); }}>Delete</button>
              </div>
            );
          })}
        </div>
      </>
    )
  }

  else
  {
    return (
      <>
        <section className='deck-header'>
          <button className='back-button' onClick={() => setSelectedDeckId(null)}>←</button>
          <h1 className='deck-name'>{selectedDeck.name}</h1>
        </section>

        <button className='create-card' onClick={createCard}>Create Card</button>

        <div className='card-list'>
          {selectedDeck.cards.map((card) => {
            return (
              <div key={card.id} className='card'>
                <h2>{card.front}</h2>
                <button className='delete-card' onClick={(e) => {e.stopPropagation(); deleteCard(card.id); }}>Delete</button>
              </div>
            )
          })}
        </div>
      </>
    )
  }
}

export default App
