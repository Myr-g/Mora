import { useState } from 'react'
import './App.css'

function App() {
  const [decks, setDecks] = useState([
    {id: "deck_123", name: "Genki Chapter 1 Vocab", cards: []},
    {id: "deck_456", name: "Genki Chapter 1 Verb Conjugation", cards: []},
    {id: "deck_789", name: "Japanese Numbers & Dates", cards: []},
    {id: "deck_101112", name: "Kanji (ew)", cards: []}
  ]);

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

  const [editingId, setEditingId] = useState(null);

  return (
    <>
      <section className='header'>
        <h1>Language Study Tool</h1>
      </section>

      <button className='create-deck' onClick={createDeck}>Create Deck</button>

      <div id='deck-list' className='deck-list'>
        {decks.map((deck) => {
          return (
            <div key={deck.id} className='deck'>
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
                <h2 onClick={() => setEditingId(deck.id)}>{deck.name}</h2>
              )}

              <button className='delete-deck' onClick={() => deleteDeck(deck.id)}>Delete</button>
            </div>
          );
        })}
      </div>
    </>
  )
}

export default App
