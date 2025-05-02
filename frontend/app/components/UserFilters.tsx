// components/UserFilters.tsx

import React from 'react';
import { FiFilter } from 'react-icons/fi';

interface UserFiltersProps {
  show: boolean;
  onToggle: () => void;
  gender: 'all' | 'male' | 'female';
  setGender: (value: 'all' | 'male' | 'female') => void;
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
  matchInterestsOnly: boolean;
  setMatchInterestsOnly: (value: boolean) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  show,
  onToggle,
  gender,
  setGender,
  ageRange,
  setAgeRange,
  maxDistance,
  setMaxDistance,
  matchInterestsOnly,
  setMatchInterestsOnly
}) => {
  return (
    <div className="w-full max-w-md mb-4">
      <button
        onClick={onToggle}
        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-gray-200 text-gray-700 shadow-md transition duration-200 ease-in-out"
      >
        <FiFilter />
        <span>Filtres</span>
      </button>

      {show && (
        <div className="mt-2 p-4 rounded-lg bg-white shadow-md space-y-4 text-sm">
          <div>
            <label>Genre :</label>
            <select
              className="ml-2 p-1 border-[0.5px] rounded"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'all' | 'male' | 'female')}
            >
              <option value="all">Tous</option>
              <option value="male">Hommes</option>
              <option value="female">Femmes</option>
            </select>
          </div>

          <div>
            <label>Tranche d'âge : </label>
            <input
              type="number"
              min="18"
              max="100"
              value={ageRange[0]}
              onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])}
              className="w-16 mx-1 border-[0.5px] p-1 rounded"
            />
            <span>-</span>
            <input
              type="number"
              min="18"
              max="100"
              value={ageRange[1]}
              onChange={(e) => setAgeRange([ageRange[0], +e.target.value])}
              className="w-16 mx-1 border-[0.5px] p-1 rounded"
            />
            ans
          </div>

          <div>
            <label>Distance max :</label>
            <input
              type="number"
              value={maxDistance}
              onChange={(e) => setMaxDistance(+e.target.value)}
              className="ml-2 w-20 border-[0.5px] p-1 rounded"
            />
            <span className="ml-1">km</span>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={matchInterestsOnly}
                onChange={() => setMatchInterestsOnly(!matchInterestsOnly)}
                className="mr-2"
              />
              Centre d'intérêt commun
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFilters;
