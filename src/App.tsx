import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {add, homeOutline, listOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Camera from './pages/Camera';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';

setupIonicReact({
  rippleEffect: false,
  mode: 'md',
});

const App = () => {
  return (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/tab3">
            <Tab3 />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
          <Route exact path="/camera">
          <Camera />

          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" color="light" className='py-2 rounded-3xl mb-4 mx-2'>
          <IonTabButton tab="tab1" href="/tab1" >
            <IonIcon aria-hidden="true" icon={homeOutline} />
          </IonTabButton>
          <IonTabButton  tab="tab2" href="/tab2">
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={listOutline} />
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
    <a href="/camera" className='absolute bottom-[15px] w-[70px] text-3xl h-[70px] flex items-center justify-center bg-[#58F168] onTop rounded-full left-[50%] mb-5 transform -translate-x-1/2'>
      <IonIcon aria-hidden="true" icon={add} />
    </a>
  </IonApp>
);
}

export default App;
