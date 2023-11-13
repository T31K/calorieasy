import { useEffect, useState } from 'react';
import {
  IonContent,
  IonDatetime,
  IonPage,
  IonLabel,
  IonChip,
  IonSpinner,
  IonItem,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
} from '@ionic/react';
import UpDirection from '../components/UpDirection';
import { today, convertTime12to24, sortItemsByTimestampDesc } from '../utils/dateUtils';

const Logs = ({ dataStore }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const formattedDate = today();
    setSelectedDate(formattedDate);
  }, []);

  useEffect(() => {
    if (selectedDate && dataStore) fetchFromStore();
  }, [selectedDate, dataStore]);

  async function handleIonChange(e) {
    const { value } = e.target;
    setSelectedDate(value.slice(0, 10));
  }

  async function fetchFromStore() {
    setItems([]);
    setIsLoading(true);
    try {
      const res = await dataStore.get(`foods:${selectedDate}`);
      if (res) {
        let resItems = JSON.parse(res);
        resItems = sortItemsByTimestampDesc(resItems);
        setItems(resItems);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching from data store:', error);
    }
    setIsLoading(false);
  }

  return (
    <IonPage>
      <div className="container h-[90vh] pt-12 pb-6 flex flex-col justify-start gap-4">
        <div className="flex justify-center">
          <IonDatetime
            presentation="date"
            className="rounded-3xl border border-stone-200"
            onIonChange={(e) => handleIonChange(e)}
          />
        </div>
        <IonContent>
          <div className="w-[85%] mx-auto">
            {isLoading && <IonSpinner name="lines-small"></IonSpinner>}
            {items?.map((item, key) => (
              <div
                key={key}
                className="border border-stone-200 rounded-2xl flex flex-col items-start justify-between w-full p-4 mb-3"
              >
                <div className="flex justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-4xl bg-blue-100 h-[50px] w-[50px] flex items-center justify-center rounded-xl ${
                        item.loading && 'skeleton'
                      }`}
                    >
                      {item.emoji}
                    </div>
                    <div className="flex flex-col items-start justify-end">
                      <div className="text-lg font-semibold">{item.name}</div>
                      <div className="text-gray-600 mt-[-5px]">
                        {item.calories ? `${item.calories} kcal` : `'Calculating...'`}
                      </div>
                    </div>
                  </div>
                  <div>
                    <IonChip color="dark">{item.timestamp}</IonChip>
                  </div>
                </div>
                <div className="flex gap-8 w-full pt-5">
                  <div className="flex items-center">
                    <UpDirection
                      values={[item.protein]}
                      color={'#7C8EF1'}
                    />
                    <div className="flex flex-col items-start w-[30%]">
                      <div
                        className={`text-xl font-semibold rounded-lg ${item.loading && '!text-transparent skeleton'}`}
                      >
                        {item.loading ? '100g' : `${item.protein}g`}
                      </div>
                      <div className="text-gray-700">Protein</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UpDirection
                      values={[item.carbs]}
                      color={`#F1F17C`}
                    />
                    <div className="flex flex-col items-start w-[30%]">
                      <div
                        className={`text-xl font-semibold rounded-lg ${item.loading && '!text-transparent skeleton'}`}
                      >
                        {item.loading ? '100g' : `${item.carbs}g`}
                      </div>
                      <div className="text-gray-700">Carbs</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UpDirection
                      values={[item.fat]}
                      color={`#F17C7C`}
                    />
                    <div className="flex flex-col items-start w-[30%]">
                      <div
                        className={`text-xl font-semibold rounded-lg ${item.loading && '!text-transparent skeleton'}`}
                      >
                        {item.loading ? '100g' : `${item.fat}g`}
                      </div>{' '}
                      <div className=" text-gray-700">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {items?.length == 0 && !isLoading ? (
              <div className="border border-stone-200 rounded-2xl flex flex-col items-start justify-between w-full p-4 mb-3">
                No food logged
              </div>
            ) : (
              <></>
            )}
          </div>
        </IonContent>
      </div>
    </IonPage>
  );
};

export default Logs;
