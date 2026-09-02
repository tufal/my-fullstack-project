

 import { useState } from 'react';

function My({ name, color }) {
    const [my, setMy] = useState(name);

    return (
        <div>
            <h1 style={{ color: color }}>{my}</h1>
            <input type="text" placeholder="Enter your name" name="my" value={my} onChange={(e) => setMy(e.target.value)} />
            <button onClick={() => setMy(my.length)}>Length</button>
        </div>
    );
}


export default My;