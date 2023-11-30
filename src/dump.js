// useEffect(() => {
//   initStore();
//   async function initStore() {
//     const store = new Storage();
//     await store.create();
//     // store.clear();
//     setDataStore(store);
//   }
// }, []);

// useEffect(() => {
//   if (dataStore) fetchFromStore();
//   async function fetchFromStore() {
//     const admin = await dataStore?.get('admin');
//     if (admin) {
//       setUserData(JSON.parse(admin));
//     } else {
//       let adminObj = {
//         onboard: false,
//         id: uuid(),
//         name: 'Tim',
//         system: 'metric', // metric || imperial
//         age: '',
//         weight: '', // 70 || 150
//         height: '', // 180 if metric || 4ft 5in if imperial
//         gender: '', // male || female || other
//         activity: '', // sedentary, light, moderate, heavy, athlete
//         goal: '', // gain || maintain // lose
//         current_calories: 0, // remove
//         total_calories: 2500,
//         current_protein: 0,
//         total_protein: 150,
//         current_carbs: 0,
//         total_carbs: 200,
//         current_fat: 0,
//         total_fat: 90,
//         premium: false,
//       };
//       dataStore?.set('admin', JSON.stringify(adminObj));
//       setUserData(adminObj);
//     }

//     // let obj = JSON.stringify([
//     //   {
//     //     admin_id: 1,
//     //     id: 1,
//     //     loading: false,
//     //     emoji: '🍳',
//     //     date: '2021-11-30'
//     //     timestamp: '11:03AM',
//     //     name: 'Big breakfast',
//     //     calories: 850,
//     //     protein: 45,
//     //     carbs: 100,
//     //     fat: 20,
//     //   },
//     //   {
//     //     loading: false,
//     //     emoji: '🍳',
//     //     timestamp: '11:03AM',
//     //     name: 'Big breakfast',
//     //     calories: 850,
//     //     protein: 45,
//     //     carbs: 100,
//     //     fat: 20,
//     //   },
//     // ]);
//     // dataStore.set('foods:2023-10-21', obj);
//     // dataStore.set('foods:2023-11-02', obj);
//   }
// }, [dataStore]);
