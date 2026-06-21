import propertiesData from "@/data/properties.json";

const { properties, filters } = propertiesData;

export function getAllProperties() {
  return properties;
}

export function getPropertyById(id) {
  return properties.find((p) => p.id === id) || null;
}

export function getFeaturedProperties() {
  return properties.filter((p) => p.featured);
}

export function getFilteredProperties({
  type,
  location,
  bhk,
  minPrice,
  maxPrice,
  status,
  subtype,
} = {}) {
  let filtered = [...properties];

  if (type) {
    filtered = filtered.filter((p) => p.type === type);
  }

  if (subtype) {
    filtered = filtered.filter((p) => p.subtype === subtype);
  }

  if (location) {
    filtered = filtered.filter((p) => p.location.area === location);
  }

  if (bhk) {
    if (bhk === "4+") {
      filtered = filtered.filter((p) => {
        const match = p.configuration.match(/^(\d+)/);
        return match && parseInt(match[1]) >= 4;
      });
    } else {
      filtered = filtered.filter((p) => p.configuration.includes(bhk));
    }
  }

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  return filtered;
}

export { filters };

export function getFilters() {
  return filters;
}

export function getRelatedProperties(propertyId, limit = 3) {
  const property = getPropertyById(propertyId);
  if (!property) return [];

  return properties
    .filter(
      (p) =>
        p.id !== propertyId &&
        (p.type === property.type || p.location.area === property.location.area)
    )
    .slice(0, limit);
}
