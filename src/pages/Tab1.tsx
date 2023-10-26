import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { useRef, useEffect } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ExploreContainer from '../components/ExploreContainer';

const Tab1 = () => {



  return (
    <IonPage>

    <div className="container h-[90vh] pt-12 pb-6 flex flex-col justify-around gap-4">
      <div>
        <h1 className='text-left text-xl pl-5'>Welcome back, Tim!</h1>
      </div>

      <div className="flex justify-center ">
        <CircularProgressbarWithChildren value={66}  
        styles={buildStyles({
          pathColor: '#58F168',
          trailColor: '#E7FDE8'
        })}
                strokeWidth={10}

        >
      <div>calories</div>
      <div className='text-6xl font-bold my-2'>900</div>
      <div className='text-'>Goal 1500</div>
        </CircularProgressbarWithChildren>
      </div>

      <div className='w-full  px-6'>
        <div className="flex items-center gap-3 justify-between px-4 my-7">
          <div>
            <div className='text-left text-md text-gray-700'>Protein</div>
            <div className='text-left text-xl font-bold'>28/60g</div>
          </div>
          <div className='w-[200px] bg-stone-300 h-[6px] rounded-[3px] relative'>
            <div className='w-[80%] bg-[#7C8EF1] h-[6px] rounded-[3px] absolute'></div>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-between px-4 my-7">
          <div>
            <div className='text-left text-md text-gray-700'>Carbs</div>
            <div className='text-left text-xl font-bold'>28/60g</div>
          </div>
          <div className='w-[200px] bg-stone-300 h-[6px] rounded-[3px] relative'>
            <div className='w-[40%] bg-[#F1F17C] h-[6px] rounded-[3px] absolute'></div>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-between px-4 my-7">
          <div>
            <div className='text-left text-md text-gray-700'>Fat</div>
            <div className='text-left text-xl font-bold'>28/60g</div>
          </div>
          <div className='w-[200px] bg-stone-300 h-[6px] rounded-[3px] relative'>
            <div className='w-[80%] bg-[#F17C7C] h-[6px] rounded-[3px] absolute'></div>
          </div>
        </div>
      </div>
    </div>
  </IonPage>

  );
};

export default Tab1;
