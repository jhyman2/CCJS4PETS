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
  const { loading, error, data } = useQuery(GET_PETS);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>an error has occurred</div>;
  }

  return data.pets.map((pet: Pet) => <SinglePet {...pet} />);
};

export default ApolloPets;