import React, { useState, useRef, useEffect, ChangeEvent } from 'react';


import "./style/Autocomplete.css";

// Assume you have a trie implementation
const trie: any = 1; // Replace 'any' with the actual type of your trie

const Autocomplete: React.FC = () => {
  const [foundName, setFoundName] = useState<string>('');
  const [predicted, setPredicted] = useState<string>('');
  const [autocomplete, setAutocomplete] = useState<string>('');
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
    const predictedText: string = 'prediction';
    if (predictedText !== '') {
      setPredicted(predictedText);
      const newText = mainInputRef.current.value + predictedText;
      if (autocompleteRef.current) {
        autocompleteRef.current.textContent = newText;
        setAutocomplete(newText);
      }
      setFoundName(newText);
    } else {
      setPredicted('');
      const newText1 = mainInputRef.current.value + predicted;
      if (autocompleteRef.current) {
        autocompleteRef.current.textContent = newText1;
        setAutocomplete(newText1);
      }
      setFoundName(newText1);
    }
  };

  const scrolltobottom = (): void => {
    const target = autocompleteRef.current;
    const target1 = mainInputRef.current;
    setTimeout(() => {
      if (target && target1) {
        target.scrollTop = target1.scrollHeight;
      }
    }, 1000);
  };

  useEffect(() => {
    const handleMainInputChange = (): void => {
        const newAutocomplete = predictFromTrie(mainInputRef.current.value);
        setAutocomplete(newAutocomplete);
    };

    const handleKeyUp = (e) => {
        // Check if null value is entered
        if (mainInputRef.current.value === '') {
          setAutocomplete('');
          return;
        }
    
        // Check if space key is pressed
        if (e.keyCode === 32) {
          callTriePrediction(e);
          scrolltobottom();
          return;
        }
    
        // Check if Backspace key is pressed
        if (e.key === 'Backspace') {
            console.log('In Backspace');
            setPredicted('');
            setApibusy(true);
            const newText = mainInputRef.current.value;
            autocompleteRef.current.value = newText;
            setAutocomplete(newText);
            if (mainInputRef.current.value === '') {
                setAutocomplete('');
            }
            return;
        }
    
        // Check if ArrowRight or Tab key is pressed
        if (e.key !== 'ArrowRight') {
          if (autocomplete !== '' && predicted) {
            const firstCharacter = predicted.charAt(0);
            console.log('fc');
            console.log(firstCharacter);
            if (e.key === firstCharacter) {
              const s1 = predicted;
              const s2 = s1.slice(1);
              setPredicted(mainInputRef.current.value + s2);
              setApibusy(true);
            } else {
              setAutocomplete('');
              setApibusy(false);
            }
          } else {
            setAutocomplete('');
            setApibusy(false);
          }
          return;
        } else {
          if (predicted) {
            if (apibusy === true) {
              setApibusy(false);
            }
            if (apibusy === false) {
              mainInputRef.current.value = mainInputRef.current.value + predicted;
              setAutocomplete('');
            }
          } else {
            return;
          }
        }
      };
  
    if (mainInputRef.current) {
      mainInputRef.current.addEventListener('keyup', handleKeyUp);
      mainInputRef.current.addEventListener('input', handleMainInputChange);
    }
  
    return () => {
      if (mainInputRef.current) {
        mainInputRef.current.removeEventListener('keyup', handleKeyUp);
        mainInputRef.current.addEventListener('input', handleMainInputChange);
      }
    };
  }, [callTriePrediction, scrolltobottom]);  

  // Rest of the code...

  return (
    <div style={{position: "relative"}}>
        {/* <textarea id="autocomplete" type="text" class="vc_textarea" ></textarea>
        <textarea id="mainInput" type="text" name="comments" placeholder="Write some text" class="vc_textarea" ></textarea> */}
        {/* <input id="mainInput" ref={mainInputRef} className="vc_textarea" placeholder="Write some text"/>
        <div id="autocomplete" ref={autocompleteRef} className="vc_textarea"></div> */}
        <textarea id="autocomplete" 
        className="vc_textarea" 
        ref={autocompleteRef}
        >{autocomplete}</textarea>
        <textarea
        id="mainInput" 
        name="comments"
        placeholder="Write some text"
        className="vc_textarea"
        ref={mainInputRef}>
        </textarea>
    </div>
  );
};

export default Autocomplete;
