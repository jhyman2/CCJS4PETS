import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/react-hooks';
import './App.css';

const GET_PETS = gql`
  query getPets {
    pets {
      bio
      breed
      img
      name
      weight
    }
  }
`;

type Pet = {
  bio: string
  breed: string
  img: string
  name: string
  weight: number
}

const RestPets = () => {
  const [petTypes, setPetTypes] = useState([] as Pet[]);

  useEffect(() => {
    fetch('/pets')
      .then(res => res.json())
      .then((res => setPetTypes(res)));
  }, []);

  return (
    <>
      {petTypes.map((pet: Pet) => <div key={pet.name}>{pet.name}</div>)}
    </>
  );
};

const ApolloPets = () => {
  const { loading, error, data } = useQuery(GET_PETS);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h5>An error has occurred</h5>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto flex-col p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-center text-2xl">Welcome to CCJS4PETS</h1>
      <p className="text-center">Login or Register with:</p>
      <div className="text-center">
        {data.pets.map((pet: Pet) => (
          <div key={pet.name} style={{ display: 'block', margin: 20 }}>
            <span style={{ fontWeight: 'bolder' }}>{pet.name}</span>
            <img
              alt={pet.name}
              height={150}
              src={pet.img}
              width={150}
            />
            <span>{pet.breed}</span>
            <span>{pet.bio}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>This data was retrieved using REST</h1>
      <RestPets />
      <h1>This data was retrieved using GraphQL</h1>
      <ApolloPets />
    </div>
  );
}

export default App;
