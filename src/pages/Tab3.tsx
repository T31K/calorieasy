import { IonContent, IonDatetime, IonHeader, IonPage, IonChip, IonToolbar, } from '@ionic/react';
import './Tab1.css';
import { useRef, useEffect, useState } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ExploreContainer from '../components/ExploreContainer';
import UpDirection from '../components/UpDirection';

const Tab1 = () => {
  const [datetime, setDatetime] = useState<string | null>(null);

  
  useEffect(( ) => {
    
    console.log()
  }, [])

   function testFn({target}) {
      console.log(target.value)
    }
  return (
    <IonPage>
    <div className="container h-[90vh] pt-12 pb-6 flex flex-col justify-start gap-4">
      <div className="flex justify-center">
        
      <IonDatetime presentation="date" className='rounded-3xl border border-stone-200' value={datetime} onIonChange={(e) =>testFn(e)}/>
        
      </div>
      <IonContent>
        <div className='w-[85%] mx-auto'>
          <div className='border border-stone-200 rounded-2xl flex flex-col items-start justify-between w-full p-4 mb-3'>
            <div className='flex justify-between gap-2 w-full'>
              <div className='flex items-center gap-2'>
                <div className='text-4xl bg-blue-100 h-[50px] w-[50px] flex items-center justify-center rounded-xl'>🍲</div>
                <div className='flex flex-col items-start justify-end'>
                  <div className='text-lg font-semibold'>Big breakfast</div>
                  <div className='text-gray-600 mt-[-5px]'>294 kcal</div>
                </div> 
              </div> 
              <div>
              <IonChip color="dark">11:03 AM</IonChip>
              </div>
            </div>
            <div className="flex gap-8 w-full pt-5">
              <div className="flex items-center">
                <UpDirection values={[50]} color={'#7C8EF1'} />
                <div className='flex flex-col items-start w-[30%]'>
                <div className='text-xl font-semibold'>60g</div>
                <div className='mt-[-5px] text-gray-700'>Protein</div>
                </div>
              </div>
              <div className="flex items-center">
                <UpDirection values={[80]} color={`#F1F17C`} />
                <div className='flex flex-col items-start w-[30%]'>
                <div className='text-xl font-semibold'>120g</div>
                <div className='mt-[-5px] text-gray-700'>Carbs</div>
                </div>
              </div>
              <div className="flex items-center">
                <UpDirection values={[50]} color={`#F17C7C`} />
                <div className='flex flex-col items-start w-[30%]'>
                <div className='text-xl font-semibold'>15g</div>
                <div className='mt-[-5px] text-gray-700'>Fat</div>
                </div>
              </div>
            </div>
          </div>
          
          
        </div>
      </IonContent>
    </div>
  </IonPage>

  );
};

export default Tab1;
