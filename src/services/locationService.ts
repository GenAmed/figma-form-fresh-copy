
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

// Function to convert coordinates to address
export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    // Solution de contournement en utilisant une API proxy ou un service alternatif
    // Pour le moment, nous utilisons une version simplifiée qui formate juste les coordonnées
    // car l'API Nominatim bloque les requêtes depuis notre domaine
    
    // Formatage basique des coordonnées comme adresse de secours
    return `Localisation: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    
    /* La méthode ci-dessous est commentée car elle ne fonctionne pas actuellement
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération de l'adresse");
    }
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return data.display_name;
    } else {
      return "Adresse non disponible";
    }
    */
  } catch (error) {
    console.error("Erreur de géocodage inverse:", error);
    return "Erreur lors de la récupération de l'adresse";
  }
};
