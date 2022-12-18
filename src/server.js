
import axios from 'axios';

export default async function fetchImages(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '32007112-f85cc9861ab3035eecab785e9';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  try {
    const res = await axios.get(`${url}${filter}`);
    return res.data
  }
  catch (err) {
        console.log(err);
      }      
   
};


