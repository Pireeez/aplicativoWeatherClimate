//crio um objeto de mapeamento com cód e desc

const arrayWeatherDesc = [
  0, "Céu limpo",
  1, "Principalmente limpo",
  2, "Parcialmente nublado",
  3, "Nublado",
  45, "Nevoeiro",
  48, "Nevoeiro com geada",
  51, "Chuvisco leve",
  53, "Chuvisco moderado",
  55, "Chuvisco forte",
  61, "Chuva leve",
  63, "Chuva moderada",
  65, "Chuva forte",
  66, "Chuva de granizo leve",
  67, "Chuva de granizo forte",
  71, "Nevasca leve",
  73, "Nevasca moderada",
  75, "Nevasca forte",
  77, "Neve granular",
  80, "Pancadas de chuva leves",
  81, "Pancadas de chuva moderadas",
  82, "Pancadas de chuva fortes",
  85, "Pancadas de neve leves",
  86, "Pancadas de neve fortes",
  95, "Trovoada",
  96, "Trovoada com granizo leve",
  99, "Trovoada com granizo forte"
];

const weatherCodeMap = (() => {
    const obj = {};
    for(let i = 0; i < arrayWeatherDesc.length; i++){
        if(i % 2 === 0){
            const cod = arrayWeatherDesc[i];
            const desc = arrayWeatherDesc[i + 1]
            obj[cod] = desc
        }
    }
    return obj;
})();

export default weatherCodeMap;