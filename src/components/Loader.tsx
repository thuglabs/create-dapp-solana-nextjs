export function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col justify-center items-center pt-16 text-xl font-light">
      <svg
        className="animate-spin -ml-1 mr-3 h-8 w-8 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="white"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-5"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>{" "}
      <div className="opacity-50 mt-4">{text}</div>
    </div>
  );
}
