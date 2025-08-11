// Norte (0° ou 360°), 
// Leste (90°), 
// Sul (180°) e 
// Oeste (270°). 
// Nordeste (45°), 
// Sudeste (135°), 
// Sudoeste (225°) 
// Noroeste (315°)

const getWindDirection = (windDirection) =>{
    if ((windDirection >= 0 && windDirection < 22.5) || (windDirection >= 337.5 && windDirection <= 360)) return 'Norte - ⬆ ';
    if (windDirection >= 22.5 && windDirection < 67.5) return 'Nordeste - ↗';
    if (windDirection >= 67.5 && windDirection < 112.5) return 'Leste - ➡';
    if (windDirection >= 112.5 && windDirection < 157.5) return 'Sudeste - ↘';
    if (windDirection >= 157.5 && windDirection < 202.5) return 'Sul - ⬇';
    if (windDirection >= 202.5 && windDirection < 247.5) return 'Sudoeste - ↙';
    if (windDirection >= 247.5 && windDirection < 292.5) return 'Oeste - ⬅';
    if (windDirection >= 292.5 && windDirection < 337.5) return 'Noroeste - ↖';
}

export default getWindDirection