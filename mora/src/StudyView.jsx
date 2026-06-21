import { useState, useEffect } from 'react'
import './App.css'
import Review from './Review.jsx';
import Flashcards from './Flashcards.jsx';
import MultipleChoice from './MultipleChoice.jsx';
import Matching from './Matching.jsx';
import WriteTheDefinition from './WriteTheDefinition.jsx'

function StudyView({ selectedDeck, setIsStudying, studyMode, setStudyMode, showStudyModal, setShowStudyModal })
{
    const [studyCards, setStudyCards] = useState(selectedDeck.cards);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [answers, setAnswers] = useState([]); 
    const [showResults, setShowResults] = useState(false);

    // Reset State
    const resetStudyState = () => {
        setCurrentCardIndex(0);
        setAnswers([]);
        setShowResults(false);
    };

    // Fisher-Yates Shuffle
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

    return (
        <>
            {studyMode === "review" && (
                <>
                    <Review selectedDeck={selectedDeck} studyCards={studyCards} currentCardIndex={currentCardIndex} setCurrentCardIndex={setCurrentCardIndex} setShowStudyModal={setShowStudyModal}/>
                </>
            )}

            {studyMode === "flashcards" && (
                <>
                    <Flashcards selectedDeck={selectedDeck} studyCards={studyCards} setStudyCards={setStudyCards} currentCardIndex={currentCardIndex} setCurrentCardIndex={setCurrentCardIndex} answers={answers} setAnswers={setAnswers} showResults={showResults} setShowResults={setShowResults} setShowStudyModal={setShowStudyModal} setStudyMode={setStudyMode} resetStudyState={resetStudyState}/>
                </>
            )}

            {studyMode === "multiple-choice" && (
                <>
                    <MultipleChoice selectedDeck={selectedDeck} studyCards={studyCards} setStudyCards={setStudyCards} currentCardIndex={currentCardIndex} setCurrentCardIndex={setCurrentCardIndex} answers={answers} setAnswers={setAnswers} setShowStudyModal={setShowStudyModal} studyMode={studyMode} setStudyMode={setStudyMode} resetStudyState={resetStudyState} shuffle={shuffle}/>
                </>
            )}

            {studyMode == "matching" && (
                <>
                    <Matching selectedDeck={selectedDeck} studyCards={studyCards} setStudyCards={setStudyCards} answers={answers} setAnswers={setAnswers} showResults={showResults} setShowResults={setShowResults} setShowStudyModal={setShowStudyModal} studyMode={studyMode} setStudyMode={setStudyMode} resetStudyState={resetStudyState} shuffle={shuffle}/>
                </>
            )}

            {studyMode === "write-the-definition" && (
                <>
                    <WriteTheDefinition selectedDeck={selectedDeck} studyCards={studyCards} setStudyCards={setStudyCards} answers={answers} setAnswers={setAnswers} showResults={showResults} setShowResults={setShowResults} setShowStudyModal={setShowStudyModal} studyMode={studyMode} setStudyMode={setStudyMode} resetStudyState={resetStudyState}/>
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
                                <select className="study-modal-select" onChange={(e) => {if(e.target.value) { resetStudyState(); setStudyCards(selectedDeck.cards); setStudyMode(e.target.value); setShowStudyModal(false); }}} defaultValue={studyMode}>
                                    <option value="">Select a Study Mode</option>
                                    <option value="review">Flashcards (Review)</option>
                                    <option value="flashcards">Flashcards (SRS)</option>
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="matching">Matching</option>
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