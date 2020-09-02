import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/react-hooks';

const inputClassNames = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 my-2 focus:outline-none focus:shadow-outline';
const buttonClassNames = 'bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow';

const ADD_NEW_PET = gql`
  mutation addPetFromUser($petInput: PetInput!) {
    addNewPet(petInput: $petInput) {
      id
      bio
      breed
      img
      name
      petType
      weight
    }
  }
`;

type Props = {
  setPetsStale: (b: boolean) => void,
}

const ApolloPets = (props: Props) => {
  const [bio, setBio] = useState('');
  const [breed, setBreed] = useState('');
  const [img, setImg] = useState('');
  const [name, setName] = useState('');
  const [petType, setPetType] = useState('');
  const [weight, setWeight] = useState('');
  const [addNewPet] = useMutation(ADD_NEW_PET);

  const clearInputs = () => {
    setBio('');
    setBreed('');
    setImg('');
    setName('');
    setPetType('');
    setWeight('');
  };

  const createPetWithGraphQL = () => {
    addNewPet({
      variables: {
        petInput: {
          bio,
          breed,
          img,
          name,
          petType,
          weight: parseInt(weight),
        },
      },
      // want to see some magic?
      // refetchQueries: () => ['getPets'],
    });

    clearInputs();
  };

  const createPetWithRest = async () => {
    const response = await fetch('http://localhost:3000/add_new_pet', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bio,
        breed,
        img,
        name,
        petType,
        weight: parseInt(weight),
      }),
    });

    await response.json();

    // indicate to our rest component that we need to refetch
    props.setPetsStale(true);

    clearInputs();
  };

  return (
    <div className="max-w-sm mx-auto flex-col mt-20 rounded-lg shadow-xl">
      <div className="flex flex-col">
        <input
          className={inputClassNames}
          type="text"
          placeholder="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className={inputClassNames}
          type="text"
          placeholder="bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
        <input
          className={inputClassNames}
          type="text"
          placeholder="breed"
          value={breed}
          onChange={e => setBreed(e.target.value)}
        />
        <input
          className={inputClassNames}
          type="text"
          placeholder="img"
          value={img}
          onChange={e => setImg(e.target.value)}
        />
        <input
          className={inputClassNames}
          type="text"
          placeholder="pet type (cat or dog)"
          value={petType}
          onChange={e => setPetType(e.target.value)}
        />
        <input
          className={inputClassNames}
          type="number"
          placeholder="weight"
          value={weight}
          onChange={e => setWeight(e.target.value)}
        />
        <button
          className={buttonClassNames}
          onClick={createPetWithGraphQL}
        >
          Create pet using GraphQL
        </button>
        <button
          className={buttonClassNames}
          onClick={createPetWithRest}
        >
          Create pet using REST
        </button>
      </div>
    </div>
  );
};

export default ApolloPets;
