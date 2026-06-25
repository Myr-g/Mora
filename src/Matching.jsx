import { useState, useEffect } from 'react'
import './App.css'

function Matching({ selectedDeck, studyCards, setStudyCards, answers, setAnswers, showResults, setShowResults, setShowStudyModal, reverseMode, studyMode, setStudyMode, resetStudyState, shuffle })
{
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [matches, setMatches] = useState([]);
    const matchingQuestion = reverseMode ? "back" : "front";
    const matchingAnswer = reverseMode ? "front" : "back";

    useEffect(() => {
        if(!showResults)
        {
            shuffleAnswers();
        }
    }, [studyMode, showResults]);

    const resetMatchingState =() => {
        resetStudyState();
        setSelectedAnswer(null);
        setMatches([]);
    };

    const shuffleAnswers = () => {
        const answers = studyCards.map(card => card[matchingAnswer]);
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
    };

    return (
        <>
            <section className='study-view-header'>
                <h1>{selectedDeck.name} - Matching</h1>
            </section>

            {!showResults && (
                <>
                    <div className='deck-actions'>
                        <button className='check-answers-button' onClick={() => setShowResults(true)}>Check Answers</button>
                        <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                    </div>

                    <div className='matching'>
                        <div className='matching-questions'>
                            {studyCards.map((card, index) => (
                                <div key={index} className='matching-prompt'>
                                    <div className='matching-question'>{card[matchingQuestion]}</div>
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
                </>
            )}

            {showResults && (
                <>
                    <div className='deck-actions'>
                        <button className="try-again-button" onClick={resetMatchingState}>Try Again</button>

                        {studyCards.some((card, index) => (matches[index] || "").trim().toLowerCase() !== card[matchingAnswer].trim().toLowerCase()) && (
                            <button className='study-missed-cards-button' onClick={() => {
                                const missedCards = studyCards.filter((card, index) => (matches[index] || "").trim().toLowerCase() !== card[matchingAnswer].trim().toLowerCase());
                                setStudyCards(missedCards);
                                resetMatchingState();
                                setStudyMode("review");
                            }}>Review Missed Cards</button>
                        )}

                        <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                    </div>

                    <p className="score">Score: {studyCards.filter((card, index) => (matches[index] || "").trim().toLowerCase() === card[matchingAnswer].trim().toLowerCase()).length} / {studyCards.length}</p>

                    <div className='matching'>
                        <div className='matching-questions'>
                            {studyCards.map((card, index) => (
                                <div key={index} className='matching-prompt'>
                                    <div className='matching-question'>{card[matchingQuestion]}</div>
                                    <div className={`matching-slot ${(matches[index] || "").trim().toLowerCase() === card[matchingAnswer].trim().toLowerCase() ? "correct" : "incorrect"}`}>{matches[index] || ""}</div>
                                    {(matches[index] || "").trim().toLowerCase() !== card[matchingAnswer].trim().toLowerCase() && (
                                        <>
                                            <p className='matching-correct-answer'>{card[matchingAnswer]}</p>
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
    )
}

export default Matching;