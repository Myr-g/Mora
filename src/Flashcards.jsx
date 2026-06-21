import { userRef, useState, useEffect } from 'react'
import './App.css'

function Flashcards({ setDecks, selectedDeck, studyCards, setStudyCards, currentCardIndex, setCurrentCardIndex, answers, setAnswers, showResults, setShowResults, setShowStudyModal, studyMode, setStudyMode, resetStudyState })
{
    useEffect(() => {
        if(studyMode === "flashcards")
        {
            const today = new Date();

            const dueCards = selectedDeck.cards.filter(card => {
                if(!card.srs.dueDate)
                {
                    return true;
                }

                return new Date(card.srs.dueDate) <= today;
            });

            setStudyCards(dueCards);
        }
    }, [studyMode]);

    const [side, setSide] = useState("front");

    const resetFlashcardsState = () => {
        resetStudyState();
        setSide("front");
    };

    const flipCard = () => {
        setSide(side => (side === "front" ? "back" : "front"));
    };

    const againCards = answers.filter(a => a.rating === "again");
    const hardCards = answers.filter(a => a.rating === "hard");
    const goodCards = answers.filter(a => a.rating === "good");
    const easyCards = answers.filter(a => a.rating === "easy");

    const gradeCard = (rating) => {
        setAnswers(answers => [
            ...answers,
            {
                card: studyCards[currentCardIndex], rating
            }
        ]);

        setSide("front");

        srs(selectedDeck.cards[currentCardIndex], rating);

        if(currentCardIndex < studyCards.length - 1)
        {
            setCurrentCardIndex(i => i + 1);
        }
        
        else
        {
            setShowResults(true);
        }
    };

    const srs = (card, rating) => {        
        if(rating === "again")
        {
            card.srs.repetitions = 0;
            card.srs.interval = 1;
            card.srs.easeFactor = Math.max(1.3, card.srs.easeFactor - 0.2);
        }

        else if(rating === "hard")
        {
            card.srs.repetitions = Math.max(1, card.srs.repetitions);
            card.srs.interval = Math.max(1, Math.round(card.srs.interval * 1.2));
            card.srs.easeFactor = Math.max(1.3, card.srs.easeFactor - 0.05);
        }

        else if(rating === "good")
        {
            card.srs.repetitions += 1;

            switch(card.srs.repetitions)
            {
                case 1: card.srs.interval = 1; break;
                case 2: card.srs.interval = 6; break;
                default: card.srs.interval = Math.round(card.srs.interval * card.srs.easeFactor);
            }
        }

        else if(rating === "easy")
        {
            card.srs.repetitions += 1;
            card.srs.easeFactor += 0.05;

            switch(card.srs.repetitions)
            {
                case 1: card.srs.interval = 4; break;
                default: card.srs.interval = Math.round(card.srs.interval * card.srs.easeFactor * 1.3);
            }
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + card.srs.interval);
        card.srs.dueDate = dueDate.toISOString();

        updateCardSrs(card.id, card.srs);
    }

    const againTransition = autoHeightAdjust(expanded["again"], [againCards]);
    const hardTransition = autoHeightAdjust(expanded["hard"], [hardCards]);
    const goodTransition = autoHeightAdjust(expanded["good"], [goodCards]);
    const easyTransition = autoHeightAdjust(expanded["easy"], [easyCards]);

    function autoHeightAdjust(isExpanded, deps = []) {
        const ref = useRef(null);
        const [height, setHeight] = useState("0px");
        
        useEffect(() => {
            const el = ref.current;

            if(!el)
            { 
                return; 
            }

            if(isExpanded)
            {
                const fullHeight = el.scrollHeight;
                setHeight(fullHeight + "px");
            } 
            
            else 
            {
                setHeight("0px");
            }
        }, [isExpanded, ...deps]);

        return { ref, height };
    }

    const updateCardSrs = (cardId, newCardSrs) => {
        setDecks(decks =>
            decks.map(deck => ({
                ...deck, cards: deck.cards.map(card =>
                    card.id === cardId ? { ...card, srs: newCardSrs }: card
                )
            }))
        );
    }

    const [expanded, setExpanded] = useState({
        again: false,
        hard: false,
        good: false,
        easy: false
    });

    const toggleExpanded = (key) => {
        setExpanded(expanded => ({...expanded, [key]: !expanded[key]}));
    };

    return (
        <>
            <section className='study-view-header'>
                <h1>{selectedDeck.name} - Flashcards (SRS)</h1>
            </section>

            {!showResults && (
                <>
                    <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
            
                    {studyCards.length > 0 && (
                        <>
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

                    {studyCards.length === 0 && (
                        <>
                            <div className="flashcards-message">
                                <p>No cards are due right now.</p>
                                <p>Come back later or review ahead of time!</p>
                            </div>
                        </>
                    )}
                </>
            )}

            {showResults && (
                <>
                    <div className='deck-actions'>
                        {(againCards.length > 0 || hardCards.length > 0)  && (
                            <button className='study-missed-cards-button' onClick={() => {
                                const missedCards = answers.filter(answer => answer.rating === "again" || answer.rating === "hard").map(answer => answer.card);

                                setStudyCards(missedCards);
                                resetFlashcardsState();
                                setStudyMode("review");
                            }}>Review Missed Cards</button>
                        )}

                        <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                    </div>

                    <p className='score'>Total Cards: {answers.length}</p>

                    <div className='flashcard-results again' onClick={() => toggleExpanded("again")}>
                        <div className={`flashcard-results-header ${expanded["again"] ? "expanded" : ""}`}>
                            <div></div>
                            <h2>Didn't Know ({againCards.length})</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="currentColor" d="M15.88 9.29L12 13.17L8.12 9.29a.996.996 0 1 0-1.41 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41c-.39-.38-1.03-.39-1.42 0" />
                            </svg>
                        </div>

                        <div className={`flashcard-results-cards ${expanded["again"] ? "expanded" : ""}`} ref={againTransition.ref} style={{ height: againTransition.height }}>
                            {againCards.map((answer, index) => (
                                <div key={index} className="flashcard-results-card">
                                    <h3>{answer.card.front}</h3>
                                    <p>{answer.card.back}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flashcard-results hard' onClick={() => toggleExpanded("hard")}>
                        <div className={`flashcard-results-header ${expanded["hard"] ? "expanded" : ""}`}>
                            <div></div>
                            <h2>Hard ({hardCards.length})</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="currentColor" d="M15.88 9.29L12 13.17L8.12 9.29a.996.996 0 1 0-1.41 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41c-.39-.38-1.03-.39-1.42 0" />
                            </svg>
                        </div>

                        <div className={`flashcard-results-cards ${expanded["hard"] ? "expanded" : ""}`} ref={hardTransition.ref} style={{ height: hardTransition.height }}>
                            {hardCards.map((answer, index) => (
                                <div key={index} className="flashcard-results-card">
                                    <h3>{answer.card.front}</h3>
                                    <p>{answer.card.back}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flashcard-results good' onClick={() => toggleExpanded("good")}>
                        <div className={`flashcard-results-header ${expanded["good"] ? "expanded" : ""}`}>
                            <div></div>
                            <h2>Knew It ({goodCards.length})</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="currentColor" d="M15.88 9.29L12 13.17L8.12 9.29a.996.996 0 1 0-1.41 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41c-.39-.38-1.03-.39-1.42 0" />
                            </svg>
                        </div>

                        <div className={`flashcard-results-cards ${expanded["good"] ? "expanded" : ""}`} ref={goodTransition.ref} style={{ height: goodTransition.height }}>
                            {goodCards.map((answer, index) => (
                                <div key={index} className="flashcard-results-card">
                                    <h3>{answer.card.front}</h3>
                                    <p>{answer.card.back}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flashcard-results easy' onClick={() => toggleExpanded("easy")}>
                        <div className={`flashcard-results-header ${expanded["easy"] ? "expanded" : ""}`}>
                            <div></div>
                            <h2>Easy ({easyCards.length})</h2>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="currentColor" d="M15.88 9.29L12 13.17L8.12 9.29a.996.996 0 1 0-1.41 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59a.996.996 0 0 0 0-1.41c-.39-.38-1.03-.39-1.42 0" />
                            </svg>
                        </div>

                        <div className={`flashcard-results-cards ${expanded["easy"] ? "expanded" : ""}`} ref={easyTransition.ref} style={{ height: easyTransition.height }}>
                            {easyCards.map((answer, index) => (
                                <div key={index} className="flashcard-results-card">
                                    <h3>{answer.card.front}</h3>
                                    <p>{answer.card.back}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Flashcards;