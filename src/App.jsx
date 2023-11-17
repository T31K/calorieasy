import { Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
import { IonReactRouter } from '@ionic/react-router';
import { add, homeOutline, listOutline, personOutline, statsChartOutline } from 'ionicons/icons';
import Home from './pages/Home';
import Logs from './pages/Logs';
import Show from './pages/Show';
import Camera from './pages/Camera';
import Onboard from './pages/Onboard';
import Profile from './pages/Profile';
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
import { useAuth0 } from '@auth0/auth0-react';
setupIonicReact({
  rippleEffect: false,
  platform: 'ios',
});
const SERVER_INIT_URL = import.meta.env.VITE_SERVER_INIT;

const App = () => {
  const [dataStore, setDataStore] = useState(null); // DB
  const [userData, setUserData] = useState({});
  const [foodData, setFoodData] = useState({});
  const [shouldSave, setShouldSave] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData(user.sub);
    }
  }, [isAuthenticated]);

  const fetchUserData = async (userId) => {
    try {
      const res = await axios.get(`${SERVER_INIT_URL}`, { params: { id: userId } });
      console.log(res);
      const { user, foodsByDate } = res.data;
      const { current_calories, current_protein, current_fat, current_carbs } = await updateFoods(foodsByDate);
      setUserData({
        ...user,
        current_calories,
        current_protein,
        current_fat,
        current_carbs,
      });
      setFoodData(foodsByDate);
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
    const button = document.getElementById('present-alert');
    button?.click();
    e?.stopPropagation();
  }

  function handleUpgradeClick(param) {
    if (param == 'continue') {
      setIsCameraActive(true);
      window.location.href = '/camera';
    } else {
      window.location.href = '/profile';
    }
  }

  return (
    <>
      {isAuthenticated ? (
        <IonApp>
          <IonReactRouter>
            <IonTabs>
              <IonRouterOutlet>
                <Route
                  exact
                  path="/"
                >
                  {userData ? (
                    userData.onboard ? (
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
                  ) : null}
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
                  path="/profile"
                >
                  <Profile userData={userData} />
                </Route>
              </IonRouterOutlet>
              <IonTabBar
                slot="bottom"
                color={isCameraActive ? '' : 'light '}
                className={isCameraActive || !userData?.onboard ? 'hidden' : 'pt-2 pb-4 '}
              >
                <IonTabButton
                  tab="home"
                  className={`${isCameraActive || !userData?.onboard ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="/"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={homeOutline}
                  />
                </IonTabButton>
                <IonTabButton
                  tab=""
                  className={`${isCameraActive || !userData?.onboard ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="#"
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
                  className={`${isCameraActive || !userData?.onboard ? 'invisible' : 'visible'} scale-[0.8]`}
                  href="/logs"
                >
                  <IonIcon
                    aria-hidden="true"
                    icon={listOutline}
                  />
                </IonTabButton>
                <IonTabButton
                  tab="profile"
                  className={`${isCameraActive || !userData?.onboard ? 'invisible' : 'visible'} scale-[0.8]`}
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
          {!isCameraActive && userData?.onboard ? (
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
            subHeader={`${userData?.remaining_api_calls}/3 tokens left!`}
            message="Premium users have unlimited tokens!"
            buttons={[
              {
                text: 'Continue',
                handler: () => handleUpgradeClick('continue'),
              },
              {
                text: 'Upgrade!',
                handler: () => handleUpgradeClick('upgrade'), // Use the custom handler here
              },
            ]}
          ></IonAlert>
        </IonApp>
      ) : (
        <Login />
      )}
    </>
  );
};

export default App;
