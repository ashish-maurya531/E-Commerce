import api from './api';

const imageService = {
  getImageUrl: (imageUrl) => {
    if (!imageUrl) return null;
    const baseUrl = api.defaults.baseURL;
    return `${baseUrl}/images${imageUrl}`;
  }
};

export default imageService;