import React, { Component } from "react";
import Autocomplete from "./Autocomplete";
import "./style/Tip.css";

interface State {
  compact: boolean;
  text: string;
}

interface Props {
  onConfirm: (comment: { text: string; }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

export class Tip extends Component<Props, State> {
  state: State = {
    compact: true,
    text: "",
  };

  // for TipContainer
  componentDidUpdate(nextProps: Props, nextState: State) {
    const { onUpdate } = this.props;

    if (onUpdate && this.state.compact !== nextState.compact) {
      onUpdate();
    }
  }

  render() {
    const { onConfirm, onOpen } = this.props;
    const { compact, text } = this.state;

    return (
      <div className="Tip">
        {compact ? (
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              this.setState({ compact: false });
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
              <Autocomplete></Autocomplete>
              <textarea
                placeholder="Your comment"
                autoFocus
                value={text}
                onChange={(event) =>
                  this.setState({ text: event.target.value })
                }
                ref={(node) => {
                  if (node) {
                    node.focus();
                  }
                }}
              />
            </div>
            <div>
              <input type="submit" value="Save" />
            </div>
          </form>
        )}
      </div>
    );
  }
}

export default Tip;