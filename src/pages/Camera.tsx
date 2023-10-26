import { IonContent, IonDatetime, IonHeader, IonPage, IonTitle, IonToolbar, } from '@ionic/react';
import './Tab1.css';
import { useRef, useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ExploreContainer from '../components/ExploreContainer';
const Camera = () => {
  const [datetime, setDatetime] = useState<string | null>(null);

  
  useEffect(( ) => {
    
    console.log()
  }, [])

   function testFn({target}) {
      console.log(target.value)
    }
  return (
    <IonPage>
hello
  </IonPage>

  );
};

export default Camera;
