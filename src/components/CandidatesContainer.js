import React, { useState } from 'react';

function candNameStringHash(str) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i) ** 2;
    }
    return Math.floor(sum / 100);
}


export function CandidateBox(props) {
    return (
        <div
            className={`candidate-box ${props.checked ? "checked" : ""}`}
            onClick={props.onClick}
        >
            <h5 className="title">
                {`${props.candName} (${props.party})`}
            </h5>
        </div>
    );
}

const CurrentCandidate = ({ candName }) => (
    <h4 className="current-candidate">
        {candName ? `Chosen Candidate: ${candName}` : 'No Candidate Chosen Yet'}
    </h4>
);

export default function CandidatesContainer(props) {
    let [currentCandidate, setCurrentCandidate] = useState('');
    let [checkedCandidates, setCheckedCandidates] = useState(Array(props.candidates.length).fill(false));
    const { electionType } = props;
    return (
        <div className="candidates-container">
            {
                electionType ?
                    <div className="election-type-wrapper">
                        <h3 className="election-type">
                            {electionType + " elections:"}
                        </h3>
                    </div>
                :
                    ""
            }
            <h4 className="title">
                Choose One of The Candidates Below:
            </h4>
            <ul className="candidates-list">
                {
                    props.candidates.map(
                        ({ candName, party }, index) => {
                            const onClick = () => {
                                setCurrentCandidate(candName);
                                setCheckedCandidates(prevState => {
                                    prevState.fill(false);
                                    prevState[index] = true;
                                    return prevState;
                                })
                            }
                            const uniqueKey = candNameStringHash(candName);
                            return (
                                <CandidateBox
                                    checked={checkedCandidates[index]}
                                    candName={candName}
                                    party={party}
                                    onClick={onClick}
                                    key={uniqueKey}
                                />
                            );
                        }
                    )
                }
            </ul>
            <CurrentCandidate candName={currentCandidate} />
        </div>
    );
}