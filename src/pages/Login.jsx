import { useAuth0 } from '@auth0/auth0-react';
import Icon from '../assets/icon.png';

function Login() {
  const { loginWithRedirect } = useAuth0();
  return (
    <section className="h-[100vh] py-24 bg-[#EAF0E0]">
      <div className="flex flex-col items-center justify-center pb-20">
        <h1 className="text-4xl font-bold tracking-tight mt-[150px] mb-8 text-stone-900">Welcome!</h1>
        <img
          src={Icon}
          alt=""
          className="w-[220px]"
        />
        <div className="text-xl text-center font-medium w-[250px] mt-12 tracking-tight mb-16 text-stone-900">
          <button
            className="bg-gray-300 w-[120px]  text-center active:bg-gray-400  font-bold py-2 px-4 rounded-lg"
            onClick={() => loginWithRedirect()}
          >
            Log In
          </button>
        </div>
      </div>
    </section>
  );
}

export default Login;
