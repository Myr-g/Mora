import { useState, useEffect } from 'react'
import './App.css'

function DeckList({decks, setDecks, selectedDeckId, setSelectedDeckId })
{
    const [editingId, setEditingId] = useState(null);

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

export default DeckList;