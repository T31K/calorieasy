import './camera.css';
import axios from 'axios';

import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { currentTime } from '../utils/dateUtils';

import { CameraPreview } from '@capacitor-community/camera-preview';
import { IonModal, IonContent, IonIcon, useIonToast, IonPage } from '@ionic/react';
import {
  cameraOutline,
  closeCircleOutline,
  refreshOutline,
  checkmarkOutline,
  addCircleOutline,
  alertCircleOutline,
  cloudDoneOutline,
  fastFoodOutline,
  pizzaOutline,
  barcodeOutline,
} from 'ionicons/icons';

import UpDirection from '../components/UpDirection';

import { isFood } from '../utils/objDetect';

const cloudinaryUrl = import.meta.env.VITE_CLOUD_URL;
const cloudinaryPreset = import.meta.env.VITE_CLOUD_PRESET;
const serverUpload = import.meta.env.VITE_SERVER_UPLOAD;
const addFoodServerUrl = import.meta.env.VITE_ADD_FOOD;

const Camera = ({ userData, setIsCameraActive }) => {
  const location = useLocation();
  const [present] = useIonToast();

  const [foodItem, setFoodItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageData, setImageData] = useState('');

  const [cameraStep, setCameraStep] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const presentToast = (input, variant) => {
    present({
      message: input,
      duration: 1500,
      position: 'top',
      icon: variant ? variant : null,
    });
  };

  const randomAdj = () => {
    const descriptions = [
      "It's delicious!",
      'Quite flavorful!',
      'Very aromatic!',
      'Remarkably tender!',
      'Satisfyingly crunchy!',
      'Pleasantly salted...',
      'Uniquely tangy!',
      'Surprisingly creamy...',
      'Rich and luscious!',
      'Simply satisfying!',
    ];
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return descriptions[randomIndex];
  };

  useEffect(() => {
    if (location?.pathname == '/camera') setIsCameraActive(true);
    else setIsCameraActive(false);
  }, [location]);

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      turnOnCamera();
    }
  }, [userData]);

  async function turnOnCamera() {
    await CameraPreview?.start({
      parent: 'content',
      toBack: true,
      position: 'rear',
    });
    setCameraStep(2);
    setIsLoading(false);
  }

  async function captureImage(e) {
    setIsLoading(true);
    e?.stopPropagation();
    e?.preventDefault();
    const options = {
      quality: 80,
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      rotateWhenOrientationChanged: false,
    };
    const result = await CameraPreview.captureSample(options);
    setImageData(`data:image/jpeg;base64,${result.value}`);
    setCameraStep(3);
    await CameraPreview.stop();

    const isImgFood = await isFood(result.value);
    if (isImgFood) {
      presentToast('Food present in image, proceed!', checkmarkOutline);
      setCameraStep(4);
    } else {
      presentToast('Please upload food only', pizzaOutline);
      resetCamera();
    }
    setIsLoading(false);
  }

  async function uploadImage() {
    const uploadRes = await axios.post(`${cloudinaryUrl}`, {
      file: imageData,
      upload_preset: cloudinaryPreset,
    });
    if (uploadRes.status === 200) {
      const { url } = uploadRes.data;
      return url;
    }
  }

  async function sendImgToServer() {
    setIsLoading(true);
    presentToast('Server has received your food!', cloudDoneOutline);

    setCameraStep(5);
    const uploadedUrl = await uploadImage(); // Wait for the URL from the uploadImage function.

    if (!imageData || !uploadedUrl) {
      console.log('No image data/url provided');
      return;
    }
    try {
      presentToast(`Our AI is eating your food. ${randomAdj()}`, fastFoodOutline);
      const aiRes = await axios.post(`${serverUpload}`, { url: uploadedUrl });
      if (aiRes.status === 200) {
        presentToast('Here are the calories!', barcodeOutline);
        const { data } = aiRes;
        setFoodItem(data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.log(error);
      presentToast('Server error & admin has been notified! Try again later.', alertCircleOutline);
      setImageData('');
      setCameraStep(4);
      await turnOnCamera();
    }
    setIsLoading(false);
  }

  async function addFoodToServer() {
    presentToast('Adding to your food logs', addCircleOutline);
    try {
      const res = await axios.post(addFoodServerUrl, {
        foodData: foodItem,
        adminId: userData.id,
        timestamp: currentTime(),
      });
      if (res.status === 200) {
        setIsModalOpen(false);
        setImageData('');
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Error adding food entry to the server:', error);
    }
  }

  async function resetCamera(e) {
    e?.stopPropagation();
    e?.preventDefault();
    setImageData('');
    setCameraStep(3);
    await turnOnCamera();
  }

  async function closePage() {
    if (isLoading) return;
    setImageData('');
    setCameraStep(1);
    await CameraPreview?.stop();
    window.location.href = '/home';
  }

  return (
    <IonPage className="cameraPage">
      {cameraStep == 2 && (
        <div
          onClick={async (e) => captureImage(e)}
          className="absolute bottom-[105px] w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#58F168] active:bg-green-600  onTop rounded-full left-[50%] mb-5 transform -translate-x-1/2"
        >
          <IonIcon
            aria-hidden="true"
            className="text-black"
            icon={cameraOutline}
          />
        </div>
      )}
      {cameraStep == 3 && (
        <>
          <img
            src={imageData}
            className="h-screen w-screen top-dog"
            alt=""
          />
        </>
      )}
      {cameraStep == 4 || cameraStep == 5 ? (
        <>
          <img
            src={imageData}
            className="h-screen w-screen top-dog"
            alt=""
          />
          <div
            className={`absolute top-dog w-[90%] flex gap-4 items-center bottom-[50px] justify-center h-[200px] p-6 transform -translate-x-1/2 left-1/2`}
          >
            <button
              onClick={async (e) => resetCamera(e)}
              className={`w-[70px] text-3xl font-semibold  h-[70px] flex items-center justify-center  ${
                cameraStep == 5 ? 'bg-gray-400' : 'bg-[#F17C7C]'
              } rounded-full`}
            >
              <IonIcon
                aria-hidden="true"
                icon={refreshOutline}
              />
            </button>
            <button
              onClick={sendImgToServer}
              className={`w-[70px] text-3xl  font-semibold h-[70px] flex items-center justify-center ${
                cameraStep == 5 ? 'bg-gray-400' : 'bg-[#58F168]'
              } rounded-full`}
              disabled={cameraStep == 5}
            >
              <IonIcon
                aria-hidden="true"
                className="text-3xl text-white"
                icon={checkmarkOutline}
              />
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      {cameraStep >= 2 && (
        <>
          <div
            className={`top-dog`}
            onClick={async () => closePage()}
          >
            <IonIcon
              aria-hidden="true"
              icon={closeCircleOutline}
              className={`absolute top-dog top-[55px] right-[10px] text-4xl ${isLoading && 'opacity-10'}`}
            />
          </div>
        </>
      )}

      <div
        className={`absolute top-dog w-[90%] flex items-center justify-center h-[400px] ${
          isLoading ? 'loading-border' : 'normal-border'
        } rounded-3xl p-6 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 `}
      ></div>

      <IonModal
        isOpen={isModalOpen}
        trigger="open-modal"
        initialBreakpoint={0.38}
        breakpoints={[0.38]}
      >
        <IonContent className="ion-padding ">
          <div className="border border-stone-300 rounded-2xl flex flex-col items-start justify-between w-full p-4 my-3">
            <div className="flex justify-between gap-2 w-full">
              <div className="flex items-center gap-2">
                <div className={`text-4xl bg-blue-100 h-[50px] w-[50px] flex items-center justify-center rounded-xl`}>
                  {foodItem?.emoji?.substring(0, 2)}
                </div>
                <div className="flex flex-col items-start justify-end">
                  <div className="text-lg font-semibold whitespace-nowrap">
                    {foodItem?.name?.length >= 20 ? foodItem?.name?.substring(0, 20) + '...' : foodItem?.name}
                  </div>
                  <div className="text-gray-600 mt-[-5px]">{`${foodItem?.calories} kcal`}</div>
                </div>
              </div>
              <div></div>
            </div>
            <div className="flex gap-8 w-full pt-5">
              <div className="flex items-center">
                <UpDirection
                  values={[foodItem?.protein]}
                  color={'#7C8EF1'}
                />
                <div className="flex flex-col items-start w-[30%]">
                  <div className={`text-xl font-semibold rounded-lg`}>{`${foodItem?.protein}g`}</div>
                  <div className="text-gray-700">Protein</div>
                </div>
              </div>
              <div className="flex items-center">
                <UpDirection
                  values={[foodItem?.carbs]}
                  color={`#F1F17C`}
                />
                <div className="flex flex-col items-start w-[30%]">
                  <div className={`text-xl font-semibold rounded-lg`}>{`${foodItem?.carbs}g`}</div>
                  <div className="text-gray-700">Carbs</div>
                </div>
              </div>
              <div className="flex items-center">
                <UpDirection
                  values={[foodItem?.fat]}
                  color={`#F17C7C`}
                />
                <div className="flex flex-col items-start w-[30%]">
                  <div className={`text-xl font-semibold rounded-lg`}>{`${foodItem?.fat}g`}</div>{' '}
                  <div className=" text-gray-700">Fat</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 h-[50px]">
            <button
              className="bg-gray-200 w-full text-center text-stone-800 active:bg-gray-400 font-bold py-2 px-4 rounded-lg mx-auto"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-[#58F168] w-full text-center active:bg-gray-400 font-bold py-2 px-4 rounded-lg mx-auto"
              onClick={addFoodToServer}
            >
              Add to food logs
            </button>
          </div>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Camera;
