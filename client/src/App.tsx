import React, { Component, useState, useEffect } from "react";

import axios from "axios";

import {
  PdfLoader,
  PdfHighlighter,
  Highlight,
  Popup,
  AreaHighlight,
} from "react-pdf-highlighter";

import Tip from './Tip';

import type { IHighlight, NewHighlight } from "react-pdf-highlighter";

import { testHighlights as _testHighlights } from "./test-highlights";
import { Spinner } from "./Spinner";
import { Sidebar } from "./Sidebar";

import Trie from '@shortwave/trie';

import "./style/App.css";



const App = () =>{
  
  const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const parseIdFromHash = () =>
  document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const HighlightPopup = ({
  comment,
}: {
  comment: { text: string };
}) =>
  comment.text ? (
    <div className="Highlight__popup">
      {comment.text}
    </div>
  ) : null;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/2307.15455.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

console.log(searchParams);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;

const [url, setUrl] = useState(initialUrl);
const [highlights, setHighlights] = useState(testHighlights[initialUrl] ? testHighlights[initialUrl] : []);
const [trie, setTrie] = useState<Trie<string> | undefined>(undefined);
const [summary, setSummary] = useState("");

const resetHighlights = () =>{
  setHighlights([]);
};

const toggleDocument = () =>{
  const newUrl = url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
  fetchHighlights(newUrl);
};

const scrollViewerTo = (highlight: any) =>{
};

const scrollToHighlightFromHash = () =>{
  const highlight = getHighlightById(parseIdFromHash());
  if(highlight){
    scrollViewerTo(highlight);
  }
}

useEffect(() => {
  const scrollToHighlightFromHash = () => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      scrollViewerTo(highlight);
    }
  };

  window.addEventListener("hashchange", scrollToHighlightFromHash, false);
  fetchHighlights(initialUrl);

  return () => {
    window.removeEventListener("hashchange", scrollToHighlightFromHash, false);
  };
}, [initialUrl]);

const fetchHighlights = async (newUrl: string) => {
  // Use axios to make a GET request
  await axios
    .get("http://localhost:5001/posts", {params: { url: newUrl }})
    .then((response) => {
      const { data } = response;
      if(data !== null){
        setUrl(newUrl);
        setHighlights(data[newUrl] ? [...data[newUrl]] : [])
      }else{
        setUrl(newUrl);
        setHighlights([]);
      }
    })
    .catch((error) => {
      console.error("Error fetching highlights:", error);
    });
}



const getHighlightById = (id: string) => {
  return highlights.find((highlight) => highlight.id === id);
}

const addHighlight = async (highlight: NewHighlight) => {    
  try {
  // Save highlight to the backend
  const url = initialUrl;
  const response = await axios.post('http://localhost:5001/posts', {
    // Assuming NewHighlight structure matches your PostData structure
    [url] :{
      content: highlight.content,
      position: highlight.position,
      comment: highlight.comment,
    }
  });

  const savedHighlight = response.data;
  console.log('Saved highlight to the backend:', savedHighlight);

  // Update state with the new highlight and its ID from the server
  
  setHighlights([...highlights, { ...savedHighlight }])

  console.log('State after adding highlight:', JSON.stringify(highlights));
} catch (error) {
  console.error('Error saving highlight:', error);
  // Handle the error as needed
}
}

const summarizeHighlight = async (highlight: NewHighlight) => { 
    await axios
    .get("http://localhost:105/summarize", {params: { text: highlight.content.text }})
    .then((response) => {
      const { data } = response;
      if(data !== null){
        setSummary(data);
        
      }else{
        setSummary("");
      }
      console.log("summarize in app tsx")
    })
    .catch((error) => {
      console.error("Error fetching summary:", error);
    });
}

useEffect(() => {
  console.log('summary changed in app');
  console.log(summary);
  console.log('summary in app changed')
}, [summary]);

const updateHighlight = (highlightId: string, position: Object, content: Object)=> {
  console.log("Updating highlight", highlightId, position, content);

  setHighlights((prevHighlights) =>
  prevHighlights.map((h) => {
      const {
        id,
        position: originalPosition,
        content: originalContent,
        ...rest
      } = h;
      return id === highlightId
        ? {
          id,
          position: { ...originalPosition, ...position },
          content: { ...originalContent, ...content },
          ...rest,
        }
        : h;
    })
    );
}
const generateTrie = async () => {
  try {
    const response = await axios.get('http://localhost:105/generate/', {
      params: {
        url: url,
      },
    });

    // Handle the response here
    const { data } = response;
    if (data !== null) {
      const trie1 = new Trie<string>();
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          trie1.add({
            key: key,
            value: key,
            score: data[key],
          });
        }
      }
      setTrie(trie1);
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
  }
};
useEffect(() => {
  generateTrie();
}, []);
  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      
      <div
        style={{
          height: "100vh",
          width: "75vw",
          position: "relative",
        }}
      >
        <PdfLoader url={url} beforeLoad={<Spinner />}>
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={resetHash}
              // pdfScaleValue="page-width"
              scrollRef={(scrollTo) => {
                //scrollViewerTo = scrollTo;
  
                scrollToHighlightFromHash();
              }}
              onSelectionFinished={(
                position,
                content,
                hideTipAndSelection,
                transformSelection
              ) => (
                <Tip
                  onOpen={transformSelection}
                  onConfirm={(comment) => {
                    addHighlight({ content, position, comment });
  
                    hideTipAndSelection();
                  }}
                  onSummarize={(comment) => {
                    summarizeHighlight({ content, position, comment });
                  }}
                  trie={trie}
                  summary={summary}
                />
              )}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => {
                const isTextHighlight = !Boolean(
                  highlight.content && highlight.content.image
                );
  
                const component = isTextHighlight ? (
                  <Highlight
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) => {
                      updateHighlight(
                        highlight.id,
                        { boundingRect: viewportToScaled(boundingRect) },
                        { image: screenshot(boundingRect) }
                      );
                    }}
                  />
                );
  
                return (
                  <Popup
                    popupContent={<HighlightPopup {...highlight} />}
                    onMouseOver={(popupContent) =>
                      setTip(highlight, (highlight) => popupContent)
                    }
                    onMouseOut={hideTip}
                    key={index}
                    children={component}
                  />
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      </div>
      <Sidebar
        highlights={highlights}
        resetHighlights={resetHighlights}
        toggleDocument={toggleDocument}
      />
    </div>
  );
}


export default App;
