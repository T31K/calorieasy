import { IonPage } from '@ionic/react';
import { IonBadge, IonIcon, IonButton, IonAlert, IonContent } from '@ionic/react';
import axios from 'axios';
const serverCheckoutUrl = import.meta.env.VITE_SERVER_CHECKOUT_URL;
import { logOutOutline } from 'ionicons/icons';
import profilePicImg from '../assets/profile.png';
const Profile = ({ userData }) => {
  const handleCheckout = async () => {
    try {
      const res = await axios.post(`${serverCheckoutUrl}`, {
        email: user?.email,
      });
      if (res.status === 200) {
        window.location.href = res.data;
      } else {
        console.error('Unexpected res status:', res.status);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Handle errors here (e.g., show error message to the user)
    }
  };

  function handleLogoutButton(e) {
    e?.stopPropagation();
    const button = document.getElementById('logout-alert');
    button?.click();
  }

  return (
    <IonPage>
      <div className="container h-[90vh] pt-10  gap-4">
        <div className="flex gap-2 justify-center">
          <img
            src={profilePicImg}
            className="rounded-full w-[150px] h-[150px] border-[8px] border-green-500 dark:border-green-700 mt-6"
          />
          {/* <div className="absolute right-5 top-20 bg-stone-500 text-white rounded-full p-2 text-center flex items-center justify-center">
            <IonIcon
              aria-hidden="true"
              icon={logOutOutline}
              className="text-3xl ml-1"
              onClick={(e) => handleLogoutButton(e)}
            />
          </div> */}
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
          <div className="h-[80px] bg-stone-50 dark:bg-stone-800 rounded-xl border dark:border-stone-600 flex justify-between items-center gap-8 px-5 pr-3 mt-6">
            <div className="tracking-tight w-[20%]">Premium</div>
            <div className="tracking-tight font-semibold w-[150px] flex items-center gap-4">
              <IonBadge color={userData?.premium ? 'success' : 'danger'}>
                {userData?.premium ? 'True' : 'False'}
              </IonBadge>
            </div>
            <button
              className="rainbow w-[120px] rounded-full  text-center active:bg-gray-400  font-bold py-2 px-4"
              onClick={handleCheckout}
            >
              Upgrade!
            </button>
          </div>
        </div>
        <IonContent>
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
        </IonContent>
      </div>
    </IonPage>
  );
};

export default Profile;
