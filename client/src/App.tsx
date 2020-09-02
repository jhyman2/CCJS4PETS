import React, { useState } from 'react';
import RestPets from './components/RestPets';
import ApolloPets from './components/ApolloPets';
import AddPetForm from './components/AddPetForm';

import './App.css';

function App() {
  const [isDataStale, setIsPetsStale] = useState(true);

  return (
    <div className="App">
      <h1 className="text-center text-2xl">Welcome to CCJS4PETS</h1>
      <div className="flex flex-row">
        <div className="flex flex-col flex-grow">
          <h1>This data was retrieved using REST</h1>
          <div className="max-w-sm mx-auto flex-col p-6 bg-white rounded-lg shadow-xl overflow-auto" style={{ height: 800 }}>
            <div className="text-center">
              <RestPets
                petsStale={isDataStale}
                setPetsStale={setIsPetsStale}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <AddPetForm
            setPetsStale={setIsPetsStale}
          />
        </div>
        <div className="flex flex-col flex-grow">
          <h1>This data was retrieved using GraphQL</h1>
          <div className="max-w-sm mx-auto flex-col p-6 bg-white rounded-lg shadow-xl overflow-auto" style={{ height: 800 }}>
            <div className="text-center">
              <ApolloPets />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
