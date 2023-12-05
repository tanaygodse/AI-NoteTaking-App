import React, { RefObject } from 'react';
import Trie from '@shortwave/trie';
import './style/TypeAheadDropDown.css';

interface TypeAheadDropDownProps {
  items: Trie<string>; // Assuming 'items' is the Trie containing suggestions
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface TypeAheadDropDownState {
  suggestions: string[];
  text: string;
}

export default class TypeAheadDropDown extends React.Component<TypeAheadDropDownProps, TypeAheadDropDownState> {
  private textareaRef: RefObject<HTMLTextAreaElement>; // Declare the ref

  constructor(props: TypeAheadDropDownProps) {
    super(props);
    this.state = {
      suggestions: [],
      text: '',
    };
    this.textareaRef = React.createRef<HTMLTextAreaElement>(); // Create a ref for the textarea
  }
  
  onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { items } = this.props as any;
    const trie1: Trie<string> = items;
    let suggestions = [];
    let value = e.target.value;

    const lastSpaceIndex = value.lastIndexOf(' ');
    const searchText = lastSpaceIndex >= 0 ? value.substring(lastSpaceIndex + 1) : value;

    const specialCharacters = /[-\/\\^$*+?.()|[\]{}]/g;
    const cleanedSearchText = searchText.replace(specialCharacters, '');

    if (cleanedSearchText.length > 0) {
      suggestions = trie1.prefixSearch(cleanedSearchText, { limit: 3, unique: true });
    }

    this.setState(() => ({
      suggestions,
      text: value,
    }));

    this.props.onTextChange(value);

  };

  suggestionSelected = (value: string) => {
    const { text } = this.state;
    const textarea = this.textareaRef.current; // Access the ref using current property

    const lastSpaceIndex = text.lastIndexOf(' ');
    const searchText = lastSpaceIndex >= 0 ? text.substring(lastSpaceIndex + 1) : text;
    const startIndex = value.toLowerCase().indexOf(searchText.toLowerCase());

    if (startIndex !== -1) {
      const newText = text + value.substring(startIndex + searchText.length);

      this.setState(() => ({
        text: newText,
        suggestions: [],
      }), () => {
        textarea?.focus();
        const textLength = newText.length;
        textarea?.setSelectionRange(textLength, textLength);
      });
      this.props.onTextChange(newText);
    }
  };

  renderSuggestions = () => {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map(summary => (
          <li key={summary} onClick={(e) => this.suggestionSelected(summary)}>{summary}</li>
        ))}
      </ul>
    );
  };

  render() {
    const { text } = this.state;
    return (
      <div className="TypeAheadDropDown">
        <textarea
          ref={this.textareaRef}
          onChange={this.onTextChange}
          placeholder="Your Notes..."
          value={text}
        />
        {this.renderSuggestions()}
      </div>
    );
  }
}
