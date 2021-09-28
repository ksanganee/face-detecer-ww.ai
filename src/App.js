import react, { useState } from 'react';
import './App.css';

import Amplify, { Predictions } from 'aws-amplify';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
import awsconfig from './aws-exports'

Amplify.configure(awsconfig)
Amplify.addPluggable(new AmazonAIPredictionsProvider)

function App() {
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [links, setLinks] = useState([]);

  function identifyFromFile(event) {
    setName('Searching...')
    setLinks([]);

    const file = event.target.files[0]

    if (!file) {
      return
    }

    setImageURL(URL.createObjectURL(file));

    Predictions.identify({
      entities: {
        source: {
          file,
        },
        celebrityDetection: true
      }
    }).then(result => {
      const celebrityData = result.entities[0].metadata;
      setName(celebrityData.name)
      
      if (celebrityData.urls) {
        setLinks(celebrityData.urls)
      }
    })

  }
  return (
    <div className="App">
      <div>
        <h3>Whose face is that?</h3>
        <input type="file" onChange={ identifyFromFile }></input>
        <p>Upload an image</p>
        { imageURL && <img className="image" src={ imageURL } alt="uploaded"></img> }
        <h3>{ name }</h3>
        <ul>
          { links.map((link) => <p>{ link }</p>)}
        </ul>
      </div>
    </div>
  );
}

export default App;
