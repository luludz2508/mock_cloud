import React, { useState } from 'react';

function SearchBar({ selectedField, fields, onSearch }) {
    const [select, setSelect] = useState(selectedField);
    const [text, setText] = useState('');
    return (
        <div className="input-group">
            <input type="text" className="form-control" value={text} onChange={e=>setText(e.target.value)} />
            <div className="input-group-prepend">
            <select className="form-control" value="Radish" onChange={(e)=>setSelect(e.target.value)}>
                {fields.map(f =><option value={f}>{f}</option>)}
            </select>
            </div>
            <div className="input-group-prepend">
            <button className="form-control" onClick={()=> onSearch(text, select)}>Search</button>
            </div>
            
        </div>
    )
}
export default SearchBar;