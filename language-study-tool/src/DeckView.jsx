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
          <button className='back-button' onClick={() => setSelectedDeckId(null)}>←</button>
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
                {editingId === card.id ? (
                  <input autoFocus defaultValue={card[side]} 
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
                  <h2 onClick={(e) => { e.stopPropagation(); setEditingId(card.id); }}>{card[side]}</h2>
                )}

                <button className='delete-card' onClick={(e) => {e.stopPropagation(); deleteCard(card.id); }}>Delete</button>
              </div>
            )
          })}
        </div>
      </>
    )
}

export default DeckView;