import axios from 'axios';
import { useState } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import linkImg from '../assets/link.jpeg';

import Loading from '../components/Loading';

function Paywall({ paywallOpen, setPaywallOpen, userData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(0);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('https://api.getharmonize.app/calorieasy/checkout', {
        interval: selectedPayment === 0 ? 'yearly' : 'monthly',
        userId: userData.id,
      });
      setIsLoading(false);

      window.location.href = res.data;
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  return (
    <>
      <IonButton
        expand="block"
        className="invisible"
        onClick={() => setPaywallOpen(true)}
      >
        Open
      </IonButton>
      <IonModal isOpen={paywallOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle className="text-stone-900 dark:text-white font-semibold">Get unlimited scans!</IonTitle>
            <IonButtons slot="end">
              <IonIcon
                aria-hidden="true"
                icon={closeCircleOutline}
                className="text-[30px] mr-1"
                onClick={() => setPaywallOpen(false)}
              />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding w-full">
          <h2 className="text-5xl tracking-tight font-bold mt-5">
            Become a <br /> Healthier You.
          </h2>
          <p className="mt-7 text-xl font-semibold">
            Get <span className="text-green-500">unlimited scans</span> for your health needs!
          </p>
          <div className="flex items-center mt-8">
            <img
              src="https://emojiguide.com/wp-content/uploads/platform/apple/43984.png"
              className="w-[40px] "
              alt=""
            />
            <div className="tracking-tight leading-[18px] ml-2">
              Effortlessly log meals with our AI powered tech, just snap a pic.
            </div>
          </div>
          <div className="flex items-center mt-8">
            <img
              src="https://emojiguide.com/wp-content/uploads/platform/apple/43206.png"
              className="w-[40px] "
              alt=""
            />
            <div className="tracking-tight leading-[18px] ml-2">
              Customize your requirements with our self test to match your goals.{' '}
            </div>
          </div>
          <div className="flex items-center px-3 gap-3 mt-12 ">
            <div
              className={`w-[50%] h-[130px] p-3 rounded-xl  relative border  bg-green-50 ${
                selectedPayment == 0 && 'border border-green-600'
              }`}
              onClick={() => setSelectedPayment(0)}
            >
              <div class="absolute top-[-20px] whitespace-nowrap font-semibold left-1/2 transform -translate-x-1/2 bg-green-500 px-3 py-1 rounded-full">
                50% savings
              </div>
              <div class="text-xl font-semibold tracking-tight text-center">Yearly</div>
              <div class="text-3xl mt-3 font-bold tracking-tight text-center">$59.99/yr</div>
              <div className="text-xl mt-3 font-semibold tracking-tight text-center text-stone-600">
                Unlimited Scans
              </div>
            </div>
            <div
              className={`w-[50%] h-[130px] p-3 rounded-xl  relative  border bg-gray-50 ${
                selectedPayment == 1 && 'border border-green-800'
              }`}
              onClick={() => setSelectedPayment(1)}
            >
              {' '}
              <div className="text-xl font-semibold tracking-tight text-center">Monthly</div>
              <div className="text-3xl mt-3 font-bold tracking-tight text-center text-stone-800">$9.99/mo</div>
              <div className="text-xl mt-3 font-semibold tracking-tight text-center text-stone-600">
                Unlimited Scans
              </div>
            </div>
          </div>

          <div
            className="btn btn-primary mx-3 px-3 py-5 mt-8 mb-12 bg-green-500 rounded-full text-center text-2xl font-semibold text-white tracking-tight leading-none"
            onClick={handleCheckout}
          >
            Start Tracking!
          </div>
          <img
            src={linkImg}
            className="border-2 rounded-xl w-[70%] mx-auto"
            alt=""
          />
          <div className="tracking-tight text-center mt-2">We only collect payments through Stripe</div>
        </IonContent>
        <Loading showSpinner={isLoading} />
      </IonModal>
    </>
  );
}

export default Paywall;
