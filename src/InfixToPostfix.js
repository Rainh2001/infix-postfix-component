import React, { useCallback, useEffect, useRef, useState } from 'react';

import './InfixToPostfix.css'

class Stack {
    items = [];
    top = () => this.items[this.size() - 1];
    push = (element) => this.items.push(element);
    pop = () => this.items.pop();
    isEmpty = () => this.items.length === 0;
    empty = () => (this.items.length = 0);
    size = () => this.items.length;
}

function getPrecedence(char){
    if(char === "+" || char === "-"){
        return 0;
    } else if(char === "/" || char === "*"){
        return 1;
    } else if(char === "^"){
         return 2;
    }
    return -1;
}

function InfixToPostfix() {

    const equationInput = useRef();

    const [history, setHistory] = useState([]);
    const [historyCount, setHistoryCount] = useState(0);

    const [infix, setInfix] = useState("");

    const addHistory = (operators, result, infixIndex) => {
        setHistory(current => {
            let newHistory = JSON.parse(JSON.stringify(current));
            newHistory.push({
                operators, result, infixIndex
            });
            return newHistory;
        })
    }

    const calculateResult = useCallback(infixStr => {

        setHistory([]);

        let operator = new Stack();
        let results = new Stack();

        addHistory(JSON.parse(JSON.stringify(operator.items)), JSON.parse(JSON.stringify(results.items)), null);

        for(let i = 0; i < infixStr.length; i++){
            let c = infixStr[i];

            if((c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || (c >= "0" && c <= "9")){
                results.push(c);
            }

            else if(c === "("){
                operator.push(c);
            }

            else if(c === ")"){
                while(operator.top() !== "("){
                    results.push(operator.pop());
                    addHistory(JSON.parse(JSON.stringify(operator.items)), JSON.parse(JSON.stringify(results.items)), i);
                }
                operator.pop();
            }

            else {
                while(!operator.isEmpty() && getPrecedence(c) <= getPrecedence(operator.top())){
                    results.push(operator.pop());
                    addHistory(JSON.parse(JSON.stringify(operator.items)), JSON.parse(JSON.stringify(results.items)), i);
                }
                operator.push(c);
            }
            addHistory(JSON.parse(JSON.stringify(operator.items)), JSON.parse(JSON.stringify(results.items)), i);
        }

        while(!operator.isEmpty()){
            results.push(operator.pop());
            addHistory(JSON.parse(JSON.stringify(operator.items)), JSON.parse(JSON.stringify(results.items)), null);
        }
    }, []);

    return (
        <div
        className="component-container"
        >
            <div>
                <input ref={equationInput} placeholder="Enter Infix Equation`..." type="text"/>
                <button
                onClick={() => {
                    const equation = equationInput.current.value.replaceAll(" ", "");
                    setInfix(equation);
                    setHistoryCount(0);
                    calculateResult(equation);
                }}
                >Convert To Postfix</button>
            </div>
            <div
            style={{
                marginTop: '1rem'
            }}
            >
                <button
                onClick={() => {
                    setHistoryCount(current => {
                        if(current === 0) return current;
                        return current - 1;
                    });
                }}
                >Previous</button>
                <button
                onClick={() => {
                    setHistoryCount(current => {
                        if(current === history.length-1) return current;
                        return current + 1;
                    });
                }}
                >Next</button>
                <span
                style={{ marginLeft: '1rem' }}
                >
                    <button
                    onClick={() => setHistoryCount(0)}
                    >Start Again</button>
                    <button
                    onClick={() => setHistoryCount(history.length-1)}
                    >Finish</button>
                </span>
            </div>
            <div
            style={{
                marginTop: '1rem'
            }}
            >
                { infix &&
                    <span>
                        Infix: <span style={{fontWeight: 'bold'}}>{ infix }</span>
                    </span>
                }
            </div>

            { history.length > 0 &&
                <>
                    <div
                    id="stack-container"
                    style={{
                        height: `${infix.length * (25 + 2)}px`
                    }}
                    >
                        <div
                        className="stack"
                        id="infix-stack"
                        >
                            { 
                                // history[historyCount].infixStr.split("").map((char, i) => {
                                //     return <div
                                //     key={`${char}${i}`}
                                //     className="stack-box infix-stack-box"
                                //     >
                                //         <span>{ char }</span>
                                //     </div>
                                // })
                                infix.split("").map((char, i) => {
                                    let highlighted = history[historyCount].infixIndex === i;
                                    return <div
                                    key={`${char}${i}`}
                                    className="stack-box infix-stack-box"
                                    style={{
                                        background: highlighted ? "lime" : null,
                                        borderColor: highlighted ? "green" : "grey"
                                    }}
                                    >
                                        <span>{ char }</span>
                                    </div>
                                })
                            }
                        </div>
                        <div
                        className="stack"
                        id="operators-stack"
                        >
                            {
                                history[historyCount].operators.slice().reverse().map((operator, i) => {
                                    return <div
                                    key={`${operator}${i}`}
                                    className="stack-box operator-stack-box"
                                    >
                                        { operator }
                                    </div>
                                })
                            }
                        </div>
                        <div
                        className="stack"
                        id="results-stack"
                        >
                            {
                                history[historyCount].result.slice().reverse().map((char, i) => {
                                    return <div
                                    key={`${char}${i}`}
                                    className="stack-box result-stack-box"
                                    >
                                        { char }
                                    </div>
                                })
                            }
                        </div>
                    </div>
        
                    <div>
                        <span>
                            Postfix Result: <span style={{fontWeight: 'bold'}}>{ history[historyCount].result.join("") }</span>
                        </span>
                    </div>
                </>
            }
        </div>
    );
}

export default InfixToPostfix;