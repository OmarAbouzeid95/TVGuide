import { TailSpin } from "react-loader-spinner";

function Loader({ size }) {
  return (
    <TailSpin
      visible={true}
      height={size}
      width={size}
      color="white"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}

export default Loader;
