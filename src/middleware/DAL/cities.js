export function citiesDAL(cities) {
  const mappedCities = Object.values(cities).map(city => {
    city.humanized_city_names = JSON.parse(city.humanized_city_names);
    city.nameRu = city.humanized_city_names.ru;
    city.nameEn = city.humanized_city_names.en;
    return city;
  });

  return mappedCities;
};
