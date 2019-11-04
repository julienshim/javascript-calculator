import React from "react";

export default class JavaScriptCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "0",
      buttons: [
        { id: "clear", value: "ac".toUpperCase() },
        { id: "plus-minus", value: "+/-" },
        { id: "percent", value: "%" },
        { id: "divide", value: "/" },
        { id: "seven", value: "7" },
        { id: "eight", value: "8" },
        { id: "nine", value: "9" },
        { id: "multiply", value: "x" },
        { id: "four", value: "4" },
        { id: "five", value: "5" },
        { id: "six", value: "6" },
        { id: "subtract", value: "-" },
        { id: "one", value: "1" },
        { id: "two", value: "2" },
        { id: "three", value: "3" },
        { id: "add", value: "+" },
        { id: "zero", value: "0" },
        { id: "decimal", value: "." },
        { id: "equals", value: "=" }
      ],
      operatorPressedLast: false,
      isMinus: false,
      calcBank: [],
      master: 0,
      clearText: "AC",
      memory: [],
      isRunning: false
    };
  }

  handleDisplayUpdate = input => {
    this.setState({
      display:
        this.state.display === "0" ||
        (this.state.calcBank[0] === this.state.display &&
          this.state.equalPressedLast) ||
        this.state.operatorPressedLast
          ? `${input}`
          : (this.state.display += input),
      operatorPressedLast: false,
      equalPressedLast: false
    });
  };

  handlePlusMinus() {
    const newDisplay = -parseFloat(this.state.display, 10);
    this.setState({
      display: String(newDisplay)
    });
  }

  handlePercent() {
    const newDisplay = parseFloat(this.state.display, 10) * 0.01;
    this.setState({
      display: String(newDisplay)
    });
  }

  handleClear() {
    this.setState({
      display: "0",
      calcBank: [],
      master: 0,
      clearText: "AC",
      memory: [],
      isRunning: false,
      operatorPressedLast: false,
      equalPressedLast: false
    });
  }

  handleOperatorPressed(input) {
    this.setState(
      prevState => ({
        calcBank: prevState.operatorPressedLast
          ? input === "-"
            ? prevState.calcBank
            : prevState.calcBank
                .splice(0, prevState.calcBank.length - 1)
                .concat(input)
          : this.state.calcBank.length % 2 == 1
          ? prevState.calcBank.concat(input)
          : prevState.calcBank.concat(prevState.display, input),
        operatorPressedLast: true,
        equalPressedLast: false,
        isMinus:
          input === "-"
            ? this.state.operatorPressedLast
              ? true
              : false
            : false
      }),
      () => {
        this.state.calcBank.length >= 4 &&
          this.handleOrderOfOperations(this.state.calcBank);
      }
    );
  }

  handleOrderOfOperations(input) {
    let calculation = [];
    const [num1, op1, num2, op2, num3, op3] = input;
    const preCalc = input.length > 4 && this.handleCalculate([num2, op2, num3]);
    switch (input.length) {
      case 4:
        calculation =
          op1 === "*" || op1 == "/" || op2 === "+" || op2 === "-"
            ? [this.handleCalculate([num1, op1, num2]), op2]
            : [num1, op1, num2, op2];
        break;
      case 5:
        calculation = [this.handleCalculate([num1, op1, preCalc])];
      case 6:
        calculation = [this.handleCalculate([num1, op1, preCalc]), op3];
        break;
      default:
        console.log("This should be possible.");
    }
    this.setState({
      calcBank: calculation,
      isRunning: true
    });
  }

  handleCalculate(input) {
    let calculation = undefined;
    const base =
      this.state.operatorPressedLast || this.state.equalPressedLast
        ? parseFloat(input[2])
        : this.state.isMinus
        ? -parseFloat(this.state.display)
        : parseFloat(this.state.display);
    switch (input[1]) {
      case "/":
        calculation = parseFloat(input[0]) / base;
        this.handleUpdate(calculation);
        break;
      case "x":
        calculation = parseFloat(input[0]) * base;
        this.handleUpdate(calculation);
        break;
      case "-":
        calculation = parseFloat(input[0]) - base;
        this.handleUpdate(calculation);
        break;
      case "+":
        calculation = parseFloat(input[0]) + base;
        this.handleUpdate(calculation);
        break;
      default:
        console.log("No operators");
    }
    return String(calculation);
  }

  handleUpdate(input) {
    this.setState({
      calcBank: [input],
      master: input,
      display: input
    });
  }

  handleRunOn = () => {
    if (this.state.memory.length === 0 && !this.state.equalPressedLast) {
      this.setState(
        {
          memory: [...this.state.calcBank],
          equalPressedLast: true,
          isRunning: false
        },
        () => {
          const input = this.handleCalculate([
            ...this.state.calcBank,
            this.state.calcBank[0]
          ]);
          this.setState({
            calcBank: [input, this.state.memory[1]],
            master: input,
            display: input
          });
        }
      );
    } else {
      const input = this.state.operatorPressedLast
        ? this.handleCalculate([...this.state.calcBank, this.state.memory[0]])
        : Number(this.state.memory[1])
        ? this.handleCalculate([
            this.state.display,
            this.state.memory[0],
            this.state.memory[1]
          ])
        : this.handleCalculate([
            this.state.display,
            this.state.memory[1],
            this.state.memory[0]
          ]);

      this.setState({
        calcBank:
          this.state.equalPressedLast && !this.state.operatorPressedLast
            ? [input, this.state.memory[0], this.state.memory[1]]
            : [input, this.state.memory[1]],
        master: input,
        display: input
      });
    }
  };

  handleClick = event => {
    event.preventDefault();
    const input = event.target.innerHTML;
    switch (true) {
      case /[0-9]/g.test(input):
        this.handleDisplayUpdate(input);
        this.setState({
          operatorPressedLast: false,
          equalPressedLast: false,
          clearText: "C",
          calcBank: this.state.equalPressedLast ? [] : this.state.calcBank,
          memory: this.state.equalPressedLast ? [] : this.state.memory
        });
        break;
      case /\+\/\-/g.test(input):
        this.handlePlusMinus();
        break;
      case /[-+x/]/g.test(input):
        this.handleOperatorPressed(input);
        break;
      case /([AC])/g.test(input):
        this.handleClear();
        break;
      case /%/g.test(input):
        this.handlePercent();
        break;
      case /\./g.test(input):
        this.state.display.indexOf(".") === -1 &&
          this.handleDisplayUpdate(input);
        break;
      case /\=/g.test(input):
        this.state.calcBank.length === 0 || this.state.calcBank.length === 1
          ? this.state.memory.length === 0
            ? this.setState({ equalPressedLast: true }, () => {
                this.handleUpdate(this.state.display);
              })
            : this.setState(
                prevState => ({
                  equalPressedLast: true,
                  memory:
                    prevState.memory.length === 0
                      ? [prevState.calcBank[1], prevState.display]
                      : prevState.memory
                }),
                () => {
                  this.handleRunOn();
                }
              )
          : this.state.calcBank.length === 2 &&
            !this.state.isRunning &&
            this.state.operatorPressedLast
          ? this.handleRunOn()
          : this.state.calcBank.length >= 4
          ? this.setState(
              prevState => ({
                equalPressedLast: true,
                memory:
                  prevState.memory.length === 0
                    ? [prevState.calcBank[1], prevState.display]
                    : prevState.memory
              }),
              () => {
                this.handleOrderOfOperations([
                  ...this.state.calcBank,
                  this.state.display
                ]);
              }
            )
          : this.setState(
              prevState => ({
                equalPressedLast: true,
                memory:
                  prevState.memory.length === 0
                    ? [prevState.calcBank[1], prevState.display]
                    : prevState.memory
              }),
              () => {
                this.handleUpdate(
                  this.handleCalculate([
                    ...this.state.calcBank,
                    this.state.isMinus
                      ? -this.state.display
                      : this.state.display
                  ])
                );
              }
            );
        break;
      default:
        console.log("Uh oh something went wrong");
    }
  };

  render() {
    return (
      <div id="javascript-calculator">
        <div id="display">
          {this.state.display.length > 14
            ? Number.isInteger(Number(this.state.display))
              ? Number(this.state.display).toExponential(9)
              : Number(this.state.display).toFixed(9)
            : this.state.display}
        </div>
        <div id="buttons">
          {this.state.buttons.map(button => {
            const text =
              button.id === "clear" ? this.state.clearText : button.value;
            const operators = {
              add: true,
              subtract: true,
              divide: true,
              multiply: true,
              equals: true
            };
            const tops = {
              "plus-minus": true,
              percent: true,
              clear: true
            };
            const equal = operators[button.id]
              ? "buttons operators"
              : tops[button.id]
              ? "buttons tops"
              : "buttons";
            return (
              <div
                key={button.id}
                id={button.id}
                className={equal}
                onClick={this.handleClick}
              >
                {text}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
