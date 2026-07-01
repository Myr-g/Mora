import './App.css'

function About()
{
    return (
        <>
            <section className='header'>
                <h1>About</h1>
            </section>

            <div className='about'>
                <div className='about-section'>
                    <h2>Mora</h2>
                    <p>Mora is a study tool designed to make learning easy, flexible, and accessible. It requires no account, stores your decks locally on your device, and never stores or uploads your data elsewhere. You can create backups at any time using Import and Export. Includes multiple study modes, a spaced repetition system, and also works offline once installed.</p>
                </div>

                <div className='about-section'>
                    <h2>Features</h2>
                    <ul>
                        <li>Multiple study modes: Review Flashcards, SRS Flashcards, Multiple Choice, Matching, & Write the Definition</li>
                        <li>Spaced Repetition System (SRS)</li>
                        <li>Reverse Mode (Flip front/back of cards while studying)</li>
                        <li>Search cards inside a deck</li>
                        <li>Import / Export</li>
                        <li>Dark & Light Themes</li>
                    </ul>
                </div>

                <div className='about-section'>
                    <h2>What is SRS?</h2>
                    <p>Spaced Repetition schedules when you review cards based on how well you know them. Cards you rate as difficult appear more often, while cards you rate as easy appear less often over time. This helps you spend more time on material that needs practice and less time on material you already know.</p>
                    <table>
                        <tr>
                            <th>Rating</th>
                            <th>Meaning</th>
                        </tr>
                        <tr>
                            <td>Didn't Know</td>
                            <td>You could not remember the meaning. You had to flip the card to see it. Review again very soon.</td>
                        </tr>
                        <tr>
                            <td>Hard</td>
                            <td>You almost forgot the meaning. It took effort to remember. Review again soon.</td>
                        </tr>
                        <tr>
                            <td>Knew It</td>
                            <td>You remembered the meaning with only a little thinking. Review again after some time.</td>
                        </tr>
                        <tr>
                            <td>Easy</td>
                            <td>You remembered the meaning immediately. No thinking needed. Review again much later.</td>
                        </tr>
                    </table>
                </div>

                <div className='about-section'>
                    <h2>Source Code</h2>
                    <p>
                        <span>Mora is open‑source. You can view the code or report issues on </span>
                        <a className='github-link' href='https://github.com/Myr-g/Mora'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
                            </svg>
                            <span>GitHub</span>
                        </a>
                    </p>
                </div>
            </div>
        </>
    )
}

export default About;