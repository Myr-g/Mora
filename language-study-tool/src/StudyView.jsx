import { useState, useEffect } from 'react'
import './App.css'

function StudyView({ selectedDeck, setIsStudying })
{
    const [studyMode, setStudyMode] = useState(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    
    if(!studyMode)
    {
        return (
            <>
                <div className='study-modal'>
                    <div className='study-modal-header'>
                        <h2>Study Options</h2>
                    </div>

                    <div className='study-modal-options'>
                        <label>Study Mode</label>
                        <select className="study-modal-select" onChange={(e) => setStudyMode(e.target.value)} defaultValue="null">
                            <option value="null">Select a Study Mode</option>
                            <option value="flashcards">Flashcards</option>
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="matching">Matching / Drag-and-Drop</option>
                            <option value="write-the-definition">Write the Definition</option>
                        </select>
                    </div>

                    <div className='study-modal-actions'>
                        <button onClick={() => setIsStudying(false)}>Exit</button>
                        <button>Cancel</button>
                    </div>
                </div>
            </>
        )
    }

    else
    {
        // redirects to each exercise view
    }
}

export default StudyView;