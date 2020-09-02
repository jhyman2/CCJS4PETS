import React, { useEffect, useState } from 'react';
import { Pet } from './types';

import SinglePet from './SinglePet';

type Props = {
  petsStale: boolean
  setPetsStale: (b: boolean) => void
}

const RestPets = ({ petsStale, setPetsStale }: Props) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([] as Pet[]);

  useEffect(() => {
    if (petsStale) {
      setLoading(true);

      fetch('/pets')
        .then(res => res.json())
        .then((res) => {
          setPets(res);
          setLoading(false);
          setPetsStale(false);
        })
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
    return <div>an error has occurred</div>;
  }

  return <>{pets.map((pet: Pet) => <SinglePet {...pet} />)}</>;
};

export default RestPets;
