import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonHeader, IonBackButton, IonToolbar, IonButton } from '@ionic/react';
import { useLocation } from 'react-router';

const Logs = ({ foodData }) => {
  const [item, setItem] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location && foodData) {
      const item = findArrayWithId(foodData);
      if (item) setItem(item);
    }
  }, [location, foodData]);

  function findArrayWithId(data) {
    let id = location?.pathname?.split('/').pop();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const array = data[key];
        const foundItem = array.find((obj) => {
          return obj.id == id;
        });
        setIsLoading(false);
        if (foundItem) return foundItem;
      }
    }
    return null; // Return null if no matching id is found
  }

  return (
    <>
      {!isLoading ? (
        <>
          <IonHeader>
            <IonToolbar className="pb-3 flex items-center ">
              <div
                className="bg-gray-300 w-[120px]  text-center active:bg-gray-400  font-bold py-2 mt-2 px-4 rounded-lg"
                onClick={() => {
                  history.back();
                }}
              >
                Back
              </div>
            </IonToolbar>
          </IonHeader>
          <div className="container h-[90vh] pt-6 pb-6 flex flex-col justify-start gap-4">
            <div className="h-[120px] bg-stone-50 rounded-xl border flex justify-center items-center gap-6">
              <div className="tracking-tight text-2xl font-bold text-center ">{item?.emoji} </div>
              <div className="tracking-tight text-2xl font-bold text-center ">{item?.name} </div>
              <div className="tracking-tight text-2xl font-bold text-center ">{item?.calories} kcal </div>
            </div>
            <IonContent>
              {item?.macros?.map((macro, index) => (
                <div
                  key={index}
                  className="h-[50px] bg-stone-50 rounded-xl border flex items-center gap-8 my-2"
                >
                  <div className="ml-5 text-2xl">{macro?.emoji}</div>
                  <div className="tracking-tight font-semibold w-[40%] whitespace-nowrap capitalize">{macro?.name}</div>
                  <div className="tracking-tight font-semibold text-right w-[30%]">{macro?.calories}</div>
                </div>
              ))}
            </IonContent>
          </div>
        </>
      ) : (
        <div className="absolute h-[90vh] w-full bg-[#222222] opacity-50 flex pt-[70%] justify-center">
          <span className="loader"></span>
        </div>
      )}
    </>
  );
};

export default Logs;
