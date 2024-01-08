import axios from 'axios';
import { useState } from 'react';

import { closeCircleOutline } from 'ionicons/icons';
import { IonButton, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonIcon } from '@ionic/react';

import { Purchases } from '@revenuecat/purchases-capacitor';

import MeImg from '../assets/me.png';
import FoldedHandsImg from '../assets/folded_hands.png';

const activePremiumUrl = import.meta.env.VITE_SERVER_ACTIVATE_PREMIUM;

import Loading from '../components/Loading';
import ReviewBlocks from '../components/ReviewBlocks';

function Paywall({ paywallOpen, setPaywallOpen, userData, setUserData, setShowConfetti }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(0);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        const { availablePackages } = offerings.current;
        const purchaseResult = await Purchases.purchasePackage({ aPackage: availablePackages[0] });
        setIsLoading(false);

        if (purchaseResult.customerInfo.nonSubscriptionTransactions.length > 0) {
          const transaction = purchaseResult.customerInfo.nonSubscriptionTransactions[0];
          if (transaction.productIdentifier === 'ce_3999') handleSuccess();
        }
      }
    } catch (error) {
      console.log(error);
      // if (error) alert(error);
      // if (error.code === '1') {
      //   alert('Purchase cancelled');
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = async () => {
    setUserData({
      ...userData,
      premium: true,
    });

    try {
      const res = await axios.post(activePremiumUrl, { userId: userData.id });
      if (res.status == 200) {
        setShowConfetti(true);
        setPaywallOpen(false);
      }
    } catch (error) {
      console.error('Error activating premium:', error);
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
            <div className="tracking-tight leading-[18px] ml-2 font-medium">
              Effortlessly log meals with our AI powered tech, just snap a pic.
            </div>
          </div>
          <div className="flex items-center mt-8 font-medium">
            <img
              src="https://emojiguide.com/wp-content/uploads/platform/apple/43206.png"
              className="w-[40px] "
              alt=""
            />
            <div className="tracking-tight leading-[18px] ml-2">
              Customize your requirements with our self test to match your goals.{' '}
            </div>
          </div>
          <ReviewBlocks />
          {userData.premium ? (
            <div className="flex items-center px-3 gap-3 mt-6">
              <div
                className={`w-full h-[180px] p-3 rounded-2xl flex justify-center items-center flex-col relative border-[6px]  bg-green-50 ${'border-[4px] border-green-400'}`}
              >
                <img
                  src={MeImg}
                  className="w-[100px] absolute left-0 bottom-[0px] rounded-bl-[15px]"
                />

                <div className="flex">
                  <img
                    src={FoldedHandsImg}
                    className="w-[35px] ml-[20px]"
                  />
                  <img
                    src={FoldedHandsImg}
                    className="w-[35px]"
                  />
                </div>
                <div className="flex flex-col !pl-[25px] items-center ">
                  <div class="text-2xl font-semibold tracking-tight ml-5 text-center tracking-tight text-stone-900">
                    Thank you for purchasing!
                  </div>
                  <div class="text-2xl font-semibold tracking-tight ml-5 text-center tracking-tight text-stone-900">
                    It means a lot!
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center px-3 gap-3 mt-6">
              <div
                className={`w-full h-[160px] p-3 rounded-2xl flex justify-center items-center flex-col relative border-[4px]  bg-green-100`}
              >
                <div class="text-2xl font-semibold tracking-tight text-center tracking-tight text-stone-900">
                  One Time Payment
                </div>
                <div className="flex items-center gap-2">
                  <div class="text-5xl mt-3 font-bold tracking-tight text-center text-stone-900 ml-12">$39.99</div>
                  <div className="text-sm font-medium bg-green-500 px-2 rounded-full text-white py-.5 mt-3">USD</div>
                </div>

                <div className="text-lg mt-3 font-semibold tracking-tight text-center text-stone-600">
                  Unlimited Scans
                </div>
              </div>
            </div>
          )}
          {!userData?.premium && (
            <>
              <div
                className="btn btn-primary mx-3 px-3 py-5 mt-8 mb-12 bg-green-500 rounded-full text-center text-2xl font-semibold text-white tracking-tight leading-none"
                onClick={handlePurchase}
              >
                Start Tracking!
              </div>
            </>
          )}
        </IonContent>
        <Loading showSpinner={isLoading} />
      </IonModal>
    </>
  );
}

export default Paywall;
