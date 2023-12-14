import axios from 'axios';
const PAT = import.meta.env.VITE_CLARIFAI_PAT;
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'general-image-recognition';
const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';

async function isFood(imageInput) {
  if (!imageInput) return false;

  const requestData = {
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            base64: imageInput,
          },
        },
      },
    ],
  };

  try {
    const response = await axios.post(
      `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
      requestData,
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Key ' + PAT,
        },
      }
    );
    const foodItems = response.data.outputs[0]?.data.concepts.filter((obj) => obj.name === 'food');
    return foodItems.length > 0;
  } catch (err) {
    console.error(err);
  }
}

export { isFood };
