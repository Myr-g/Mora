import { useState, useEffect } from 'react'
import './App.css'

function WriteTheDefinition({ selectedDeck, studyCards, setStudyCards, answers, setAnswers, showResults, setShowResults, setShowStudyModal, studyMode, setStudyMode, resetStudyState })
{
    useEffect(() => {
        if(!showResults) 
        {
            setAnswers(Array(studyCards.length).fill(""));
        }
    }, [studyMode, showResults]);

    const handleDefinition = (definition, index) => {
        setAnswers(prev => {
            const updated = [...prev];
            updated[index] = definition;
            return updated;
        });
    };

    return (
        <>
            <section className='study-view-header'>
                <h1>{selectedDeck.name} - Write the Definition</h1>
            </section>

            {!showResults && (
                <>
                    <div className='deck-actions'>
                        <button className='check-answers-button' onClick={() => setShowResults(true)}>Check Answers</button>
                        <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                    </div>
                            
                    <div className='write-the-definition'>
                        {studyCards.map((card, index) => (
                            <div key={index} className='write-the-definition-question'>
                                <p>{card.front}</p>
                                <input className='write-the-definition-answer' value={answers[index] || ""} onChange={(e) => { handleDefinition(e.target.value, index); }}></input>
                            </div>
                        ))}
                     </div>
                </>
            )}

            {showResults && (
                <>
                    <div className='deck-actions'>
                        <button className="try-again-button" onClick={resetStudyState}>Try Again</button>

                        {studyCards.some((card, index) => answers[index].trim().toLowerCase() !== card.back.trim().toLowerCase()) && (
                            <button className='study-missed-cards-button' onClick={() => {
                                const missedCards = studyCards.filter((card, index) => answers[index].trim().toLowerCase() !== card.back.trim().toLowerCase());
                                setStudyCards(missedCards);
                                resetStudyState();
                                setStudyMode("review");
                            }}>Review Missed Cards</button>
                        )}

                        <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                    </div>

                    <p className="score">Score: {studyCards.filter((card, index) => answers[index].trim().toLowerCase() === card.back.trim().toLowerCase()).length} / {answers.length}</p>

                    <div className='write-the-definition'>
                        {studyCards.map((card, index) => (
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
    )
}

export default WriteTheDefinition;