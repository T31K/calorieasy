import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { Storage } from '@ionic/storage';
import { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonReactRouter } from '@ionic/react-router';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';

import { add, homeOutline, listOutline, personOutline, statsChartOutline } from 'ionicons/icons';
import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';

import Home from './pages/Home';
import Logs from './pages/Logs';
import Show from './pages/Show';
import Camera from './pages/Camera';
import Onboard from './pages/Onboard';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Paywall from './pages/Paywall';
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
const revenueCatKey = import.meta.env.REVENUE_CAT_KEY;

const App = () => {
  const [dataStore, setDataStore] = useState(null); // DB
  const [adminData, setAdminData] = useState(null);

  const [userData, setUserData] = useState({});
  const [foodData, setFoodData] = useState({});

  const [isAuth, setIsAuth] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function initStore() {
      const store = new Storage();
      await store.create();
      // store.clear();
      setDataStore(store);
      const adminRes = await store?.get('admin');
      if (adminRes) setAdminData(adminRes);
      else setIsNew(true);
    }
    initStore();
  }, []);

  useEffect(() => {
    if (adminData) {
      if (adminData.length == 36) fetchUserData(adminData);
    }
  }, [adminData]);

  useEffect(() => {
    async function initPurchases() {
      await Purchases.configure({ apiKey: revenueCatKey });
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    }
    initPurchases();
  }, []);

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
      setIsNew(false);
    } catch (error) {
      console.error('Error in creating user:', error);
    }
  };

  const fetchUserData = async (adminId) => {
    setIsNew(false);
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
    const isUserPremium = userData?.premium;
    const hasRemainingApiCalls = userData?.remaining_api_calls > 0;

    if (userData?.show_paywall) {
      if (isUserPremium || hasRemainingApiCalls) {
        setIsCameraActive(true);
        window.location.href = '/camera';
        e?.stopPropagation();
      } else {
        setPaywallOpen(true);
      }
    }

    setIsCameraActive(true);
    window.location.href = '/camera';
    e?.stopPropagation();
  }

  return (
    <>
      {!isNew ? (
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Redirect
                  exact
                  path="/"
                  to="/home"
                />
                <Route
                  exact
                  path="/home"
                >
                  <Home
                    dataStore={dataStore}
                    userData={userData}
                    setUserData={setUserData}
                    setPaywallOpen={setPaywallOpen}
                  />
                </Route>

                <Route path="/logs">
                  <Logs
                    userData={userData}
                    foodData={foodData}
                    setPaywallOpen={setPaywallOpen}
                  />
                </Route>
                <Route path="/show/:id">
                  <Show
                    userData={userData}
                    foodData={foodData}
                    setPaywallOpen={setPaywallOpen}
                  />
                </Route>
                <Route
                  exact
                  path="/camera"
                >
                  <Camera
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
                  <Profile
                    userData={userData}
                    setPaywallOpen={setPaywallOpen}
                    setOnboardOpen={setOnboardOpen}
                  />
                </Route>
              </IonRouterOutlet>
              <IonTabBar
                slot="bottom"
                color={isCameraActive ? '' : 'light '}
                className={isCameraActive ? 'hidden' : 'pt-2 pb-8'}
              >
                <IonTabButton
                  tab="home"
                  className={`${isCameraActive ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="/home"
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
                  href="#"
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
          <Paywall
            userData={userData}
            paywallOpen={paywallOpen}
            setPaywallOpen={setPaywallOpen}
          />
          <Onboard
            userData={userData}
            onboardOpen={onboardOpen}
            setOnboardOpen={setOnboardOpen}
            setUserData={setUserData}
          />

          {!isCameraActive && !paywallOpen && !onboardOpen ? (
            <div
              className="absolute bottom-[24px] w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#58F168] onTop rounded-full left-[50%] mb-5 transform -translate-x-1/2"
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
        </IonApp>
      ) : (
        <Login
          dataStore={dataStore}
          createUser={createUser}
          isNew={isNew}
        />
      )}
    </>
  );
};

export default App;
