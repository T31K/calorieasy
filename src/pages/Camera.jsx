import { IonPage, IonIcon } from '@ionic/react';
import { useRef, useCallback, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { cameraOutline, closeCircleOutline, refreshOutline, checkmarkOutline } from 'ionicons/icons';
import { useLocation } from 'react-router';
import './loader.css';

const cloudinaryUrl = import.meta.env.VITE_CLOUD_URL;
const cloudinaryPreset = import.meta.env.VITE_CLOUD_PRESET;
const serverUpload = import.meta.env.VITE_SERVER_UPLOAD;

const videoConstraints = {
  width: 600,
  height: 600,
  facingMode: 'rear',
};
import axios from 'axios';

const Camera = ({ setIsCameraActive, userData }) => {
  const location = useLocation();
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageSrc(imageSrc); // Save the captured image to state
  }, [webcamRef]);

  useEffect(() => {
    if (location?.pathname == '/camera') setIsCameraActive(true);
    else setIsCameraActive(false);
  }, [location]);

  async function sendImgToServer() {
    if (isLoading) return;
    setIsLoading(true);
    if (!imageSrc || !userData) {
      return { error: 'No image data provided' };
    }

    const admin_id = userData.id;
    const metadata = String(`admin_id=${admin_id}`);
    try {
      const res = await axios.post(`${cloudinaryUrl}`, {
        file: imageSrc,
        upload_preset: cloudinaryPreset,
        context: metadata,
      });
      if (res.status === 200) {
        const { url } = res.data;
        const magicRes = await axios.post(`${serverUpload}`, { url });
        console.log(magicRes.data);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Image upload failed:', error);
      return { error: error.response ? error.res.data : error.message };
    }
  }

  return (
    <IonPage>
      <div className=" container h-[90vh] pt-12 pb-6 px-10  bg-[#EAF0E0] flex flex-col justify-around gap-4">
        {!imageSrc ? (
          <>
            <Webcam
              audio={false}
              height={videoConstraints.height} // Use height from videoConstraints
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-3xl"
              width={videoConstraints.width} // Use width from videoConstraints
              videoConstraints={videoConstraints}
            />
            <div className="flex justify-center">
              <button
                onClick={capture}
                className="bg-gray-100 w-[60px] h-[60px] flex items-center justify-center rounded-full mx-auto"
              >
                <IonIcon
                  aria-hidden="true"
                  className="text-3xl"
                  icon={cameraOutline}
                />
              </button>
            </div>
          </>
        ) : (
          <>
            <img
              src={imageSrc}
              className="rounded-3xl"
              alt="Captured"
            />
            <div className="flex justify-center">
              <button
                onClick={() => setImageSrc(null)}
                className="bg-gray-100 w-[60px] h-[60px] flex items-center justify-center rounded-full mx-auto"
              >
                <IonIcon
                  aria-hidden="true"
                  className="text-3xl"
                  icon={refreshOutline}
                />
              </button>
              <button
                onClick={sendImgToServer}
                className="bg-gray-100 w-[60px] h-[60px] flex items-center justify-center rounded-full mx-auto"
                disabled={isLoading} // Disable the button when loading
              >
                <IonIcon
                  aria-hidden="true"
                  className="text-3xl"
                  icon={checkmarkOutline}
                />
              </button>
            </div>
          </>
        )}
      </div>
      {isLoading && (
        <div className="absolute h-[90vh] w-full bg-[#222222] opacity-50 flex pt-[70%] justify-center">
          <span className="loader"></span>
        </div>
      )}
      <a
        onClick={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          window.location.href = '/';
        }}
      >
        <IonIcon
          aria-hidden="true"
          icon={closeCircleOutline}
          className="absolute top-[45px] right-5 text-4xl"
        />
      </a>
    </IonPage>
  );
};

export default Camera;
