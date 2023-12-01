import React, { useState, useRef, useEffect, ChangeEvent } from 'react';

// Assume you have a trie implementation
const trie: any = 1; // Replace 'any' with the actual type of your trie

const Autocomplete: React.FC = () => {
  const [foundName, setFoundName] = useState<string>('');
  const [predicted, setPredicted] = useState<string>('');
  const [apibusy, setApibusy] = useState<boolean>(false);

  const autocompleteRef = useRef<HTMLTextAreaElement | null>(null);
  const mainInputRef = useRef<HTMLTextAreaElement | null>(null);

  const predictFromTrie = (input: string): string => {
    // Implement your logic to predict text from the trie based on the entered characters
    // This is just a placeholder, replace it with your actual trie logic
    const prediction = trie.predict(input);
    return prediction || '';
  };

  const callTriePrediction = (event: ChangeEvent<HTMLInputElement>): void => {
    // const predictedText = predictFromTrie(event.target.value);
    console.log('in call');
    const predictedText: string = 'prediction';
    if (predictedText !== '') {
      setPredicted(predictedText);
      const newText = event.target.value + predictedText;
      if (autocompleteRef.current) {
        autocompleteRef.current.textContent = newText;
      }
      setFoundName(newText);
    } else {
      setPredicted('');
      const newText1 = event.target.value + predicted;
      if (autocompleteRef.current) {
        autocompleteRef.current.textContent = newText1;
      }
      setFoundName(newText1);
    }
  };

  const scrolltobototm = (): void => {
    const target = autocompleteRef.current;
    const target1 = mainInputRef.current;
    setInterval(() => {
      if (target && target1) {
        target.scrollTop = target1.scrollHeight;
      }
    }, 1000);
  };

  useEffect(() => {
    const handleKeyUp = (e: any): void => {
      if (mainInputRef.current && autocompleteRef.current) {
        if (mainInputRef.current.value === '') {
          autocompleteRef.current.textContent = '';
          return;
        }
  
        if (e.keyCode === 32) {
          callTriePrediction(e);
          scrolltobototm();
          return;
        }
  
        // Handle other key events...
      }
    };
  
    if (mainInputRef.current) {
      mainInputRef.current.addEventListener('keyup', handleKeyUp);
    }
  
    return () => {
      if (mainInputRef.current) {
        mainInputRef.current.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [callTriePrediction, scrolltobototm]);  

  // Rest of the code...

  return (
    <div>
        {/* <textarea id="autocomplete" type="text" class="vc_textarea" ></textarea>
        <textarea id="mainInput" type="text" name="comments" placeholder="Write some text" class="vc_textarea" ></textarea> */}
        {/* <input id="mainInput" ref={mainInputRef} className="vc_textarea" placeholder="Write some text"/>
        <div id="autocomplete" ref={autocompleteRef} className="vc_textarea"></div> */}
        <textarea id="autocomplete" className="vc_textarea" ref={mainInputRef}></textarea>
      <textarea
        id="mainInput"
        name="comments"
        placeholder="Write some text"
        className="vc_textarea"
        ref={autocompleteRef}
      ></textarea>
    </div>
  );
};

export default Autocomplete;
