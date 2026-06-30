import { useState, useEffect } from 'react'
import './App.css'

function Review({ selectedDeck, studyCards, currentCardIndex, setCurrentCardIndex, setShowStudyModal, reverseMode})
{
    const [side, setSide] = useState(reverseMode ? "back" : "front");

    const previousCard = () => {
        setCurrentCardIndex(i => i > 0 ? i - 1 : i);
        setSide(reverseMode ? "back" : "front");
    };

    const nextCard = () => {
        setCurrentCardIndex(i => i < studyCards.length - 1 ? i + 1 : i);
        setSide(reverseMode ? "back" : "front");
    };

    const flipCard = () => {
        setSide(side => (side === "front" ? "back" : "front"));
    };

    // Keyboard Shortcuts
    useEffect(() => {
      const handleKeyDown = (e) => {
        if(e.key === " " || e.key === "Spacebar") 
        {
            e.preventDefault();
            flipCard();
        }
      };
      
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <section className='study-view-header'>
                <h1>{selectedDeck.name} - Flashcards (Review)</h1>
            </section>

            <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>

            <p className="card-counter">Card {currentCardIndex + 1} of {studyCards.length}</p>

            <div className='flashcards'>
                <button className='previous-card' onClick={previousCard}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
	                    <path fill="currentColor" d="M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76" />
                    </svg>
                </button>
                    
                <div className='flashcard' onClick={flipCard}>
                    <div className="flashcard-side">{side.toUpperCase()}</div>
                    <h2>{studyCards[currentCardIndex][side]}</h2>
                </div>

                <button className='next-card' onClick={nextCard}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path fill="currentColor" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z" />
                    </svg>
                </button>
            </div>
        </>
    )
}

export default Review;