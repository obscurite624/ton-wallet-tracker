import axios from 'axios';

export const fetchTonAPI = async (wallet, endpoint) => {
  try {
    const data = await axios({
      url: `https://tonapi.io/v2${wallet}${endpoint}`,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Función para parsear un address de TON a un token 'bounceable' y en 'b64url'
export const fetchTonAPIParse = async (address) => {
  try {
    const data = await axios(
      {
        url: `https://tonapi.io/v2/address/${address}/parse`,
      },
      { timeout: 1000 }
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Buscador general de la API de TON
export const fetchTonAPISearch = async (name) => {
  try {
    const data = await axios({
      url: `https://tonapi.io/v2/accounts/search?name=${name}`,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

// Función para obtener los 100 top holders de una moneda a partir de su dirección
export const fetchTonAPITokens = async (address) => {
  try {
    const { data } = await axios({
      url: `https://tonapi.io/v2/jettons/${address}/holders?limit=100&offset=0`,
    });
    console.log(data.addresses);
    return data.addresses;
  } catch (error) {
    console.log(error);
  }
};

// Función para obtener la información de un jetton a partir de su dirección
export const fetchTonAPIJetton = async (address) => {
  try {
    const data = await axios({
      url: `https://tonapi.io/v2/jettons/${address}`,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
