// TextInput.jsx
import React from 'react';

const TextInput = ({ label, name, value, onChange, type = 'text' }) => {
  return (
    <div className="relative z-0 w-full mb-5 group">
      <input
        type={type}
        name={name}
        id={name}
        className="block py-2.5 px-0 w-full text-lg text-blue-800 bg-transparent rounded-lg border-0 border-b-2 border-blue-600 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-300 peer"
        placeholder=" "
        value={value}
        onChange={onChange}
        required
      />
      <label
        htmlFor={name}
        className="peer-focus:font-medium absolute text-lg text-slate-800 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-indigo-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
};

export default TextInput;
