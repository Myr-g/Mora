import { useState, useEffect } from 'react'
import './App.css'

function DeckList({decks, setDecks, selectedDeckId, setSelectedDeckId })
{
    const [editingId, setEditingId] = useState(null);

    const createDeck = () => {
        const deck = {
        id: "deck_" + crypto.randomUUID(),
        name: "Unnamed Deck",
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
          <h1>Mora</h1>
        </section>

        <button className='create-deck' onClick={createDeck}>Create Deck</button>

        <div className='deck-list'>
          {decks.map((deck) => {
            const dueCount = deck.cards.filter(card => {
              if(!card.srs?.dueDate)
              {
                return true;
              }

              return new Date(card.srs.dueDate) <= new Date();
            }).length;

            return (
              <div key={deck.id} className={`deck ${dueCount > 0 ? "due" : ""}`} onClick={() => {setSelectedDeckId(deck.id); setEditingId(null);}}>
                <div className='deck-h2-container'>
                  {editingId === deck.id ? (
                    <input autoFocus onFocus={(e) => e.target.select()} defaultValue={deck.name} 
                      onBlur={e => {
                        renameDeck(deck.id, (e.target.value || "Unnamed Deck")); 
                        setEditingId(null);
                      }}

                      onKeyDown={e => {
                        if(e.key === "Enter") 
                        {
                          renameDeck(deck.id, (e.target.value || "Unnamed Deck"));
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
                </div>
                
                <p>{deck.cards.length} cards ◦ {dueCount} due</p>

                <button className='delete-deck' onClick={(e) => {e.stopPropagation(); deleteDeck(deck.id); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
	                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1.58 14.22A2 2 0 0 1 16.432 22H7.568a2 2 0 0 1-1.988-1.78zm3.345-2.853A2 2 0 0 1 9.154 2h5.692a2 2 0 0 1 1.81 1.147L18 6H6zM2 6h20m-12 5v5m4-5v5" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </>
    )
}

export default DeckList;