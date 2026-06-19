import { useState, useEffect } from 'react'
import './App.css'

function StudyView({ selectedDeck, setIsStudying, studyMode, setStudyMode, showStudyModal, setShowStudyModal })
{
    const [side, setSide] = useState("front");
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [answers, setAnswers] = useState([]); 

    const [choices, setChoices] = useState([]);

    useEffect(() => {
        if(studyMode === "multiple-choice" && currentCardIndex < selectedDeck.cards.length)
        {
            setChoices(generateChoices());
        }
    }, [currentCardIndex, studyMode]);

    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (studyMode === "matching" && !showResults)
        {
            shuffleAnswers();
        }
    }, [studyMode, showResults]);

    useEffect(() => {
        if(studyMode === "write-the-definition")
        {
            setAnswers(Array(selectedDeck.cards.length).fill(""));
        }
    }, [studyMode]);

    // Reset State
    const resetStudyState = () => {
        setCurrentCardIndex(0);
        setSide("front");
        setChoices([]);
        setAnswers([]);
        setShowResults(false);
        setSelectedAnswer(null);
        setMatches([]);
    };

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

    // Multiple Choice Functions
    const generateChoices = () => {
        const correctAnswer = selectedDeck.cards[currentCardIndex].back;

        let incorrectAnswers = shuffle(selectedDeck.cards.filter((_, i) => i !== currentCardIndex));
        incorrectAnswers = incorrectAnswers.slice(0, 3).map(card => card.back);

        const choices = shuffle([correctAnswer, ...incorrectAnswers]);
        return choices;
    }

    const shuffle = (array) => {
        const arr = [...array];
        for(let i = arr.length - 1; i > 0; i --)
        {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }

        return arr;
    }

    const handleChoice = (choice) => {
        const correctAnswer = selectedDeck.cards[currentCardIndex].back;

        setAnswers(answers => [
            ...answers, {
                index: currentCardIndex,
                question: selectedDeck.cards[currentCardIndex].front,
                selected: choice,
                correct: correctAnswer
            }
        ]);

        setCurrentCardIndex(i => i + 1);
    };

    // Matching Functions
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [matches, setMatches] = useState([]);

    const shuffleAnswers = () => {
        const answers = selectedDeck.cards.map(card => card.back);
        const shuffled_answers = shuffle(answers);
        setAnswers(shuffled_answers);
    };

    const handleMatch = (index) => {
        if(selectedAnswer) 
        {
            setMatches(prev => {
                const updated = [...prev];
                updated[index] = selectedAnswer;
                return updated;
            });

            setSelectedAnswer(null);
        }
    }

    // Write the Definition Functions
    const handleDefinition = (definition, index) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[index] = definition;
            return updated;
        });
    };

    return (
        <>
            {studyMode === "flashcards" && (
                <>
                    <section className='study-view-header'>
                        <h1>{selectedDeck.name} - Flashcards</h1>
                    </section>

                    <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>

                    <p className="card-counter">Card {currentCardIndex + 1} of {selectedDeck.cards.length}</p>

                    <div className='flashcards'>
                        <button className='previous-card' onClick={previousCard}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
	                            <path fill="currentColor" d="M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76" />
                            </svg>
                        </button>
                    
                        <div className='flashcard' onClick={flipCard}>
                            <div className="flashcard-side">{side.toUpperCase()}</div>
                            <h2>{selectedDeck.cards[currentCardIndex][side]}</h2>
                        </div>

                        <button className='next-card' onClick={nextCard}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="currentColor" d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z" />
                            </svg>
                        </button>
                    </div>
                </>
            )}

            {studyMode === "multiple-choice" && (
                <>
                    <section className='study-view-header'>
                        <h1>{selectedDeck.name} - Multiple Choice</h1>
                    </section>

                    {currentCardIndex !== selectedDeck.cards.length && (
                        <>
                            <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>

                            <div className='multiple-choice'>
                                <div className='multiple-choice-question'>
                                    <h2>{selectedDeck.cards[currentCardIndex].front}</h2>
                                </div>

                                <div className='multiple-choice-answers'>
                                    {choices.map((choice, index) => (
                                        <button key={index} className='multiple-choice-option' onClick={() => handleChoice(choice)}>
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {currentCardIndex === selectedDeck.cards.length && (
                        <>
                            <div className='deck-actions'>
                                <button className="try-again-button" onClick={resetStudyState}>Try Again</button>
                                <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                            </div>

                            <p className="score">Score: {answers.filter(a => a.selected === a.correct).length} / {answers.length}</p>

                            {answers.map((answer, index) => (
                                <div key={index} className={`multiple-choice ${answer.selected === answer.correct ? "correct" : "incorrect"}`}>
                                    <div className='multiple-choice-question'>
                                        <h2>{answer.question}</h2>
                                    </div>

                                    <div className='multiple-choice-answers'>
                                        <p className='result-label'>Your Answer:</p><p>{answer.selected}</p>
                                        <p className='result-label'>Correct Answer:</p><p>{answer.correct}</p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}

            {studyMode == "matching" && (
                <>
                    <section className='study-view-header'>
                        <h1>{selectedDeck.name} - Matching</h1>
                    </section>

                    {!showResults && (
                        <>
                            <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>

                            <div className='matching'>
                                <div className='matching-questions'>
                                    {selectedDeck.cards.map((card, index) => (
                                        <div key={index} className='matching-prompt'>
                                            <div className='matching-question'>{card.front}</div>
                                            <div className='matching-slot' onClick={() => handleMatch(index)}>{matches[index] || ""}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className='matching-answers'>
                                    {answers.filter(answer => !matches.includes(answer)).map(answer => (
                                        <div key={answer} className={selectedAnswer === answer ? "matching-answer selected" : "matching-answer"} onClick={() => setSelectedAnswer(answer)}>{answer}</div>
                                    ))}
                                </div>
                            </div>

                            <button className='check-answers-button' onClick={() => setShowResults(true)}>Check Answers</button>
                        </>
                    )}

                    {showResults && (
                        <>
                            <div className='deck-actions'>
                                <button className="try-again-button" onClick={resetStudyState}>Try Again</button>
                                <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                            </div>

                            <p className="score">Score: {selectedDeck.cards.filter((card, index) => (matches[index] || "").trim().toLowerCase() === card.back.trim().toLowerCase()).length} / {selectedDeck.cards.length}</p>

                            <div className='matching'>
                                <div className='matching-questions'>
                                    {selectedDeck.cards.map((card, index) => (
                                        <div key={index} className='matching-prompt'>
                                            <div className='matching-question'>{card.front}</div>
                                            <div className={`matching-slot ${(matches[index] || "").trim().toLowerCase() === card.back.trim().toLowerCase() ? "correct" : "incorrect"}`}>{matches[index] || ""}</div>
                                            {(matches[index] || "").trim().toLowerCase() !== card.back.trim().toLowerCase() && (
                                            <>
                                                <p className='matching-correct-answer'>{card.back}</p>
                                            </>
                                        )}
                                        </div>
                                    ))}
                                </div>

                                <div className='matching-answers'>
                                    {answers.filter(answer => !matches.includes(answer)).map(answer => (
                                        <div key={answer} className='matching-answer'>{answer}</div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}

            {studyMode === "write-the-definition" && (
                <>
                    <section className='study-view-header'>
                        <h1>{selectedDeck.name} - Write the Definition</h1>
                    </section>

                    {!showResults && (
                        <>
                            <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                            
                            <div className='write-the-definition'>
                                {selectedDeck.cards.map((card, index) => (
                                    <div key={index} className='write-the-definition-question'>
                                        <p>{card.front}</p>
                                        <input className='write-the-definition-answer' value={answers[index] || ""} onChange={(e) => { handleDefinition(e.target.value, index); }}></input>
                                    </div>
                                 ))}
                            </div>

                            <button className='check-answers-button' onClick={() => setShowResults(true)}>Check Answers</button>
                        </>
                    )}

                    {showResults && (
                        <>
                            <div className='deck-actions'>
                                <button className="try-again-button" onClick={resetStudyState}>Try Again</button>
                                <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                            </div>

                            <p className="score">Score: {selectedDeck.cards.filter((card, index) => answers[index].trim().toLowerCase() === card.back.trim().toLowerCase()).length} / {answers.length}</p>

                            <div className='write-the-definition'>
                                {selectedDeck.cards.map((card, index) => (
                                    <div key={index} className='write-the-definition-prompt'>
                                        <p className='write-the-definition-question'>{card.front}</p>
                                        <input className={`write-the-definition-answer ${answers[index].trim().toLowerCase() === card.back.trim().toLowerCase() ? "correct" : "incorrect"}`} value={answers[index] || ""} readOnly></input>

                                        {answers[index].trim().toLowerCase() !== card.back.trim().toLowerCase() && (
                                            <>
                                                <p className='write-the-definition-correct-answer'>{card.back}</p>
                                            </>
                                        )}
                                    </div>
                                 ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {showStudyModal && (
                <>
                    <div className='study-modal-overlay'>
                        <div className='study-modal'>
                            <div className='study-modal-header'>
                                <h2>Choose a Study Mode</h2>
                            </div>

                            <div className='study-modal-options'>
                                <label>Study Mode</label>
                                <select className="study-modal-select" onChange={(e) => {if(e.target.value) { resetStudyState(); setStudyMode(e.target.value); setShowStudyModal(false); }}} defaultValue={studyMode}>
                                    <option value="">Select a Study Mode</option>
                                    <option value="flashcards">Flashcards</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="matching">Matching / Drag-and-Drop</option>
                                    <option value="write-the-definition">Write the Definition</option>
                                </select>
                            </div>

                            <div className='study-modal-actions'>
                                <button onClick={() => {setShowStudyModal(false); setIsStudying(false); setStudyMode(null);}}>Back to Deck</button>
                                <button onClick={() => setShowStudyModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default StudyView;