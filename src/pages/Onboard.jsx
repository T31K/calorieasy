import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  IonIcon,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import './onboard.css';
import { EffectFade, Navigation } from 'swiper/modules';
import { heightList } from '../utils/heightList';
import Icon from '../assets/icon.png';
import { calculateTdee } from '../utils/tdeeCalc';
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import axios from 'axios';

const SERVER_UPDATE_URL = import.meta.env.VITE_SERVER_UPDATE_USER;

export default function Onboard({ userData, setUserData }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [totalCalories, setTotalCalories] = useState(null);

  function handlePrev() {
    const prevBtn = document.querySelector('.swiper-button-prev');
    if (prevBtn) prevBtn.click();
  }

  function handleNext() {
    const nextBtn = document.querySelector('.swiper-button-next');
    if (nextBtn) nextBtn.click();
  }

  async function handleNextBtnClick() {
    if (activeSlide == 6) {
      let totals = calculateTdee(userData);
      setTotalCalories(totals.tdee);
      handleNext();
    } else if (activeSlide == 7) {
      let calculatedVal = calculateTdee(userData);
      updateUser({
        ...userData,
        total_calories: calculatedVal.tdee,
        total_protein: calculatedVal.protein,
        total_carbs: calculatedVal.carbs,
        total_fat: calculatedVal.fat,
        onboard: true,
      });
    } else {
      if (!disableNext()) handleNext();
    }
  }

  async function updateUser(userObj) {
    console.log(userObj);
    try {
      const res = await axios.post(`${SERVER_UPDATE_URL}`, userObj);
      if (res.status === 200) window.location.href = '/';
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error as needed
      throw error;
    }
  }

  function disableNext() {
    if (activeSlide === 0) return false;
    const fields = ['age', 'age', 'weight', 'height', 'gender', 'activity', 'goal'];
    const fieldValue = userData[fields[activeSlide]];
    return fieldValue === 0 || fieldValue === '' || fieldValue?.length == 1;
  }

  return (
    <section className="h-[100vh] py-24 bg-[#EAF0E0]">
      <Swiper
        modules={[EffectFade, Navigation]}
        draggable={false}
        navigation={true}
        className="h-[80%]"
        onSlideChange={(e) => setActiveSlide(e?.activeIndex)}
      >
        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <h1 className="text-4xl font-bold tracking-tight mt-[150px] mb-8 text-stone-900">Welcome!</h1>
          <img
            src={Icon}
            alt=""
            className="w-[220px]"
          />
          <div className="text-xl text-center font-medium w-[250px] mt-12 tracking-tight mb-16 text-stone-900">
            Let's get you setup! <br /> Just some questions to help us understand you better.
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <div className="font-semibold text-xl mb-2 text-gray-800">How old are you?</div>
          <div className="flex items-center !text-gray-800">
            <IonInput
              type="number"
              className="w-[50px]"
              placeholder="25"
              onIonChange={(e) =>
                setUserData({
                  ...userData,
                  age: `${e.target.value}`,
                })
              }
            ></IonInput>
            years old
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <div className="font-semibold text-xl mb-5  text-gray-800">What is your weight?</div>

          <div className="w-[70%] !text-gray-800">
            <IonSegment
              onIonChange={(e) =>
                setUserData({
                  ...userData,
                  system: `${e.target.value}`,
                })
              }
              value={userData?.system}
            >
              <IonSegmentButton value="metric">
                <IonLabel>Metric</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="imperial">
                <IonLabel>Imperial</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>
          <div className="flex items-center !text-gray-800">
            <IonInput
              type="number"
              className="w-[50px]"
              placeholder="00"
              onIonChange={(e) =>
                setUserData({
                  ...userData,
                  weight: `${e.target.value}`,
                })
              }
            ></IonInput>
            {userData?.system == 'metric' ? 'kg' : 'lbs'}
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <div className="font-semibold text-xl mb-2 text-gray-800">What is your height?</div>
          <div className="w-[70%] !text-gray-800">
            <IonSegment
              onIonChange={(e) =>
                setUserData({
                  ...userData,
                  system: `${e.target.value}`,
                })
              }
              value={userData?.system}
              disabled
            >
              <IonSegmentButton value="metric">
                <IonLabel>Metric</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="imperial">
                <IonLabel>Imperial</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>
          {userData?.system == 'metric' ? (
            <div className="flex items-center !text-gray-800">
              <IonInput
                type="number"
                className="w-[50px] !text-gray-900"
                placeholder="182"
                onIonChange={(e) =>
                  setUserData({
                    ...userData,
                    height: `${e.target.value}`,
                  })
                }
              ></IonInput>
              cm
            </div>
          ) : (
            <div>
              <IonSelect
                placeholder={userData?.system == 'metric' ? '150' : `4ft 5in`}
                className="!text-black"
                onIonChange={(e) =>
                  setUserData({
                    ...userData,
                    height: `${e.target.value}`,
                  })
                }
              >
                {heightList?.map((height, index) => (
                  <IonSelectOption
                    key={index}
                    value={height}
                  >
                    {height}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
          )}
        </SwiperSlide>

        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <div className="font-semibold text-xl mb-2 text-gray-800">What is your gender?</div>
          <div className="w-[70%] w-full flex items-center justify-center mt-4 mr-5 !text-gray-800">
            <IonRadioGroup
              value={userData?.gender}
              onIonChange={(e) =>
                setUserData({
                  ...userData,
                  gender: `${e.target.value}`,
                })
              }
            >
              <IonRadio
                value="male"
                labelPlacement="end"
                className="bg-white px-5 w-[140px] py-1 rounded-lg my-1"
              >
                Male
              </IonRadio>
              <br />
              <IonRadio
                value="female"
                className="bg-white px-5 w-[140px] py-1 rounded-lg my-1"
                labelPlacement="end"
              >
                Female
              </IonRadio>{' '}
              <br />
              <IonRadio
                value="other"
                className="bg-white px-5 w-[140px] py-1 rounded-lg my-1"
                labelPlacement="end"
              >
                Other
              </IonRadio>
            </IonRadioGroup>
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <div className="font-semibold text-xl mb-2 text-gray-800">What is your activity level?</div>

          <div>
            <IonSelect
              className="text-gray-800"
              placeholder="Sedentary (office job)"
              onIonChange={(e) =>
                setUserData({
                  ...userData,
                  activity: `${e.target.value}`,
                })
              }
            >
              <IonSelectOption value="sedentary">Sedentary (don't exercise)</IonSelectOption>
              <IonSelectOption value="light">Light exercise (1-2 days /week)</IonSelectOption>
              <IonSelectOption value="moderate">Moderate exercise (3-5 days/week)</IonSelectOption>
              <IonSelectOption value="heavy">Heavy exercise (6-7 days/week)</IonSelectOption>
              <IonSelectOption value="athlete">Athlete (2x per day)</IonSelectOption>
            </IonSelect>
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <div className="font-semibold text-xl mb-2 text-gray-800">What is your goal?</div>

          <div>
            <IonSelect
              className="text-gray-800"
              placeholder="Lose weight"
              onIonChange={(e) =>
                setUserData({
                  ...userData,
                  goal: `${e.target.value}`,
                })
              }
            >
              <IonSelectOption value="lose">Lose weight</IonSelectOption>
              <IonSelectOption value="maintain">Maintain weight</IonSelectOption>
              <IonSelectOption value="gain">Gain weight</IonSelectOption>
            </IonSelect>
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex flex-col items-center justify-center pb-20">
          <div className="font-semibold text-3xl mb-4 text-gray-800">Goal set!</div>
          <CircularProgressbarWithChildren
            value={100}
            styles={buildStyles({
              pathColor: '#222',
              trailColor: '#E7FDE8',
              strokeWidth: 10,
            })}
          >
            <div className="text-6xl font-bold my-2 text-gray-800">{totalCalories}</div>
            <div className="text-2xl mt-[-5px] font-medium text-gray-800">calories</div>
          </CircularProgressbarWithChildren>
          <div className="flex mt-5 gap-2">
            <IonIcon
              aria-hidden="true"
              icon={removeCircleOutline}
              className="text-gray-900 text-2xl"
              onClick={() => setTotalCalories((prevCalories) => Math.max(prevCalories - 1, 0))}
            />
            <IonIcon
              aria-hidden="true"
              icon={addCircleOutline}
              className="text-gray-900 text-2xl"
              onClick={() => setTotalCalories((prevCalories) => Math.max(prevCalories + 1, 0))}
            />
          </div>
        </SwiperSlide>
      </Swiper>
      <div className={`h-[10%] flex px-12 items-center justify-between`}>
        <div
          onClick={handlePrev}
          className={`bg-gray-300 w-[120px]  text-center active:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg ${
            activeSlide == 0 ? 'invisible' : 'visible'
          }`}
        >
          {activeSlide == 7 ? 'Restart' : 'Previous'}
        </div>
        <div
          className={`bg-gray-300 w-[120px]  text-center active:bg-gray-400  font-bold py-2 px-4 rounded-lg ${
            disableNext() ? 'text-gray-400' : 'text-gray-800'
          }`}
          onClick={handleNextBtnClick}
        >
          {activeSlide == 7 ? 'Complete' : 'Next'}
        </div>
      </div>
    </section>
  );
}
