import axios from 'axios'

export const useUtils = () => {

  const getBackendUrl = async () => {
    const myUrl = await axios.get('/api/settings/connectBackend');
    return myUrl.data
  }

  const formatCurImageUrl = (serverURI: string ,asset: string) => {
    const combi = serverURI+asset;
    return combi;    
  };

  return {
    getBackendUrl,
    formatCurImageUrl,
  }
}
