import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import TypeAheadDropDown from "./TypeAheadDropDown";
import Trie from '@shortwave/trie';
import "./style/Tip.css";

interface TipProps {
  onConfirm: (comment: { text: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
  trie: Trie<string>;
}
const Tip: React.FC<TipProps> = ({
  onConfirm,
  onOpen,
  onUpdate,
  trie,
}) => {
  console.log("Tip rendered");
  const [compact, setCompact] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    if (onUpdate) {
      onUpdate();
    }
  }, []);


  return (
    <div className="Tip">
      {compact ? (
        <div
          className="Tip__compact"
          onClick={() => {
            onOpen();
            setCompact(false);
          }}
        >
          Add Note
        </div>
      ) : (
        <form
          className="Tip__card"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm({ text });
          }}
        >
          <div style={{"display": "inline-block"}}>
            {/* <Autocomplete trie={trie} summary={summary} /> */}
            {/* Replace the textarea with TypeAheadDropDown */}
            {/* <textarea
                placeholder="Your comment"
                autoFocus
                value={text}
                onChange={(event) =>
                  setText(event.target.value)
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }}
              /> */}
            <TypeAheadDropDown
            onTextChange={(text) => {
              // Use the text in Tip component
              setText(text);
            }}
              items={trie}
            />
          </div>
          <div>
            <button type="submit" value="Save">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Tip;