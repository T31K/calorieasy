import './camera.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { IonButton, IonModal, IonContent, IonIcon, useIonToast, IonPage } from '@ionic/react';
import { useLocation } from 'react-router';
import { currentTime } from '../utils/dateUtils';
import UpDirection from '../components/UpDirection';
import { CameraPreview } from '@capacitor-community/camera-preview';
import {
  cameraOutline,
  closeCircleOutline,
  refreshOutline,
  checkmarkOutline,
  addCircleOutline,
  alertCircleOutline,
  cloudDoneOutline,
  fastFoodOutline,
  barcodeOutline,
} from 'ionicons/icons';
import Loading from '../components/Loading';

const cloudinaryUrl = import.meta.env.VITE_CLOUD_URL;
const cloudinaryPreset = import.meta.env.VITE_CLOUD_PRESET;
const serverUpload = import.meta.env.VITE_SERVER_UPLOAD;
const addFoodServerUrl = import.meta.env.VITE_ADD_FOOD;

const Camera = ({ isCameraActive, setIsCameraActive, userData }) => {
  const location = useLocation();
  const [present, dismiss] = useIonToast();

  const [imageData, setImageData] = useState('');
  const [foodItem, setFoodItem] = useState(null);
  const [isStreamOn, setIsStreamOn] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state to track upload status
  const [isModalOpen, setIsModalOpen] = useState(false);

  const presentToast = (input, variant, duration) => {
    present({
      message: input,
      duration: duration ? duration : 1200,
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
    if (isCameraActive && userData && Object.keys(userData).length > 0) {
      turnOnCamera();
    }
  }, [isCameraActive, userData]);

  async function turnOnCamera() {
    await CameraPreview?.start({
      parent: 'content',
      toBack: true,
      position: 'rear',
    });
    setIsStreamOn(true);
  }

  async function sendImgToServer() {
    if (isUploading) return;
    setIsUploading(true);

    if (!imageData || !userData) {
      return { error: 'No image data provided' };
    }

    try {
      presentToast('Server has received your food!', cloudDoneOutline);
      const res = await axios.post(`${cloudinaryUrl}`, {
        file: imageData,
        upload_preset: cloudinaryPreset,
      });
      if (res.status === 200) {
        const { url } = res.data;
        presentToast(`Our AI is eating your food. ${randomAdj()}`, fastFoodOutline, 7000);
        const magicRes = await axios.post(`${serverUpload}`, { url });
        if (magicRes.status == 200) {
          presentToast('Delicious! Here are the calories.', barcodeOutline, 2000);
          const { data } = magicRes;
          setFoodItem(data);
          setIsModalOpen(true);
        } else if (magicRes.status === 204) {
          presentToast("Our AI couldn't read your food. Please readjust!", alertCircleOutline);
          setImageData('');
          setIsStreamOn(false);
          turnOnCamera();
        }
      }
      setIsUploading(false);
    } catch (error) {
      console.error('Image upload failed:', error);
      presentToast('Server error & admin has been notified! Try again later.', alertCircleOutline);
      setImageData('');
      setIsStreamOn(false);
      turnOnCamera();
      return { error: error.response ? error.res.data : error.message };
    }
  }

  async function addFoodToServer() {
    presentToast('Adding to your food logs', addCircleOutline);
    setIsUploading(true);
    try {
      const res = await axios.post(addFoodServerUrl, {
        foodData: foodItem,
        adminId: userData.id,
        timestamp: currentTime(),
      });
      if (res.status === 200) {
        setIsUploading(false);
        setIsStreamOn(false);

        setImageData('');
        window.location.href = '/home';
      } else {
      }
      console.error('Failed to add food entry:', res.data);
    } catch (error) {
      console.error('Error adding food entry to the server:', error);
    }
  }

  async function resetCamera(e) {
    if (isUploading) return;
    e.stopPropagation();
    e.preventDefault();
    setImageData('');
    await turnOnCamera();
  }

  async function closePage() {
    setImageData('');
    await CameraPreview?.stop();
    window.location.href = '/home';
  }

  function shouldShowLoadingSpinner() {
    return (!isStreamOn && !imageData) || isUploading;
  }

  return (
    <IonPage className="cameraPage">
      {!imageData && isStreamOn ? (
        <a
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const cameraSampleOptions = {
              quality: 80,
            };

            const result = await CameraPreview.captureSample(cameraSampleOptions);
            setImageData(`data:image/jpeg;base64,${result.value}`);
            setIsStreamOn(false);
            await CameraPreview.stop();
          }}
          className="absolute bottom-[105px] w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#58F168] active:bg-green-600  onTop rounded-full left-[50%] mb-5 transform -translate-x-1/2"
        >
          <IonIcon
            aria-hidden="true"
            icon={cameraOutline}
          />
        </a>
      ) : (
        <></>
      )}
      {imageData && (
        <>
          <img
            src={imageData}
            className="h-screen top-dog"
            alt=""
          />
          <div
            className={`absolute top-dog w-[90%] flex gap-4 items-center bottom-[50px] justify-center h-[200px] p-6 transform -translate-x-1/2 left-1/2`}
          >
            <button
              onClick={async (e) => resetCamera(e)}
              className={`w-[70px] text-3xl h-[70px] flex items-center justify-center  ${
                isUploading ? 'bg-gray-400' : 'bg-[#F17C7C]'
              } rounded-full`}
            >
              <IonIcon
                aria-hidden="true"
                icon={refreshOutline}
              />
            </button>
            <button
              onClick={sendImgToServer}
              className={`w-[70px] text-3xl h-[70px] flex items-center justify-center ${
                isUploading ? 'bg-gray-400' : 'bg-[#58F168]'
              } rounded-full`}
              disabled={isUploading}
            >
              <IonIcon
                aria-hidden="true"
                className="text-3xl text-white"
                icon={checkmarkOutline}
              />
            </button>
          </div>
        </>
      )}
      <a
        className={`top-dog`}
        onClick={async () => closePage()}
      >
        <IonIcon
          aria-hidden="true"
          icon={closeCircleOutline}
          className="absolute top-dog top-[45px] right-5 text-4xl"
        />
      </a>
      <div
        className={`absolute top-dog w-[90%] flex items-center justify-center h-[400px] border border-stone-300  rounded-3xl p-6 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 `}
      >
        <Loading showSpinner={shouldShowLoadingSpinner()} />
      </div>
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
