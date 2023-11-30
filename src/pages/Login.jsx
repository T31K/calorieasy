import Icon from '../assets/icon.png';

function Login({ createUser, isAuth }) {
  return (
    <>
      <section className="h-[100vh] py-24 bg-[#EAF0E0]">
        <div className={`flex flex-col items-center justify-center pb-20 ${isAuth && 'invisible'}`}>
          <h1 className="text-4xl font-bold tracking-tight mt-[150px] mb-3 text-stone-900">Welcome!</h1>
          <div className="font-semibold tracking-tight text-xl text-stone-700 mb-4">Track calories in seconds!</div>
          <img
            src={Icon}
            alt=""
            className="w-[220px]"
          />
          <div className="text-xl text-center font-medium w-[250px] mt-12 tracking-tight mb-16 text-stone-900">
            {!isAuth && (
              <button
                className="bg-gray-300 w-[150px] text-center active:bg-gray-400 font-bold py-2 px-4 rounded-lg"
                onClick={createUser}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
