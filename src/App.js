import React from 'react';
import BlackjackGame from './BlackjackGame';
import './App.css'; // Optional: App-specific styles

const App = () => {
  return (
    <div className="App">
      {/* You could add a header, navigation, multiple pages, etc. */}
      <BlackjackGame />
      
      {/* In a bigger app, you might have: */}
      {/* <Header /> */}
      {/* <Navigation /> */}
      {/* <Footer /> */}
    </div>
  );
};

export default App;