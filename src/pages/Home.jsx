import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab1.css';
import { useState, useEffect } from 'react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { v4 as uuid } from 'uuid';

const Home = ({ dataStore, adminData, setAdminData }) => {
  return (
    <IonPage>
      <div className="container h-[90vh] pt-12 pb-6 flex flex-col justify-around gap-4">
        <div>
          <h1 className="text-left text-xl pl-5">Welcome back, {adminData?.name}!</h1>
        </div>

        <div className="flex justify-center ">
          <CircularProgressbarWithChildren
            value={(adminData?.current_calories / adminData?.total_calories) * 100}
            styles={buildStyles({
              pathColor: '#58F168',
              trailColor: '#E7FDE8',
            })}
            strokeWidth={10}
          >
            <div className="text-xl font-semibold">Goal {adminData?.total_calories}</div>
            <div className="text-6xl font-bold my-2">{adminData?.current_calories}</div>
            <div className="text-2xl mt-[-5px] font-medium">calories</div>
          </CircularProgressbarWithChildren>
        </div>

        <div className="w-full px-6">
          <div className="flex items-center gap-3 justify-between px-4 my-7">
            <div>
              <div className="text-left text-md text-gray-700">Protein</div>
              <div className="text-left text-xl font-bold">
                {adminData?.current_protein}/{adminData?.total_protein}g
              </div>
            </div>
            <div className="w-[200px] bg-stone-300 h-[6px] rounded-[3px] relative">
              <div
                style={{
                  width: `${(adminData?.current_protein / adminData?.total_protein) * 200}px`,
                  backgroundColor: '#7C8EF1',
                  height: '6px',
                  borderRadius: '3px',
                }}
                className="absolute"
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-between px-4 my-7">
            <div>
              <div className="text-left text-md text-gray-700">Carbs</div>
              <div className="text-left text-xl font-bold">
                {adminData?.current_carbs}/{adminData?.total_carbs}g
              </div>
            </div>
            <div className="w-[200px] bg-stone-300 h-[6px] rounded-[3px] relative">
              <div
                style={{
                  width: `${(adminData?.current_carbs / adminData?.total_carbs) * 200}px`,
                  backgroundColor: '#F1F17C',
                  height: '6px',
                  borderRadius: '3px',
                }}
                className="absolute"
              ></div>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-between px-4 my-7">
            <div>
              <div className="text-left text-md text-gray-700">Fat</div>
              <div className="text-left text-xl font-bold">
                {adminData?.current_fat}/{adminData?.total_fat}g
              </div>
            </div>
            <div className="w-[200px] bg-stone-300 h-[6px] rounded-[3px] relative">
              <div
                style={{
                  width: `${(adminData?.current_fat / adminData?.total_fat) * 200}px`,
                  backgroundColor: '#F17C7C',
                  height: '6px',
                  borderRadius: '3px',
                }}
                className="absolute"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Home;
