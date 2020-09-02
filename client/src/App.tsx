import React, { useState } from 'react';
import RestPets from './components/RestPets';
import ApolloPets from './components/ApolloPets';
import AddPetForm from './components/AddPetForm';

import './App.css';

function App() {
  const [petsStale, setPetsStale] = useState(true);

  return (
    <div className="App">
      <h1 className="text-center text-2xl">Welcome to CCJS4PETS</h1>
      <div className="flex flex-row">
        <div className="flex flex-col flex-grow">
          <h1>This data was retrieved using REST</h1>
          <RestPets petsStale={petsStale} setPetsStale={setPetsStale} />
        </div>
        <div className="flex flex-col flex-grow">
          <AddPetForm setPetsStale={setPetsStale} />
        </div>
        <div className="flex flex-col flex-grow">
          <h1>This data was retrieved using GraphQL</h1>
          <ApolloPets />
        </div>
      </div>
    </div>
  );
}

export default App;
