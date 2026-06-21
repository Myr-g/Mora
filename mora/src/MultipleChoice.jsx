import { useState, useEffect } from 'react'
import './App.css'

function MultipleChoice({ selectedDeck, studyCards, setStudyCards, currentCardIndex, setCurrentCardIndex, answers, setAnswers, setShowStudyModal, studyMode, setStudyMode, resetStudyState, shuffle })
{
    const [choices, setChoices] = useState([]);

    useEffect(() => {
        if(currentCardIndex < studyCards.length)
        {
            setChoices(generateChoices());
        }
    }, [studyMode, currentCardIndex]);

    const resetMultipleChoiceState = () => {
        resetStudyState();
        setChoices([]);
    };

    const generateChoices = () => {
        const correctAnswer = studyCards[currentCardIndex].back;

        let incorrectAnswers = shuffle(studyCards.filter((_, i) => i !== currentCardIndex));
        incorrectAnswers = incorrectAnswers.slice(0, 3).map(card => card.back);

        const choices = shuffle([correctAnswer, ...incorrectAnswers]);
        return choices;
    };

    const handleChoice = (choice) => {
        const correctAnswer = studyCards[currentCardIndex].back;

        setAnswers(answers => [
            ...answers, {
                index: currentCardIndex,
                question: studyCards[currentCardIndex].front,
                selected: choice,
                correct: correctAnswer
            }
        ]);

        setCurrentCardIndex(i => i + 1);
    };

    return (
        <>
            <section className='study-view-header'>
                <h1>{selectedDeck.name} - Multiple Choice</h1>
            </section>

            {currentCardIndex !== studyCards.length && (
                <>
                    <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>

                    <div className='multiple-choice'>
                        <div className='multiple-choice-question'>
                            <h2>{studyCards[currentCardIndex].front}</h2>
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

            {currentCardIndex === studyCards.length && (
                <>
                    <div className='deck-actions'>
                        <button className="try-again-button" onClick={resetMultipleChoiceState}>Try Again</button>
                                
                        {answers.some(a => a.selected !== a.correct) && (
                            <button className='study-missed-cards-button' onClick={() => {
                                const missedCards = answers.filter(answer => answer.selected !== answer.correct).map(answer => studyCards[answer.index]);
                                setStudyCards(missedCards);
                                resetMultipleChoiceState();
                                setStudyMode("review");
                            }}>Review Missed Cards</button>
                        )}

                        <button className='study-button' onClick={() => setShowStudyModal(true)}>Study Options</button>
                    </div>

                    <p className="score">Score: {answers.filter(a => a.selected === a.correct).length} / {answers.length}</p>

                    {answers.map((answer, index) => (
                        <div key={index} className={`multiple-choice ${answer.selected === answer.correct ? "correct" : "incorrect"}`}>
                            <div className='multiple-choice-question'>
                                <h2>{answer.question}</h2>
                            </div>

                            <div className='multiple-choice-answers'>
                                <p className='result-label'>Your Answer:</p>
                                <p>{answer.selected}</p>

                                <p className='result-label'>Correct Answer:</p>
                                <p>{answer.correct}</p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    )
}

export default MultipleChoice;