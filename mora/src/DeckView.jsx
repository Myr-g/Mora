import { useState, useEffect } from 'react'
import './App.css'

function DeckView({ decks, setDecks, selectedDeckId, setSelectedDeckId, selectedDeck, setIsStudying })
{
  const [editingId, setEditingId] = useState(null);
  const [sideByCardId, setSideByCardId] = useState({});

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
    setDecks(decks =>
      decks.map(deck =>
        deck.id === selectedDeckId
        ? {
            ...deck,
                cards: deck.cards.map(card =>
                    card.id === id
                    ? {
                        ...card,
                        [side]: newText
                        }
                    : card
                )
                }
            : deck
        )
      );
    };

    const flipCard = (card) => {
      setSideByCardId(prev => {
        const current = prev[card.id] || "front";
        const next = current === "front" ? "back" : "front";

        // Auto-edit if the next side is blank
        if(!card[next]) 
        {
            setEditingId(card.id);
            return { ...prev, [card.id]: next };
        }

        return { ...prev, [card.id]: next };
      });
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

    return (
      <>
        <section className='deck-header'>
          <button className='back-button' onClick={() => setSelectedDeckId(null)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
	              <path fill="currentColor" d="M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76" />
              </svg>
          </button>
          <h1 className='deck-name'>{selectedDeck.name}</h1>
        </section>

        <div className='deck-actions'>
          <button className='create-card' onClick={createCard}>Add Card</button>
          <button className='study-button' onClick={() => setIsStudying(true)} disabled={selectedDeck.cards.length === 0}>Study</button>
        </div>

        <div className='card-list'>
          {selectedDeck.cards.map((card) => {
            const side = sideByCardId[card.id] || "front";

            return (
              <div key={card.id} className='card' onClick={() => flipCard(card)}>
                <div className="card-side">{side}</div>

                {editingId === card.id ? (
                  <input autoFocus onFocus={(e) => e.target.select()} defaultValue={card[side]} 
                    onClick={(e) => { e.stopPropagation(); }}

                    onBlur={e => {
                      renameCard(card.id, e.target.value, side); 
                      setEditingId(null);
                    }}

                    onKeyDown={e => {
                      if(e.key === "Enter") 
                      {
                        renameCard(card.id, e.target.value, side);
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
                  <h2 onClick={(e) => { e.stopPropagation(); setEditingId(card.id); }}>{card[side] || "Click to edit"}</h2>
                )}

                <button className='delete-card' onClick={(e) => {e.stopPropagation(); deleteCard(card.id); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
	                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16l-1.58 14.22A2 2 0 0 1 16.432 22H7.568a2 2 0 0 1-1.988-1.78zm3.345-2.853A2 2 0 0 1 9.154 2h5.692a2 2 0 0 1 1.81 1.147L18 6H6zM2 6h20m-12 5v5m4-5v5" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      </>
    )
}

export default DeckView;