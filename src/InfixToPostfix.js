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
                    var equation = equationInput.current.value.replaceAll(" ", "");

                    const isNum = (char) => {
                        return (char >= '0' && char <= '9');
                    }

                    const isAlpha = (char) => {
                        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
                    }

                    const isOperator = (char) => {
                        let operators = "+-/*^()".split("");
                        return operators.indexOf(char) > -1;
                    }

                    const isValid = (char) => {
                        return isNum(char) || isAlpha(char) || isOperator(char);
                    }

                    // Separate constants from variables
                    for(let i = 1; i < equation.length; i++){
                        let [c1, c2] = [equation[i-1], equation[i]];

                        // If c1 is a number and c2 is a letter or vice versa. Also if both are Alpha
                        if((isNum(c1) && isAlpha(c2)) || (isNum(c2) && isAlpha(c1)) || (isAlpha(c1) && isAlpha(c2))){
                            equation = equation.slice(0, i) + '*' + equation.slice(i);
                        }
                    }

                    // Convert string into array of characters, however numbers that are greater than 9 will be longer than 1 character
                    let arr = [];
                    let pos = 0;
                    let currentNum = "";

                    const pushNum = () => {
                        if(currentNum[currentNum.length-1] === "."){
                            currentNum = currentNum.slice(0, currentNum.length-1);
                        }
                        arr.push(currentNum);
                        currentNum = "";
                    }

                    while(pos < equation.length){
                        let char = equation[pos];
                        if(isAlpha(char) || isOperator(char)){

                            if(currentNum.length > 0){
                                pushNum();
                            }

                            arr.push(char);
                        } else if(isNum(char) || char === '.'){
                            currentNum += char;
                            if(isNaN(currentNum)) return;
                        } else return;

                        pos++;
                    }

                    if(currentNum.length > 0){
                        pushNum();
                    }

                    setInfix(arr);
                    setHistoryCount(0);
                    calculateResult(arr);
                }}
                >Convert To Postfix</button>
            </div>
            { infix &&
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
            }
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
                                infix.map((char, i) => {
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