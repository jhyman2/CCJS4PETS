import React from 'react';
import { useQuery, gql } from '@apollo/react-hooks';

import SinglePet from './SinglePet';
import { Pet } from './types';

const GET_PETS = gql`
  query getPets {
    pets {
      bio
      breed
      img
      name
      petType
      weight
    }
  }
`;

const ApolloPets = () => {
  const { loading, error, data } = useQuery(GET_PETS, { pollInterval: 500 });

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
        {data.pets.map((pet: Pet) => <SinglePet {...pet} />)}
      </div>
    </div>
  );
};

export default ApolloPets;
