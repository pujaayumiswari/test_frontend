// pages/posts/[slug].js
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

interface IPlanet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  created: string;
  edited: string;
  residents: string[]; // Array of resident URLs
  films: string[]; // Array of film URLs
}

interface IResident {
  name: string;
  // Add other resident properties as needed
}

interface IFilm {
  title: string;
  // Add other film properties as needed
}

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

function Post() {
  const router = useRouter();
  const { slug } = router.query;

  const imageIndex = parseInt(slug as string) - 1;

  // Use imageIndex in the src attribute, or provide a default value if it's undefined

  const [planet, setPlanet] = useState<IPlanet>();
  const [residents, setResidents] = useState<IResident[]>([]);
  const [films, setFilms] = useState<IFilm[]>([]);

  const fetchPlanet = useCallback(async () => {
    try {
      const response = await fetch(`https://swapi.dev/api/planets/${slug}`);
      const data = await response.json();

      console.log(response);
      console.log(data);

      setPlanet(data);

      // Fetch residents
      const residentsPromises = data.residents.map(async (residentUrl: string) => {
        const residentResponse = await fetch(residentUrl);
        const residentData = await residentResponse.json();
        return residentData;
      });

      const residentsData = await Promise.all(residentsPromises);
      setResidents(residentsData);

      // Fetch films
      const filmsPromises = data.films.map(async (filmUrl: string) => {
        const filmResponse = await fetch(filmUrl);
        const filmData = await filmResponse.json();
        return filmData;
      });

      const filmsData = await Promise.all(filmsPromises);
      setFilms(filmsData);
    } catch (error) {
      console.error('Error fetching planet:', error);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchPlanet();
    }
  }, [slug, fetchPlanet]);

  function formatDate(timestamp: string | undefined): string {
    if (!timestamp) {
      return 'N/A';
    }

    const dateObject = new Date(timestamp);
    return dateObject.toLocaleString(); // Adjust this line for a custom format if needed
  }

  return (
    <div>
      <Image
        src={planetImage[imageIndex]}
        alt={planet?.name}
        width={300}
        height={300}
        object-fit="cover"
      />
      <h1>Planet: {planet?.name}</h1>
      <h1>Rotation Period: {planet?.rotation_period}</h1>
      <h1>Orbital Period: {planet?.orbital_period}</h1>
      <h1>Diameter: {planet?.diameter}</h1>
      <h1>Climate: {planet?.climate}</h1>
      <h1>Gravity: {planet?.gravity}</h1>
      <h1>Terrain: {planet?.terrain}</h1>
      <h1>Surface Water: {planet?.surface_water}</h1>
      <h1>Population: {planet?.population}</h1>

      <h2>Residents:</h2>
      <ul>
        {residents.map((resident) => (
          <li key={resident.name}>- {resident.name}</li>
        ))}
      </ul>

      <h2>Films:</h2>
      <ul>
        {films.map((film) => (
          <li key={film.title}>- {film.title}</li>
        ))}
      </ul>
      <h1>Created: {formatDate(planet?.created)}</h1>
      <h1>Edited: {formatDate(planet?.edited)}</h1>
    </div>
  );
}

export default Post;
