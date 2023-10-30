import { useEffect, useState } from 'react';
import { IonContent, IonDatetime, IonPage, IonChip, IonSpinner } from '@ionic/react';
import UpDirection from '../components/UpDirection';

const Logs = ({ dataStore }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateTime, setDateTime] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localDate = new Date(now - offset);
    const formattedDate = localDate.toISOString().split('T')[0].split('-');
    setSelectedDay(formattedDate[2]);
    setSelectedMonth(`${formattedDate[0]}-${formattedDate[1]}`);
  }, []);

  useEffect(() => {
    if (selectedMonth) fetchFromStore();
  }, [selectedMonth]);

  function handleIonChange(e) {
    const { value } = e.target;
    const formattedMonth = value.slice(0, 7);
    setSelectedDay(value.slice(8, 10));
    if (formattedMonth !== selectedMonth) setSelectedMonth(formattedMonth); // check if same with current state
  }
  async function fetchFromStore() {
    setItems([]);
    setIsLoading(true);
    try {
      const res = await dataStore.get(`foods:${selectedMonth}`);
      if (res) {
        const resItems = JSON.parse(res);
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
            value={dateTime}
            onIonChange={(e) => handleIonChange(e)}
          />
        </div>
        <IonContent>
          <div className="w-[85%] mx-auto">
            {isLoading && <IonSpinner name="lines-small"></IonSpinner>}
            {items[selectedDay]?.map((item, key) => (
              <div
                key={key}
                className="border border-stone-200 rounded-2xl flex flex-col items-start justify-between w-full p-4 mb-3"
              >
                <div className="flex justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <div className="text-4xl bg-blue-100 h-[50px] w-[50px] flex items-center justify-center rounded-xl">
                      {item.emoji}
                    </div>
                    <div className="flex flex-col items-start justify-end">
                      <div className="text-lg font-semibold">{item.name}</div>
                      <div className="text-gray-600 mt-[-5px]">{item.calories} kcal</div>
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
                      <div className="text-xl font-semibold">{item.protein}g</div>
                      <div className="mt-[-5px] text-gray-700">Protein</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UpDirection
                      values={[item.carbs]}
                      color={`#F1F17C`}
                    />
                    <div className="flex flex-col items-start w-[30%]">
                      <div className="text-xl font-semibold">{item.carbs}g</div>
                      <div className="mt-[-5px] text-gray-700">Carbs</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <UpDirection
                      values={[item.fat]}
                      color={`#F17C7C`}
                    />
                    <div className="flex flex-col items-start w-[30%]">
                      <div className="text-xl font-semibold">{item.fat}g</div>
                      <div className="mt-[-5px] text-gray-700">Fat</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!items[selectedDay] && !isLoading && (
              <div className="border border-stone-200 rounded-2xl flex flex-col items-start justify-between w-full p-4 mb-3">
                No food logged
              </div>
            )}
          </div>
        </IonContent>
      </div>
    </IonPage>
  );
};

export default Logs;
