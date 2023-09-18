import React, { useState } from "react";
import "./Disperse.css";

const Disperse = () => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [lineNumbers, setLineNumbers] = useState([]);
  const [parsedInput, setParsedInput] = useState({});
  const [showDuplicateButtons, setShowDuplicateButtons] = useState(false);

  const onSubmit = () => {
    if (!inputValue.trim()) {
      setError("Please enter addresses with amounts.");
      return;
    }
    const inputLines = inputValue.split("\n");
    const addressesMap = {};

    for (let i = 0; i < inputLines.length; i++) {
      const line = inputLines[i].trim();
      if (line) {
        const parts = line.split(/[,= ]+/);
        if (parts.length !== 2) {
          setError(`Invalid input at line ${i + 1}: ${line}`);
          return;
        }

        const address = parts[0];
        const amount = parts[1];

        if (!isNaN(amount)) {
          if (addressesMap[address]) {
            setError("Duplicate");
            addressesMap[address].line.push(i + 1);
            addressesMap[address].amount.push(parseInt(amount));
          } else {
            addressesMap[address] = {
              address: address,
              line: [i + 1],
              amount: [parseInt(amount)],
            };
          }
        } else {
          setError(`Line ${i + 1}: Wrong Amount`);
          return;
        }
      }
    }
    console.log(JSON.stringify(addressesMap));
    checkForDuplicates(addressesMap);
    setParsedInput(addressesMap);
  };

  const checkForDuplicates = (addressMap) => {
    let error = "";
    for (const address in addressMap) {
      const lines = addressMap[address].line;
      if (lines.length > 1) {
        addressMap[address].isDuplicate = true;
      }
    }
    for (const address in addressMap) {
      if (addressMap[address].isDuplicate) {
        const lines = addressMap[address].line;
        error += `Address ${address} encountered duplicate in lines: ${lines.join(
          ","
        )}\n`;
      }
    }
    setError(error);
    if (error != "") {
      setShowDuplicateButtons(true);
    }
  };

  const handleKeepFirstOne = () => {
    const combinedAddressMap = Object.values(parsedInput).reduce(
      (acc, item) => {
        const address = item.address;
        const firstAmount = item.amount[0];
        if (!acc[address]) {
          acc[address] = {
            address: address,
            line: [],
            amount: [],
          };
        }
        acc[address].line.push(...item.line);
        acc[address].amount.push(firstAmount);
        return acc;
      },
      {}
    );

    setParsedInput(combinedAddressMap);
    setInputValue(
      Object.values(combinedAddressMap)
        .map((addressObj) => `${addressObj.address} ${addressObj.amount}`)
        .join("\n")
    );
    setError("");
    setShowDuplicateButtons(false);
  };

  const handleCombineBalances = () => {
    const combinedAddressMap = Object.values(parsedInput).reduce(
      (acc, item) => {
        const address = item.address;
        const totalAmount = item.amount.reduce((sum, val) => sum + val, 0);
        if (!acc[address]) {
          acc[address] = {
            address: address,
            line: [],
            amount: [],
          };
        }
        acc[address].line.push(...item.line);
        acc[address].amount.push(totalAmount);
        return acc;
      },
      {}
    );

    setParsedInput(combinedAddressMap);
    setInputValue(
      Object.values(combinedAddressMap)
        .map((addressObj) => `${addressObj.address} ${addressObj.amount}`)
        .join("\n")
    );
    setError("");
    setShowDuplicateButtons(false);
  };

  const updateLineNumbers = () => {
    const lines = inputValue.split("\n");
    const lineNumbersArray = [];
    for (let i = 0; i < lines.length; i++) {
      lineNumbersArray.push(i + 1);
    }
    setLineNumbers(lineNumbersArray);
  };

  const handleInputChange = (e) => {
    updateLineNumbers();
    const newInput = e.target.value;
    setInputValue(newInput);
    setError("");
    setParsedInput({});
    setShowDuplicateButtons(false);
  };

  return (
    <div className="disperse-container">
      <h4>Addresses with Amounts</h4>
      <div className="input-editor">
        <div className="line-numbers">
          {lineNumbers.map((lineNumber, index) => (
            <div key={index} className="line-number">
              {lineNumber}
            </div>
          ))}
        </div>
        <textarea
          className="address-input"
          rows="4"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <p
        className="note-text"
        style={{ marginBottom: showDuplicateButtons ? "0px" : "20px" }}
      >
        Separated by ',' or ' ' or '='
      </p>
      {showDuplicateButtons && (
        <div className="duplicate-btn-container">
          <p className="duplicate-text">Duplicated</p>
          <div className="duplicate-btns">
            <button className="keepFirstOneBtn" onClick={handleKeepFirstOne}>
              Keep the first one
            </button>
            <p className="or-sign"> | </p>
            <button
              className="combineAmountBtn"
              onClick={handleCombineBalances}
            >
              Combine Balance
            </button>
          </div>
        </div>
      )}
      {!!error && (
        <div className="error">
          <i
            className="fa fa-exclamation-circle"
            style={{ fontSize: "20px" }}
          />
          <span>{error}</span>
        </div>
      )}
      <button className="nextBtn" onClick={onSubmit}>
        Next
      </button>
    </div>
  );
};

export default Disperse;
