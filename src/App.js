import React, { useState } from "react";
import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";

const btnValues = [
  ["C", "+-", "%", "/"],
  [7, 8, 9, "X"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocaleString = (num) =>
    String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1 ");

const removeSpaces = (num) => num.toString().replace(/\s/g, "");

const math = (a, b, sign) =>
    sign === "+" ? a + b : sign === "-" ? a - b : sign === "X" ? a * b : a / b;

const zeroDivisionError = "Can't divide by 0";

const App = () => {
  const [calc, setCalc] = useState({
    sign: "",
    num: 0,
    res: 0,
    history: []
  });

  const numClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (removeSpaces(calc.num).length < 16) {
      setCalc({
        ...calc,
        num:
            removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".")
                ? toLocaleString(Number(removeSpaces(calc.num + value)))
                : toLocaleString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
      });
    }
  };

  const comaClickHandler = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHandler = (e) => {
    setCalc({
      ...calc,
      sign: e.target.innerHTML,
      res: !calc.num
          ? calc.res
          : !calc.res
              ? calc.num
              : toLocaleString(
                  math(
                      Number(removeSpaces(calc.res)),
                      Number(removeSpaces(calc.num)),
                      calc.sign
                  )
              ),
      num: 0,
    });
  };

  const equalsClickHandler = () => {
    if (calc.sign && calc.num) {
      if (calc.num === "0" && calc.sign === "/") {
        setCalc({
          ...calc,
          res: zeroDivisionError,
          sign: "",
          num: 0,
        });
      } else {
        const result = math(
            Number(removeSpaces(calc.res)),
            Number(removeSpaces(calc.num)),
            calc.sign
        );
        setCalc({
          ...calc,
          res: toLocaleString(result),
          sign: "",
          num: 0,
          history: [...calc.history, `${calc.res} ${calc.sign} ${calc.num} = ${toLocaleString(result)}`]
        });
      }
    }
  };

  const invertClickHandler = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocaleString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocaleString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  const resetClickHandler = () => {
    setCalc({
      ...calc,
      sign: "",
      num: 0,
      res: 0,
    });
  };

  const buttonClickHandler = (e, btn) => {
    switch (btn) {
      case "C":
      case zeroDivisionError:
        resetClickHandler();
        break;
      case "+-":
        invertClickHandler();
        break;
      case "=":
        equalsClickHandler();
        break;
      case "%":
      case "/":
      case "X":
      case "-":
      case "+":
        signClickHandler(e);
        break;
      case ".":
        comaClickHandler(e);
        break;
      default:
        numClickHandler(e);
        break;
    }
  };

  return (
      <Wrapper>
        <Screen value={calc.num ? calc.num : calc.res}/>
        <ButtonBox>
          {btnValues.flat().map((btn, i) => {
            return (
                <Button
                    key={i}
                    className={btn === "=" ? "equals" : ""}
                    value={btn}
                    onClick={(e) => buttonClickHandler(e, btn)}
                />
            );
          })}
        </ButtonBox>
        <div className="history">
          <h2>History</h2>
          <ul>
            {calc.history.map((entry, index) => (
                <li key={index} className={entry.isError ? "error" : "success"}>
                  {entry.expression} = {entry.result}
                </li>
            ))}
          </ul>
        </div>
      </Wrapper>
  );
};

export default App;