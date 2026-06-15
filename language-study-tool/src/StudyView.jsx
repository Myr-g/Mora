import { useState, useEffect } from 'react'
import './App.css'

function StudyView({ selectedDeck, setIsStudying })
{
    const [studyMode, setStudyMode] = useState(null);
    const [showStudyModal, setShowStudyModal] = useState(true);

    const [side, setSide] = useState("front");
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    // Flashcard Functions
    const previousCard = () => {
        setCurrentCardIndex(i => i > 0 ? i - 1 : i);
        setSide("front");
    };

    const nextCard = () => {
        setCurrentCardIndex(i => i < selectedDeck.cards.length - 1 ? i + 1 : i);
        setSide("front");
    };

    const flipCard = () => {
        setSide(side => (side === "front" ? "back" : "front"));
    };

    if(showStudyModal)
    {
        return (
            <>
                <section className='study-view-header'>
                    <h1>{selectedDeck.name} - Study</h1>
                </section>

                <div className='study-modal'>
                    <div className='study-modal-header'>
                        <h2>Study Options</h2>
                    </div>

                    <div className='study-modal-options'>
                        <label>Study Mode</label>
                        <select className="study-modal-select" onChange={(e) => {
                                setStudyMode(e.target.value);
                            
                                if(e.target.value)
                                {
                                    setShowStudyModal(false);
                                }
                            }} defaultValue={studyMode}>
                            <option value="">Select a Study Mode</option>
                            <option value="flashcards">Flashcards</option>
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="matching">Matching / Drag-and-Drop</option>
                            <option value="write-the-definition">Write the Definition</option>
                        </select>
                    </div>

                    <div className='study-modal-actions'>
                        <button onClick={() => setIsStudying(false)}>Exit</button>
                        <button onClick={() => setShowStudyModal(false)}>Cancel</button>
                    </div>
                </div>
            </>
        )
    }

    if(studyMode === "flashcards")
    {
        return (
            <>
                <section className='study-view-header'>
                    <h1>{selectedDeck.name} - Flashcards</h1>
                </section>

                <button onClick={() => setShowStudyModal(true)}>Study Options</button>

                <p className="card-counter">Card {currentCardIndex + 1} of {selectedDeck.cards.length}</p>

                <div className='flashcards'>
                    <button className='previous-card' onClick={previousCard}>←</button>
                    
                    <div className='flashcard' onClick={flipCard}>{selectedDeck.cards[currentCardIndex][side]}</div>

                    <button className='next-card' onClick={nextCard}>→</button>
                </div>
            </>
        )
    }
}

export default StudyView;