import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router';
import Mainlayout from './page/mainlayout';
import Home from './page/home';
import Records from './page/records';
import SearchRecord from './page/searchrecord';

import Entry from './page/Entry';


export default function App(){
  return (

<>
<HashRouter>
    <Routes>
      {/*route for main window */}
      <Route path="/" element={<Mainlayout/>}>
        <Route index element={<Home/>}/>
        <Route path="/records" element={<Records/>}/>
        <Route path="/records/year/:year" element={<Records/>}/>
         {/*make new route for pass data with url, the /:year can be extract with useParams() and return as an object   */}
      </Route>
      {/*route for new child window */}
      <Route path="/Entry" element={<Entry/>}/>
      <Route path="/searchrecord" element={<SearchRecord/>}/> 
     
    </Routes>

</HashRouter>
</>
  );
}

const appstart = document.getElementById("root");

const root = createRoot(appstart);

root.render(<App/>)
