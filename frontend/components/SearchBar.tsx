import { Search } from '@icon-park/react';
import fuzzysort from 'fuzzysort';
import React, { FC, useMemo, useRef, useState } from 'react';

interface ISearchBarProps {
  list: string[];
}

const SearchBar: FC<ISearchBarProps> = ({ list }) => {
  const [hidden, setHidden] = useState(true);
  const [value, setValue] = useState('');

  const getMatches = () => {
    const results = fuzzysort.go(value, list);

    const sorted = [...results].sort((a, b) => {
      if (a.score < b.score) {
        return 1;
      }

      if (a.score > b.score) {
        return -1;
      }

      return a.target.localeCompare(b.target);
    });

    return sorted;
  };

  const results = useMemo(getMatches, [value, list]);

  const ref = useRef<HTMLDivElement>(null);

  const hideResults = (ev: Event) => {
    console.log(ev.target);
    console.log(ref.current);
    if (
      ev.target == ref.current ||
      (ref.current && ref.current.contains(ev.target as Element))
    ) {
      return;
    }

    setHidden(true);
    document.removeEventListener('mousedown', hideResults);
  };

  const showResults = () => {
    setHidden(false);
    document.addEventListener('mousedown', hideResults);
  };

  return (
    <div ref={ref} className="w-full">
      <div className="bg-white rounded-md border flex flex-row items-center space-x-2 p-2">
        <div className="flex-grow bg-slate-100 rounded-md flex flex-row items-center space-x-2 p-2">
          <Search theme="outline" size="20" fill="#333" />
          <input
            className="w-full bg-slate-100 placeholder-slate-600 focus:outline-none"
            type="text"
            placeholder="Salón"
            autoComplete="off"
            onInput={hidden ? showResults : undefined}
            onChange={(ev) => setValue(ev.target.value)}
          />
        </div>
        <div className="flex-grow-0 px-2">
          <button onClick={hidden ? showResults : undefined}>BUSCAR</button>
        </div>
      </div>

      <div
        className={`bg-white rounded-md border ${
          hidden || results.length == 0
            ? 'hidden'
            : 'flex flex-row items-center'
        } space-x-2 p-2 mt-2`}
      >
        {results.map((match) => (
          <a
            href={`/classrooms/${match.target}`}
            key={match.target}
            className="hover:underline"
          >
            {match.target}
          </a>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
