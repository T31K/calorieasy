import axios from 'axios';
import profilePicImg from '../assets/profile.png';
import { IonPage } from '@ionic/react';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonAlert, IonContent } from '@ionic/react';

const serverCheckoutUrl = import.meta.env.VITE_SERVER_CHECKOUT_URL;

const Profile = ({ userData }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pb-3 flex items-center justify-between px-3">
          <IonTitle>
            <div
              className={`bg-[#58F168] w-[150px] mx-auto h-[35px] rounded-full flex items-center justify-center ${
                userData?.premium && 'invisible'
              }`}
            >
              {' '}
              {userData?.premium !== undefined &&
                `${userData?.remaining_api_calls ?? 0} ${
                  userData?.remaining_api_calls <= 1 ? ' token left' : 'tokens left'
                }`}
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="py-6 px-4 flex flex-col justify-start gap-4">
          <div className="flex gap-2 justify-center">
            <img
              src={profilePicImg}
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
            <div className="h-[50px] bg-stone-50 dark:bg-stone-800 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Name</div>
              <div className="tracking-tight font-semibold w-[150px]">
                {userData?.name ? userData?.name : 'Not set'}
              </div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-800 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Age</div>
              <div className="tracking-tight font-semibold w-[150px]">{userData?.age ? userData?.age : 'Not set'}</div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-800 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Goal</div>
              <div className="tracking-tight font-semibold w-[150px] capitalize">
                {userData?.goal ? userData?.goal + ' weight' : 'Not set'}
              </div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-800 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">TDEE</div>
              <div className="tracking-tight font-semibold w-[150px]">
                {userData?.total_calories ? userData?.total_calories + ' cals' : 'Not set'}
              </div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-800 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Weight</div>
              <div className="tracking-tight font-semibold w-[150px]">
                {userData?.weight ? userData?.weight : 'Not set'}
                {userData?.weight ? (userData?.system == 'metric' ? ' kg' : ' lbs') : null}
              </div>
            </div>
            <div className="h-[50px] bg-stone-50 dark:bg-stone-800 rounded-xl border dark:border-stone-600 flex items-center gap-8 my-2 px-5">
              <div className="tracking-tight w-[20%]">Height</div>
              <div className="tracking-tight font-semibold w-[150px]">
                {userData?.height ? userData?.height : 'Not set'}
                {userData?.height ? (userData?.system == 'metric' ? ' cm' : '') : null}
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
