import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import Trie from '@shortwave/trie';
import "./style/Autocomplete.css";
import { StringLiteral } from 'typescript';

interface Props {
  trie: Trie<string>;
  summary: string;
}

const Autocomplete: React.FC<Props> = ({ trie }) => {
  const [foundName, setFoundName] = useState<string>('');
  const [predicted, setPredicted] = useState<string>('');
  const [mainInput, setMainInput] = useState<string>('');
  const [autocomplete, setAutocomplete] = useState<string>('');

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
      const inputText = mainInput;
      const lastSpaceIndex = inputText.lastIndexOf(' ');
  
      if (lastSpaceIndex !== -1) {
          const keystrokesAfterSpace = inputText.substring(lastSpaceIndex + 1);
  
          console.log('Keystrokes after space:', keystrokesAfterSpace);
  
      }
      const predictedText: string = 'prediction';
      if (predictedText !== '') {
        setPredicted(predictedText);
        const newText = mainInput + predictedText;
        if (autocompleteRef.current) {
          autocompleteRef.current.textContent = newText;
          setAutocomplete(newText);
        }
        setFoundName(newText);
      } else {
        setPredicted('');
        const newText1 = mainInput + predicted;
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
      const newAutocomplete = predictFromTrie(mainInput);
      setAutocomplete(newAutocomplete);
  };

  const handleKeyUp = (e) => {
    console.log("keycode");
    console.log(e.keyCode);
    console.log("mainInput");
    console.log(mainInput);
  
    // Check if null value is entered
    if (mainInput === '') {
      setAutocomplete('');
      return;
    }
  
    // Check if space key is pressed
    if (e.keyCode === 32) {
      console.log('in space');
      callTriePrediction(e);
      scrolltobottom();
      return;
    }
  
    // Check if Backspace key is pressed
    if (e.key === 'Backspace') {
      console.log('In Backspace');
          setPredicted('');
          const newText = mainInput;
          setAutocomplete(newText);
          if (mainInput === '' || mainInput.length === 1) {
            console.log('should set to blank');
            setAutocomplete('');
          }
          return;
    }
  
    // Check if ArrowRight key is pressed
    if (e.key === 'ArrowRight') {
      console.log("predicted");
      console.log(predicted);
  
      // Check if predicted is not an empty string
      if (predicted) {
        setMainInput((prevMainInput) => prevMainInput + predicted);
        setAutocomplete(mainInput + predicted);

      } else {
        return;
      }
    } else {
      console.log('in else');
      if (autocomplete !== '' && predicted) {
        const firstCharacter = predicted.charAt(0);
        console.log('fc');
        console.log(firstCharacter);
        if (e.key === firstCharacter) {
          const s1 = predicted;
          const s2 = s1.slice(1);
          setPredicted(mainInput + s2);
        } else {
          setAutocomplete('');
        }
      } else {
        setAutocomplete('');
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
  }, [mainInput]);

  const mainInputFunction = (event) => {
    setMainInput(event.target.value);
  }

  const autocompleteFunction = (event) => {
    setAutocomplete(event.target.value);
  }

  return (
    <div style={{position: "relative"}}>
       {/* <textarea id="autocomplete" type="text" class="vc_textarea" ></textarea>
        <textarea id="mainInput" type="text" name="comments" placeholder="Write some text" class="vc_textarea" ></textarea> */}
        {/* <input id="mainInput" ref={mainInputRef} className="vc_textarea" placeholder="Write some text"/>
        <div id="autocomplete" ref={autocompleteRef} className="vc_textarea"></div> */}
        <textarea id="autocomplete" 
        className="vc_textarea" 
        ref={autocompleteRef}
        onChange={autocompleteFunction}
        value={autocomplete}
        >{autocomplete}</textarea>
        <textarea
        id="mainInput" 
        name="comments"
        placeholder="Write some text"
        className="vc_textarea"
        onChange={mainInputFunction}
        ref={mainInputRef}
        value={mainInput}>
        {mainInput}
        </textarea>
    </div>
  );
};

export default Autocomplete;
