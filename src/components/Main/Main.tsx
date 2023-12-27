// Main/Main.tsx

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface IPlanets {
  id: any;
  name: string;
}

const Main: React.FC = () => {
  const [planets, setPlanets] = useState<IPlanets[]>([]);
  async function fetchPlanets() {
    const response = await fetch('https://swapi.dev/api/planets');
    const data = await response.json();
    setPlanets(data.results);
  }

  useEffect(() => {
    fetchPlanets();
  }, []);

  const planetImage = [
    'https://oyster.ignimgs.com/mediawiki/apis.ign.com/star-wars-episode-7/4/4b/Tatooine-3.jpg',
    'https://upload.wikimedia.org/wikipedia/en/6/60/Alderaan250ppx.PNG',
    'https://static.wikia.nocookie.net/starwars/images/d/d4/Yavin-4-SWCT.png/revision/latest/thumbnail/width/360/height/360?cb=20181015023938',
    'https://static.wikia.nocookie.net/starwars/images/8/81/Hoth_AoRCR.png/revision/latest?cb=20170222025915',
    'https://static.wikia.nocookie.net/starwars/images/4/48/Dagobah_ep3.jpg/revision/latest?cb=20100122163146',
    'https://static.wikia.nocookie.net/starwars/images/2/2c/Bespin_EotECR.png/revision/latest?cb=20170222012550',
    'https://static.wikia.nocookie.net/starwars/images/5/50/Endor_FFGRebellion.png/revision/latest?cb=20170529052722',
    'https://static.wikia.nocookie.net/starwars/images/f/f0/Naboo_planet.png/revision/latest?cb=20190210065915',
    'https://static.wikia.nocookie.net/starwars/images/1/16/Coruscant-EotE.jpg/revision/latest?cb=20130908205521',
    'https://static.wikia.nocookie.net/starwars/images/a/a9/Eaw_Kamino.jpg/revision/latest?cb=20090527045541'
  ];

  const itemsPerPage = 20;
  const totalPages = Math.ceil(planets.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPlanets = planets.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const router = useRouter();

  const handleClick = (id: number) => {
    router.push(`/planets/${id}`);
  };

  return (
    <div className="container mx-auto mt-8 p-5">
      <div className="flex items-center mb-4">
        <h1 className="text-4xl font-bold mr-4 flex items-center mt-4 justify-center">
          Our Planets
        </h1>
        {/* <img
          src="/path/to/planet_group.jpg"
          alt="Group of planets"
          className="w-20 h-20 object-cover rounded-full"
        /> */}
      </div>

      {planets.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPlanets.map((planet, index) => (
            <div
              key={planet.name}
              className="md:col-span-1 cursor-pointer"
              onClick={() => handleClick(index + 1)}
            >
              <Image
                src={planetImage[index]}
                alt={planet.name}
                width={300}
                height={300}
                object-fit="cover"
              />
              <h2 className="text-2xl font-bold mb-4 text-white">{planet.name}</h2>
              {/* <p>{planet.description}</p> */}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-2 p-2 ${
              currentPage === index + 1 ? 'bg-gray-800 text-white' : 'bg-gray-300 text-gray-800'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Main;
