import axios from 'axios';
import { useState, useEffect } from 'react';
import { IonButton, IonModal, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import { Purchases } from '@revenuecat/purchases-capacitor';
import Loading from '../components/Loading';

function Paywall({ paywallOpen, setPaywallOpen, userData }) {
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

        if (purchaseResult.customerInfo.entitlements.active['your_entitlement_identifier']) {
          // The purchase was successful, and the user has access to the entitlement
          alert('Purchase successful!');
        }
      }
    } catch (error) {
      alert(error);
      // Handle the error accordingly
      if (error.code === 'PURCHASE_CANCELLED') {
        alert('Purchase cancelled');
      } else {
        alert('Error making purchase');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('https://api.getharmonize.app/calorieasy/checkout', {
        interval: selectedPayment === 0 ? 'yearly' : 'monthly',
        userId: userData.id,
      });
      setIsLoading(false);
      if (res.status == 200) window.location.href = res.data;
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
          <div className="flex items-center px-3 gap-3 mt-12 ">
            <div
              className={`w-full h-[180px] p-3 rounded-3xl flex justify-center items-center flex-col relative border-[6px]  bg-green-50 ${
                selectedPayment == 0 && 'border-[6px] border-green-400'
              }`}
              onClick={() => setSelectedPayment(0)}
            >
              <div class="hidden absolute top-[-20px] whitespace-nowrap font-semibold left-1/2 transform -translate-x-1/2 bg-green-500 px-3 py-1 rounded-full">
                Save 36%
              </div>
              <div class="text-2xl font-semibold tracking-tight text-center tracking-tight text-stone-900">
                One Time Payment
              </div>
              <div class="text-5xl mt-3 font-bold tracking-tight text-center text-stone-900">$39.99</div>
              <div className="text-lg mt-3 font-semibold tracking-tight text-center text-stone-600">
                Unlimited Scans
              </div>
            </div>
          </div>

          <div
            className="btn btn-primary mx-3 px-3 py-5 mt-8 mb-12 bg-green-500 rounded-full text-center text-2xl font-semibold text-white tracking-tight leading-none"
            onClick={handlePurchase}
          >
            Start Tracking!
          </div>
        </IonContent>
        <Loading showSpinner={isLoading} />
      </IonModal>
    </>
  );
}

export default Paywall;
