import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { add, homeOutline, listOutline } from 'ionicons/icons';
import Home from './pages/Home';
import Tab2 from './pages/Tab2';
import Logs from './pages/Logs';
import Camera from './pages/Camera';

import { Storage } from '@ionic/storage';
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
import { useEffect, useState } from 'react';

setupIonicReact({
  rippleEffect: false,
  mode: 'md',
});

const App = () => {
  const [dataStore, setDataStore] = useState(null); // DB

  const [adminData, setAdminData] = useState({});
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    initStore();
    async function initStore() {
      const store = new Storage();
      await store.create();
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
          id: uuid(),
          name: 'Tim',
          current_calories: 1500,
          total_calories: 2500,
          current_protein: 28,
          total_protein: 150,
          current_carbs: 50,
          total_carbs: 200,
          current_fat: 50,
          total_fat: 90,
          age: 24,
          goal: 'lose',
          premium: false,
        };
        dataStore?.set('admin', JSON.stringify(adminObj));
        setAdminData(adminObj);
      }
    }
  }, [dataStore]);

  function handleCameraClick(e) {
    e.stopPropagation();
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
              <Home
                dataStore={dataStore}
                adminData={adminData}
                setAdminData={setAdminData}
              />
            </Route>
            <Route
              exact
              path="/tab2"
            >
              <Tab2 />
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
            className={isCameraActive ? 'hidden' : 'pt-2 pb-4 '}
          >
            <IonTabButton
              tab="home"
              className={isCameraActive ? 'hidden' : 'visible'}
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
              className={isCameraActive ? 'invisible' : 'visible'}
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
      {!isCameraActive && (
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
      )}
    </IonApp>
  );
};

export default App;
