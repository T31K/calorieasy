import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import UpDirection from '../components/UpDirection';
import { today, convertTime24to12 } from '../utils/dateUtils';
import { IonContent, IonDatetime, IonPage, IonChip, IonSpinner, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

const Logs = ({ foodData, userData, setPaywallOpen }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const history = useHistory();

  const navigateToShow = (id) => {
    history.push(`/show/${id}`);
  };

  useEffect(() => {
    const formattedDate = today();
    setSelectedDate(formattedDate);
  }, []);

  useEffect(() => {
    if (selectedDate && foodData) {
      if (foodData[selectedDate]) {
        setItems(foodData[selectedDate]);
      }
      setIsLoading(false);
    }
  }, [selectedDate, foodData]);

  async function handleIonChange(e) {
    const { value } = e.target;
    setSelectedDate(value.slice(0, 10));
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pb-3 flex items-center justify-between px-3">
          <IonTitle>
            <div
              className={`hidden bg-[#58F168] mx-auto h-[35px] rounded-full flex items-center justify-center ${
                userData?.premium || !userData?.show_paywall ? 'invisible' : null
              }`}
              onClick={() => setPaywallOpen(true)}
            >
              Upgrade for more scans
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="py-6 flex flex-col justify-start gap-4">
          <div className="flex justify-center">
            <IonDatetime
              presentation="date"
              className="rounded-3xl border border-stone-200 dark:bg-black"
              onIonChange={(e) => handleIonChange(e)}
            />
          </div>
          <div className="w-[85%] mx-auto">
            {isLoading && <IonSpinner name="lines-small"></IonSpinner>}
            {items?.map((item, key) => (
              <div
                key={key}
                className="border dark:bg-stone-900 border-stone-200 rounded-2xl flex flex-col items-start justify-between w-full p-4 mb-3"
                onClick={() => navigateToShow(item.id)}
              >
                <div className="flex justify-between gap-2 w-full">
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-4xl bg-blue-100 h-[50px] w-[50px] flex items-center justify-center rounded-xl ${
                        item.loading && 'skeleton'
                      }`}
                    >
                      {item.emoji.substring(0, 2)}
                    </div>
                    <div className="flex flex-col items-start justify-end">
                      <div className="text-lg font-semibold whitespace-nowrap">
                        {item.name.length >= 20 ? item.name.substring(0, 20) + '...' : item.name}
                      </div>
                      <div className="text-gray-600 mt-[-5px]">
                        {item.calories ? `${item.calories} kcal` : `'Calculating...'`}
                      </div>
                    </div>
                  </div>
                  <div>
                    <IonChip color="dark">{convertTime24to12(item.timestamp)}</IonChip>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Logs;
