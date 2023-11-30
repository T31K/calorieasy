import './camera.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IonIcon, IonPage, useIonToast } from '@ionic/react';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { useLocation } from 'react-router';
import { cameraOutline, closeCircleOutline, refreshOutline, checkmarkOutline } from 'ionicons/icons';
import { currentTime } from '../utils/dateUtils';

const cloudinaryUrl = import.meta.env.VITE_CLOUD_URL;
const cloudinaryPreset = import.meta.env.VITE_CLOUD_PRESET;
const serverUpload = import.meta.env.VITE_SERVER_UPLOAD;

const Camera = ({ isCameraActive, setIsCameraActive, userData }) => {
  const [isStreamOn, setIsStreamOn] = useState(false);
  const [imageData, setImageData] = useState('');
  const [isCheckShown, setIsCheckShown] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state to track upload status
  const location = useLocation();
  const [present] = useIonToast();

  const presentToast = (input) => {
    present({
      message: input,
      duration: 1500,
      position: 'top',
    });
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
    let currentTimestamp = currentTime();

    if (!imageData || !userData) {
      return { error: 'No image data provided' };
    }

    try {
      const res = await axios.post(`${cloudinaryUrl}`, {
        file: imageData,
        upload_preset: cloudinaryPreset,
      });

      if (res.status === 200) {
        const { url } = res.data;
        const magicRes = await axios.post(`${serverUpload}`, {
          url,
          admin_id: userData.id,
          timestamp: currentTimestamp,
        });
        if (magicRes.status == 200) {
          window.location.href = '/home';
        } else if (magicRes.status === 204) {
          presentToast("Our AI couldn't read your food. Please readjust your camera");
        }
      }
      setIsUploading(false);
    } catch (error) {
      console.error('Image upload failed:', error);
      return { error: error.response ? error.res.data : error.message };
    }
  }

  async function resetCamera(e) {
    if (isUploading) return;
    e.stopPropagation();
    e.preventDefault();
    setImageData('');
    await turnOnCamera();
  }

  async function closePage(e) {
    e.stopPropagation();
    e.preventDefault();
    setImageData('');
    await CameraPreview?.stop();
    window.location.href = '/home';
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
        className={`top-dog ${!isStreamOn && 'invisible'}`}
        onClick={async (e) => closePage(e)}
      >
        <IonIcon
          aria-hidden="true"
          icon={closeCircleOutline}
          className="absolute top-dog top-[45px] right-5 text-4xl"
        />
      </a>
      <div
        className={`absolute top-dog w-[90%] flex items-center justify-center h-[400px] border border-stone-300 rounded-3xl p-6 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 `}
      >
        {!isStreamOn && !imageData ? (
          <div className="top-dog">
            <div className="lds-ring ">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </IonPage>
  );
};

export default Camera;
