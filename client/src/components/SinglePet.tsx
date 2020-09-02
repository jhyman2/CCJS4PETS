import React from 'react';

import { Pet } from './types';

const SinglePet = ({ name, breed, img, bio, weight, petType}: Pet) => (
  <div className="my-8 block" key={name}>
    <div className="flex flex-row">
      <img
        className="rounded-full"
        alt={name}
        height={100}
        src={img}
        width={100}
      />
      <div className="flex flex-col text-left ml-8 text-sm justify-center">
        <span className="font-black">{name}</span>
        <span className="italic">{breed}</span>
        <span>{bio}</span>
      </div>
    </div>
  </div>
);

export default SinglePet;
