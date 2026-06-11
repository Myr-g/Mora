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
}

export default App
