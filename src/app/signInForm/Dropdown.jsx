// Dropdown.jsx
import React from 'react';

const Dropdown = ({ label, name, options, value, onChange }) => {
  return (
    <div className="relative z-0 w-full mb-5 group">
      <label htmlFor={name} className="block text-lg text-slate-800">
        {label}
      </label>
      <select
        name={name}
        id={name}
        className="block py-1 px-2 w-full text-lg rounded-lg text-white bg-blue-800 focus:bg-slate-900 border-2 border-blue-600 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-300"
        value={value}
        onChange={onChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
