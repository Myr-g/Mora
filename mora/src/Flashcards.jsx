import { useState, useEffect } from 'react'
import './App.css'

function Flashcards({ selectedDeck, studyCards, setStudyCards, currentCardIndex, setCurrentCardIndex, answers, setAnswers, showResults, setShowResults, setShowStudyModal, setStudyMode, resetStudyState })
{
    const [side, setSide] = useState("front");

    const resetFlashcardsState = () => {
        resetStudyState();
        setSide("front");
    };

    const flipCard = () => {
        setSide(side => (side === "front" ? "back" : "front"));
    };

    const gradeCard = (rating) => {
        setAnswers(answers => [
            ...answers,
            {
                card: studyCards[currentCardIndex], rating
            }
        ]);

        setSide("front");

        if(currentCardIndex < studyCards.length - 1)
        {
            setCurrentCardIndex(i => i + 1);
        }
        
        else
        {
            setShowResults(true);
        }
    };

    return (
        <>
            <section className='study-view-header'>
                <h1>{selectedDeck.name} - Flashcards (SRS)</h1>
            </section>

            {!showResults && (
                <>
                    <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>

                    <p className="card-counter">Card {currentCardIndex + 1} of {studyCards.length}</p>
            
                    <div className='flashcards'>
                        <div className='flashcard' onClick={flipCard}>
                            <div className="flashcard-side">{side.toUpperCase()}</div>
                            <h2>{studyCards[currentCardIndex][side]}</h2>
                        </div>
                    </div>

                    <div className="flashcard-actions">
                        <button className="flashcard-action again" onClick={() => gradeCard("again")}>Didn't Know</button>
                        <button className="flashcard-action hard" onClick={() => gradeCard("hard")}>Hard</button>
                        <button className="flashcard-action good" onClick={() => gradeCard("good")}>Knew It</button>
                        <button className="flashcard-action easy" onClick={() => gradeCard("easy")}>Easy</button>
                    </div>
                </>
            )}

            {showResults && (
                <>
                    <div className='deck-actions'>
                        <button className="try-again-button" onClick={resetFlashcardsState}>Try Again</button>

                        {(answers.filter(a => a.rating === "again").length > 0)  && (
                            <button className='study-missed-cards-button' onClick={() => {
                                const missedCards = answers.filter(answer => answer.rating === "again").map(answer => answer.card);

                                setStudyCards(missedCards);
                                resetFlashcardsState();
                                setStudyMode("review");
                            }}>Review Missed Cards</button>
                        )}

                        <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                    </div>

                    <div className='flashcard'>
                        <h2>Didn't Know: {answers.filter(a => a.rating === "again").length}</h2>
                        <h2>Hard: {answers.filter(a => a.rating === "hard").length}</h2>
                        <h2>Knew It: {answers.filter(a => a.rating === "good").length}</h2>
                        <h2>Easy: {answers.filter(a => a.rating === "easy").length}</h2>

                    </div>

                </>
            )}
        </>
    )
}

export default Flashcards;