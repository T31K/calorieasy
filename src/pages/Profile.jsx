import profilePicImg from '../assets/profile.png';
import { useState } from 'react';
import { IonPage } from '@ionic/react';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonAlert, IonContent } from '@ionic/react';

const serverCheckoutUrl = import.meta.env.VITE_SERVER_CHECKOUT_URL;

const Profile = ({ userData, setPaywallOpen, setOnboardOpen }) => {
  const [nerdStats, setNerdStats] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pb-3 flex items-center justify-between px-3">
          <IonTitle>
            <div
              className={`bg-[#58F168] mx-auto h-[35px] rounded-full flex items-center justify-center`}
              onClick={() => setPaywallOpen(true)}
            >
              {userData?.premium ? 'Premium User' : 'Upgrade for more scans'}
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="py-6 px-4 flex flex-col justify-start gap-4">
          <div className="flex gap-2 justify-center">
            <img
              src={profilePicImg}
              onClick={() => setNerdStats((prevState) => prevState + 1)}
              className="rounded-full w-[150px] h-[150px] border-[8px] border-green-500 dark:border-green-700 my-6"
            />
          </div>
          <IonButton
            id="logout-alert"
            className="hidden"
          >
            Click Me
          </IonButton>
          <IonAlert
            trigger="logout-alert"
            header="Logout?"
            buttons={[
              {
                text: 'Cancel',
              },
              {
                text: 'Logout',
                handler: () => logout(), // Use the custom handler here
              },
            ]}
          ></IonAlert>
          <div className="px-3">
            <div className="h-[50px] bg-stone-50 dark:bg-stone-900 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Age</div>
              <div className="tracking-tight font-semibold w-[150px]">{userData?.age ? userData?.age : 'Not set'}</div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-900 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Goal</div>
              <div className="tracking-tight font-semibold w-[150px] capitalize">
                {userData?.goal ? userData?.goal + ' weight' : 'Not set'}
              </div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-900 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">TDEE</div>
              <div className="tracking-tight font-semibold w-[150px]">
                {userData?.total_calories ? userData?.total_calories + ' cals' : 'Not set'}
              </div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-900 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Weight</div>
              <div className="tracking-tight font-semibold w-[150px]">
                {userData?.weight ? userData?.weight : 'Not set'}
                {userData?.weight ? (userData?.system == 'metric' ? ' kg' : ' lbs') : null}
              </div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-900 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Height</div>
              <div className="tracking-tight font-semibold w-[150px]">
                {userData?.height ? userData?.height : 'Not set'}
                {userData?.height ? (userData?.system == 'metric' ? ' cm' : '') : null}
              </div>
            </div>
            <div className="w-full flex justify-center pt-4">
              <button
                className="bg-[#58F168] w-[150px] text-center active:bg-gray-400 font-bold py-2 px-4 rounded-full mx-auto"
                onClick={() => setOnboardOpen(true)}
              >
                Set goals!
              </button>
            </div>
          </div>
        </div>
        {nerdStats == 8 ? (
          <div
            className="absolute flex items-start justify-center h-[62vh] w-[80%] top-0 left-0 right-0 bottom-0 m-auto"
            onClick={() => setNerdStats(0)}
          >
            <div className="bg-white border-2 rounded-3xl p-4 w-[50vh] h-[10vh]">
              <div className="text-stone-800">{userData.id}</div>
              <div className="text-stone-800">{userData?.id?.split('').reverse().join('')}</div>
            </div>
          </div>
        ) : null}
      </IonContent>
    </IonPage>
  );
};

export default Profile;
