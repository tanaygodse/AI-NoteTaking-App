import React, { useState, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import TypeAheadDropDown from "./TypeAheadDropDown";
import Trie from '@shortwave/trie';
import "./style/Tip.css";

interface TipProps {
  onConfirm: (comment: { text: string }) => void;
  onSummarize: (comment: Comment) => void;
  onOpen: () => void;
  onUpdate?: () => void;
  trie: Trie<string>;
  summary: string;
}
const Tip: React.FC<TipProps> = ({
  onConfirm,
  onOpen,
  onUpdate,
  onSummarize,
  trie,
  summary,
}) => {
  console.log("Tip rendered");
  const [compact, setCompact] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    if (onUpdate) {
      onUpdate();
    }
  }, [summary]);

  useEffect(() => {
    console.log('summary changed in tip');
    setText(summary);
    console.log(summary);
  }, [summary]);

  const handleSummarize = () => {
    // Call onSummarize with the current text value
    onSummarize({ text }); // Ensure onSummarize is called with an object containing the text property
  };

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
          <div>
            {/* <Autocomplete trie={trie} summary={summary} /> */}
            {/* Replace the textarea with TypeAheadDropDown */}
            <textarea
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
              />
            <TypeAheadDropDown
            onTextChange={(text) => {
              // Use the text in Tip component
              setText(text);
            }}
              items={trie}
              summary={summary}
            />
          </div>
          <div>
            <button type="button" onClick={handleSummarize}>
              Summarize
            </button>
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