import { Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonButton,
  IonAlert,
} from '@ionic/react';
import { Storage } from '@ionic/storage';
import { IonReactRouter } from '@ionic/react-router';
import { add, homeOutline, listOutline, personOutline, statsChartOutline } from 'ionicons/icons';
import Home from './pages/Home';
import Logs from './pages/Logs';
import Show from './pages/Show';
import Camera from './pages/Camera';
import Onboard from './pages/Onboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Login from './pages/Login';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './theme/global.css';
setupIonicReact({
  rippleEffect: false,
  platform: 'ios',
});
const serverInitUrl = import.meta.env.VITE_SERVER_INIT;
const serverCheckoutUrl = import.meta.env.VITE_SERVER_CHECKOUT_URL;

const App = () => {
  const [dataStore, setDataStore] = useState(null); // DB
  const [adminData, setAdminData] = useState(null);

  const [userData, setUserData] = useState({});
  const [foodData, setFoodData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    async function initStore() {
      const store = new Storage();
      await store.create();
      // store.clear();
      setDataStore(store);
      const adminRes = await store?.get('admin');
      if (adminRes) setAdminData(adminRes);
    }
    initStore();
  }, []);

  useEffect(() => {
    if (adminData) {
      if (adminData.length == 36) fetchUserData(adminData);
    }
  }, [adminData]);

  const createUser = async () => {
    const generatedUUID = uuid();
    await dataStore?.set('admin', generatedUUID);

    try {
      const res = await axios.post('https://api.getharmonize.app/calorieasy/create_user', { user_id: generatedUUID });
      const { user } = res.data;
      setUserData({
        ...user,
        current_calories: 0,
        current_protein: 0,
        current_fat: 0,
        current_carbs: 0,
      });
      setIsLoading(false);
      setIsAuth(true);
    } catch (error) {
      console.error('Error in creating user:', error);
    }
  };

  const fetchUserData = async (adminId) => {
    try {
      const res = await axios.get(`${serverInitUrl}`, { params: { id: adminId } });
      const { user, foodsByDate } = res.data;
      const { current_calories, current_protein, current_fat, current_carbs } = await updateFoods(foodsByDate);
      setUserData({
        ...user,
        current_calories,
        current_protein,
        current_fat,
        current_carbs,
      });
      setIsLoading(false);
      setFoodData(foodsByDate);
      setIsAuth(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  async function updateFoods(foodsObj) {
    const today = new Date().toISOString().split('T')[0];
    let current_calories = 0;
    let current_protein = 0;
    let current_fat = 0;
    let current_carbs = 0;

    if (foodsObj[today] && foodsObj[today].length > 0) {
      foodsObj[today].forEach((food) => {
        current_calories += food.calories || 0;
        current_protein += food.protein || 0;
        current_fat += food.fat || 0;
        current_carbs += food.carbs || 0;
      });
    }

    return { current_calories, current_protein, current_fat, current_carbs };
  }

  function handleCameraClick(e) {
    if (userData?.premium) {
      setIsCameraActive(true);
      window.location.href = '/camera';
    } else {
      const button = document.getElementById('present-alert');
      button?.click();
      e?.stopPropagation();
    }
  }

  function handleUpgradeClick(param) {
    if (param == 'continue') {
      setIsCameraActive(true);
      window.location.href = '/camera';
    } else {
      handleCheckout();
    }
  }

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${serverCheckoutUrl}`, {
        email: user?.email,
      });
      if (res.status === 200) {
        setIsLoading(false);
        window.location.href = res.data;
      } else {
        console.error('Unexpected res status:', res.status);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Handle errors here (e.g., show error message to the user)
    }
  };

  return (
    <>
      {isAuth ? (
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route
                  exact
                  path="/"
                >
                  {isLoading ? (
                    // Loading state
                    <div className="absolute h-[100vh] w-full bg-[#b9e0bb] opacity-[40%] flex items-center justify-center">
                      <span className="loader"></span>
                    </div>
                  ) : userData ? (
                    // Check if user is onboarded
                    !userData.onboard ? (
                      <Home
                        dataStore={dataStore}
                        userData={userData}
                        setUserData={setUserData}
                      />
                    ) : (
                      <Onboard
                        dataStore={dataStore}
                        userData={userData}
                        setUserData={setUserData}
                      />
                    )
                  ) : (
                    <></>
                  )}
                </Route>
                <Route
                  exact
                  path="/onboard"
                >
                  <Onboard
                    dataStore={dataStore}
                    userData={userData}
                    setUserData={setUserData}
                  />
                </Route>
                <Route path="/logs">
                  <Logs
                    userData={userData}
                    foodData={foodData}
                  />
                </Route>
                <Route path="/show">
                  <Show
                    userData={userData}
                    foodData={foodData}
                  />
                </Route>
                <Route
                  exact
                  path="/camera"
                >
                  <Camera
                    dataStore={dataStore}
                    userData={userData}
                    isCameraActive={isCameraActive}
                    setIsCameraActive={setIsCameraActive}
                  />
                </Route>
                <Route
                  exact
                  path="/analytics"
                >
                  <Analytics userData={userData} />
                </Route>
                <Route
                  exact
                  path="/profile"
                >
                  <Profile userData={userData} />
                </Route>
              </IonRouterOutlet>
              <IonTabBar
                slot="bottom"
                color={isCameraActive ? '' : 'light '}
                className={isCameraActive ? 'hidden' : 'pt-2 pb-4 '}
              >
                <IonTabButton
                  tab="home"
                  className={`${isCameraActive ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="/"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={homeOutline}
                  />
                </IonTabButton>
                <IonTabButton
                  tab="analytics"
                  className={`${isCameraActive ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="/analytics"
                >
                  <IonIcon
                    aria-hidden="true"
                    className="scale-[0.7]"
                    icon={statsChartOutline}
                  />
                </IonTabButton>
                <IonTabButton
                  tab="tab2"
                  href="/tab2"
                ></IonTabButton>
                <IonTabButton
                  tab="logs"
                  className={`${isCameraActive ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="/logs"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={listOutline}
                  />
                </IonTabButton>
                <IonTabButton
                  tab="profile"
                  className={`${isCameraActive ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="/profile"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={personOutline}
                  />
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </IonReactRouter>
          {!isCameraActive ? (
            <div
              className="absolute bottom-[12px] w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#58F168] onTop rounded-full left-[50%] mb-5 transform -translate-x-1/2"
              onClick={(e) => handleCameraClick(e)}
            >
              <IonIcon
                aria-hidden="true"
                icon={add}
              />
            </div>
          ) : (
            <></>
          )}
          <IonButton
            id="present-alert"
            className="invisible"
          >
            Click Me
          </IonButton>
          <IonAlert
            trigger="present-alert"
            header="Upgrade to premium!"
            subHeader={`${userData?.remaining_api_calls}/3 tokens left today!`}
            message="Premium users have unlimited tokens!"
            buttons={[
              {
                text: 'Continue',
                handler: () => handleUpgradeClick('continue'),
              },
              {
                text: 'Upgrade!',
                handler: () => handleUpgradeClick('upgrade'),
              },
            ]}
          ></IonAlert>
        </IonApp>
      ) : (
        <Login
          dataStore={dataStore}
          createUser={createUser}
          isAuth={isAuth}
        />
      )}
    </>
  );
};

export default App;
