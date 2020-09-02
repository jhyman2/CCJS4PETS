import React, { useEffect, useState } from 'react';

import SinglePet from './SinglePet';
import { Pet } from './types';
  
type Props = {
  petsStale: boolean
  setPetsStale: (b: boolean) => void
}

const RestPets = ({ petsStale, setPetsStale }: Props) => {
  const [pets, setPets] = useState([] as Pet[]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petsStale) {
      setLoading(true);

      fetch('/pets')
        .then(res => res.json())
        .then((res => {
          setPets(res);
          setLoading(false);
          setPetsStale(false);
        }))
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [petsStale, setPetsStale]);

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
    <div className="max-w-sm mx-auto flex-col p-6 bg-white rounded-lg shadow-xl overflow-auto" style={{ height: 800 }}>
      <div className="text-center">
        {pets.map((pet: Pet) => <SinglePet {...pet} />)}
      </div>
    </div>
  );
};

export default RestPets;
