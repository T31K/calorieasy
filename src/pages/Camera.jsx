import './camera.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IonIcon, IonPage } from '@ionic/react';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { useLocation } from 'react-router';
import { cameraOutline, closeCircleOutline, refreshOutline, checkmarkOutline } from 'ionicons/icons';
import Checkmark from '../components/icons/Checkmark';
import { today, currentTime } from '../utils/dateUtils';
import { v4 as uuid } from 'uuid';

const Camera = ({ isCameraActive, setIsCameraActive, adminData, dataStore }) => {
  const [isStreamOn, setIsStreamOn] = useState(false);
  const [imageData, setImageData] = useState('');
  const [isCheckShown, setIsCheckShown] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state to track upload status
  const location = useLocation();

  useEffect(() => {
    if (location?.pathname == '/camera') setIsCameraActive(true);
    else setIsCameraActive(false);
  }, [location]);

  useEffect(() => {
    if (isCameraActive && adminData && Object.keys(adminData).length > 0) {
      turnOnCamera();
    }
  }, [isCameraActive, adminData]);

  async function handleUpload(e) {
    if (isUploading) return; // Prevent further clicks if already uploading

    e?.stopPropagation();
    e?.preventDefault();
    setIsUploading(true); // Start upload process
    try {
      CameraPreview?.stop();

      const resLogs = await dataStore?.get(`foods:${today()}`);
      let oldLogs;
      if (resLogs) oldLogs = JSON.parse(resLogs);
      else oldLogs = [];

      const id = uuid();
      oldLogs.push({
        id: id,
        loading: true,
        emoji: '',
        timestamp: currentTime(),
        name: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
      await dataStore?.set(`foods:${today()}`, JSON.stringify(oldLogs));
      const result = await sendImgToServer({ food_id: id });

      if (result.error) {
        console.error('Upload failed:', result.error);
        setIsUploading(false); // Reset upload status
      } else {
        setIsCheckShown(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setIsUploading(false); // Reset upload status on error
    }
  }

  async function turnOnCamera() {
    console.log('turning on camera');
    await CameraPreview?.start({
      parent: 'content',
      toBack: true,
      position: 'rear',
    });
    setIsStreamOn(true);
  }

  async function sendImgToServer({ food_id }) {
    const cloudName = 'dvz9avi1t';
    const uploadPreset = 'bpv1mjw5';

    if (!imageData) {
      return { error: 'No image data provided' };
    }
    const admin_id = adminData.id;
    const metadata = String(`food_id=${food_id}|admin_id=${admin_id}`);
    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        file: imageData,
        upload_preset: uploadPreset,
        context: metadata,
      });
      return { data: response.data };
    } catch (error) {
      console.error('Image upload failed:', error);
      return { error: error.response ? error.response.data : error.message };
    }
  }

  return (
    <IonPage className="cameraPage">
      {!imageData && isStreamOn ? (
        <a
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const cameraSampleOptions = {
              quality: 50,
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
            style={{ zIndex: '99999' }}
            src={imageData}
            className="h-screen"
            alt=""
          />
          <div
            className={`absolute w-[90%] flex gap-4 items-center bottom-[50px] justify-center h-[200px] p-6 transform -translate-x-1/2 left-1/2`}
            style={{ zIndex: '99999' }}
          >
            <a
              onClick={async (e) => {
                if (isUploading) return;
                e.stopPropagation();
                e.preventDefault();
                setImageData('');
                await turnOnCamera();
              }}
              className={`w-[70px] text-3xl h-[70px] flex items-center justify-center  ${
                isUploading ? 'bg-gray-400' : 'bg-[#F17C7C]'
              } rounded-full`}
            >
              <IonIcon
                aria-hidden="true"
                icon={refreshOutline}
              />
            </a>
            <a
              onClick={async (e) => handleUpload(e)}
              className={`w-[70px] text-3xl h-[70px] flex items-center justify-center ${
                isUploading ? 'bg-gray-400' : 'bg-[#58F168]'
              } rounded-full`}
            >
              <IonIcon
                aria-hidden="true"
                icon={checkmarkOutline}
              />
            </a>
          </div>
        </>
      )}
      <a
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          window.location.href = '/';
          await CameraPreview?.stop();
        }}
        style={{ zIndex: '99999' }}
      >
        <IonIcon
          aria-hidden="true"
          icon={closeCircleOutline}
          className="absolute top-[45px] right-5 text-4xl"
          style={{ zIndex: '99999' }}
        />
      </a>
      <div
        style={{ zIndex: '99999' }}
        className={`absolute w-[90%] flex items-center justify-center h-[400px] border border-stone-300 rounded-3xl p-6 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 `}
      >
        {!isStreamOn && !imageData ? (
          <div style={{ zIndex: '99999' }}>
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
        {isCheckShown && <Checkmark />}
      </div>
    </IonPage>
  );
};

export default Camera;
