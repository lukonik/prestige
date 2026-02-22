import { useState } from "react";

interface MyButtonProps {
  type?: "primary";
}

export const MyButton: React.FC<MyButtonProps> = ({ type }) => {
  const [count, setCount] = useState(0);
  return (
    <button className="my-button" style={{ color: "white" }} onClick={() => setCount(count + 1)}>
      my button
      <br /> type: {type}
      <br /> count: {count}
    </button>
  );
};
