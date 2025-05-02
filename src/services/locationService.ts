
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

// Function to get current geolocation
export const getCurrentLocation = (): Promise<LocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("La géolocalisation n'est pas supportée par votre navigateur"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        resolve(locationData);
      },
      (error) => {
        let errorMessage = "Erreur de géolocalisation inconnue";
        
        switch (error.code) {
          case 1:
            errorMessage = "Permission de géolocalisation refusée";
            break;
          case 2:
            errorMessage = "Position indisponible";
            break;
          case 3:
            errorMessage = "Délai d'attente dépassé";
            break;
        }
        
        reject(new Error(errorMessage));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Function to convert coordinates to address using Google Maps Geocoding API
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    // L'API Google Maps Geocoding nécessite une clé API
    // Pour une version de démonstration, nous utiliserons une approche plus descriptive
    // en formatant les coordonnées d'une manière plus lisible
    
    // Conversion des coordonnées décimales en degrés, minutes, secondes
    const formatCoordinate = (coordinate: number, isLatitude: boolean): string => {
      const absolute = Math.abs(coordinate);
      const degrees = Math.floor(absolute);
      const minutesNotTruncated = (absolute - degrees) * 60;
      const minutes = Math.floor(minutesNotTruncated);
      const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
      
      const direction = isLatitude 
        ? (coordinate >= 0 ? 'N' : 'S') 
        : (coordinate >= 0 ? 'E' : 'O');
      
      return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
    };
    
    const latitude = formatCoordinate(lat, true);
    const longitude = formatCoordinate(lng, false);
    
    // Estimation approximative de l'adresse en France basée sur les coordonnées
    // Cette approche est très simplifiée et ne remplace pas une vraie API de géocodage
    const estimateLocation = (lat: number, lng: number): string => {
      // Coordonnées approximatives de quelques grandes villes françaises
      const cities = [
        { name: "Paris", lat: 48.8566, lng: 2.3522 },
        { name: "Marseille", lat: 43.2965, lng: 5.3698 },
        { name: "Lyon", lat: 45.7640, lng: 4.8357 },
        { name: "Toulouse", lat: 43.6045, lng: 1.4440 },
        { name: "Nice", lat: 43.7101, lng: 7.2620 },
        { name: "Nantes", lat: 47.2184, lng: -1.5536 },
        { name: "Strasbourg", lat: 48.5734, lng: 7.7521 },
        { name: "Montpellier", lat: 43.6112, lng: 3.8767 },
        { name: "Bordeaux", lat: 44.8378, lng: -0.5792 },
        { name: "Lille", lat: 50.6292, lng: 3.0573 },
        { name: "Grenoble", lat: 45.1885, lng: 5.7245 }
      ];
      
      // Calcul de la distance entre deux points en km (formule de Haversine)
      const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Rayon de la Terre en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c;
        return d;
      };
      
      // Trouver la ville la plus proche
      let closestCity = cities[0];
      let minDistance = getDistanceFromLatLonInKm(lat, lng, closestCity.lat, closestCity.lng);
      
      for (let i = 1; i < cities.length; i++) {
        const distance = getDistanceFromLatLonInKm(lat, lng, cities[i].lat, cities[i].lng);
        if (distance < minDistance) {
          minDistance = distance;
          closestCity = cities[i];
        }
      }
      
      // Déterminer la direction relative
      const getDirection = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
        const directions = ["Nord", "Nord-Est", "Est", "Sud-Est", "Sud", "Sud-Ouest", "Ouest", "Nord-Ouest"];
        const angle = Math.atan2(lat2 - lat1, lon2 - lon1) * 180 / Math.PI;
        const index = Math.round(((angle + 180) % 360) / 45) % 8;
        return directions[index];
      };
      
      const direction = getDirection(closestCity.lat, closestCity.lng, lat, lng);
      
      if (minDistance < 5) {
        return `À proximité du centre de ${closestCity.name}`;
      } else if (minDistance < 20) {
        return `Environ ${Math.round(minDistance)} km ${direction} de ${closestCity.name}`;
      } else {
        return `Région à ${Math.round(minDistance)} km ${direction} de ${closestCity.name}`;
      }
    };
    
    const estimatedLocation = estimateLocation(lat, lng);
    
    return `${estimatedLocation} (${latitude}, ${longitude})`;
    
    /* 
    // Code commenté pour l'utilisation future avec l'API Google Maps
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=VOTRE_CLE_API_GOOGLE`
    );
    
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de l'adresse");
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      return "Adresse non disponible";
    }
    */
  } catch (error) {
    console.error("Erreur de géocodage inverse:", error);
    return "Erreur lors de la récupération de l'adresse";
  }
};
