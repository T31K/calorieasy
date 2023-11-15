import { Route } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import pusher from './utils/pusherConfigs';

import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { Storage } from '@ionic/storage';
import { today } from './utils/dateUtils';
import { IonReactRouter } from '@ionic/react-router';
import { add, homeOutline, listOutline } from 'ionicons/icons';
import Home from './pages/Home';
import Logs from './pages/Logs';
import Camera from './pages/Camera';
import Onboard from './pages/Onboard';

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

const App = () => {
  const [dataStore, setDataStore] = useState(null); // DB
  const [adminData, setAdminData] = useState({});
  const [shouldSave, setShouldSave] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  useEffect(() => {
    initStore();
    async function initStore() {
      const store = new Storage();
      await store.create();
      // store.clear();
      setDataStore(store);
    }
  }, []);

  useEffect(() => {
    if (dataStore) fetchFromStore();
    async function fetchFromStore() {
      const admin = await dataStore?.get('admin');
      if (admin) {
        setAdminData(JSON.parse(admin));
      } else {
        let adminObj = {
          onboard: false,
          id: uuid(),
          name: 'Tim',
          system: 'metric', // metric || imperial
          age: '',
          weight: '', // 70 || 150
          height: '', // 180 if metric || 4ft 5in if imperial
          gender: '', // male || female || other
          activity: '', // sedentary, light, moderate, heavy, athlete
          goal: '', // gain || maintain // lose
          current_calories: 0, // remove
          total_calories: 2500,
          current_protein: 0,
          total_protein: 150,
          current_carbs: 0,
          total_carbs: 200,
          current_fat: 0,
          total_fat: 90,
          premium: false,
        };
        dataStore?.set('admin', JSON.stringify(adminObj));
        setAdminData(adminObj);
      }

      // let obj = JSON.stringify([
      //   {
      //     loading: false,
      //     emoji: '🍳',
      //     timestamp: '11:03AM',
      //     name: 'Big breakfast',
      //     calories: 850,
      //     protein: 45,
      //     carbs: 100,
      //     fat: 20,
      //   },
      //   {
      //     loading: false,
      //     emoji: '🍳',
      //     timestamp: '11:03AM',
      //     name: 'Big breakfast',
      //     calories: 850,
      //     protein: 45,
      //     carbs: 100,
      //     fat: 20,
      //   },
      // ]);
      // dataStore.set('foods:2023-10-21', obj);
      // dataStore.set('foods:2023-11-02', obj);
    }
  }, [dataStore]);

  useEffect(() => {
    if (adminData) {
      const channel = pusher.subscribe('calorieasyMainChannel');
      channel.bind(`${adminData.id}`, async (data) => {
        const { food_id, food_data } = data;
        const foodRes = await dataStore?.get(`foods:${today()}`);
        let foodArray = JSON.parse(foodRes) || [];

        const updatedFoodArray = foodArray.map((obj) => {
          if (obj.id === food_id) {
            // Return a new object with the updated data
            return { ...obj, ...food_data };
          }
          return obj; // Return the original object if there's no match
        });

        await dataStore?.set(`foods:${today()}`, JSON.stringify(updatedFoodArray));
        updateFoods(updatedFoodArray);
      });

      return () => {
        channel.unbind(`${adminData.id}`);
        pusher.unsubscribe('calorieasyMainChannel');
      };
    }
  }, [adminData, dataStore, today]);

  function fireOnboard() {
    const modalBtn = document.getElementById('presentAlert');
    console.log(modalBtn);
    if (modalBtn) modalBtn.click();
  }
  function updateFoods(updatedArr) {
    let currentCalories = 0;
    let currentProtein = 0;
    let currentFat = 0;
    let currentCarbs = 0;

    updatedArr?.forEach((obj) => {
      currentCalories += obj.calories;
      currentProtein += obj.protein;
      currentCarbs += obj.carbs;
      currentFat += obj.fat;
    });

    setAdminData((prevAdminData) => ({
      ...prevAdminData,
      current_calories: currentCalories,
      current_protein: currentProtein,
      current_carbs: currentCarbs,
      current_fat: currentFat,
    }));
    setShouldSave(true);
  }

  useEffect(() => {
    if (adminData && shouldSave) updateAdminData();

    async function updateAdminData() {
      await dataStore?.set('admin', JSON.stringify(adminData));
      setShouldSave(false);
    }
  }, [adminData, shouldSave]);

  function handleCameraClick(e) {
    e?.stopPropagation();
    setIsCameraActive(true);
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route
              exact
              path="/"
            >
              {adminData ? (
                adminData.onboard ? (
                  <Home
                    dataStore={dataStore}
                    adminData={adminData}
                    setAdminData={setAdminData}
                  />
                ) : (
                  <Onboard
                    dataStore={dataStore}
                    adminData={adminData}
                    setAdminData={setAdminData}
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
                adminData={adminData}
                setAdminData={setAdminData}
              />
            </Route>
            <Route path="/logs">
              <Logs dataStore={dataStore} />
            </Route>
            <Route
              exact
              path="/camera"
            >
              <Camera
                dataStore={dataStore}
                adminData={adminData}
                isCameraActive={isCameraActive}
                setIsCameraActive={setIsCameraActive}
              />
            </Route>
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            color={isCameraActive ? '' : 'light '}
            className={isCameraActive || !adminData?.onboard ? 'hidden' : 'pt-2 pb-4 '}
          >
            <IonTabButton
              tab="home"
              className={isCameraActive || !adminData?.onboard ? 'invisible' : 'visible'}
              href="/"
            >
              <IonIcon
                aria-hidden="true"
                icon={homeOutline}
              />
            </IonTabButton>
            <IonTabButton
              tab="tab2"
              href="/tab2"
            ></IonTabButton>
            <IonTabButton
              tab="logs"
              className={isCameraActive || !adminData?.onboard ? 'invisible' : 'visible'}
              href="/logs"
            >
              <IonIcon
                aria-hidden="true"
                icon={listOutline}
              />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
      {!isCameraActive && adminData?.onboard ? (
        <a
          href="/camera"
          className="absolute bottom-[12px] w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#58F168] onTop rounded-full left-[50%] mb-5 transform -translate-x-1/2"
          onClick={(e) => handleCameraClick(e)}
        >
          <IonIcon
            aria-hidden="true"
            icon={add}
          />
        </a>
      ) : (
        <></>
      )}
    </IonApp>
  );
};

export default App;
