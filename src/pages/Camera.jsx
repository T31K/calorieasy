import './camera.css';
import { useEffect, useState } from 'react';
import { IonIcon, IonPage } from '@ionic/react';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { useLocation } from 'react-router';
import { cameraOutline, closeCircleOutline, refreshOutline, checkmarkOutline } from 'ionicons/icons';

const Camera = ({ isCameraActive, setIsCameraActive }) => {
  const [imageData, setImageData] = useState('');
  const [isStreamOn, setIsStreamOn] = useState(false);

  const location = useLocation();
  useEffect(() => {
    document?.querySelector('body')?.classList?.add('camera-active');

    if (location?.pathname == '/camera') setIsCameraActive(true);
    else setIsCameraActive(false);
  }, [location]);

  useEffect(() => {
    async function turnOnCamera() {
      await CameraPreview?.start({
        parent: 'content',
        toBack: true,
        position: 'rear',
      });
      setIsStreamOn(true);
    }

    if (isCameraActive) turnOnCamera();
  }, [isCameraActive]);

  return (
    <IonPage className="cameraPage">
      {!imageData && isStreamOn ? (
        <a
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            const cameraSampleOptions = {
              quality: 60,
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
            className="w-screen h-screen"
            src={imageData}
            alt=""
          />
          <div
            className={`absolute w-[90%] flex gap-4 items-center bottom-[50px] justify-center h-[200px] p-6 transform -translate-x-1/2 left-1/2`}
            style={{ zIndex: '99999' }}
          >
            <a
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#58F168] rounded-full"
            >
              <IonIcon
                aria-hidden="true"
                icon={refreshOutline}
              />
            </a>
            <a
              onClick={async (e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#F17C7C] rounded-full"
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
        className={`absolute w-[90%] flex items-center justify-center h-[400px] border border-stone-500 rounded-3xl p-6 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 `}
      >
        {!isStreamOn && (
          <div style={{ zIndex: '99999' }}>
            <div className="lds-ring ">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </IonPage>
  );
};

export default Camera;
