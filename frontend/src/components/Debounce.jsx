import React, { useEffect, useState } from "react";
import axios from "axios";

const Debounce = () => {
  const [input, setInput] = useState("");
  useEffect(() => {
    let debounceCall = setTimeout(() => {
      axios
        .get(`https://demo.dataverse.org/api/search?q=${input}`)
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
    }, 2000);

    return () => {
      clearTimeout(debounceCall);
    };
  }, [input]);
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

export default Debounce;
