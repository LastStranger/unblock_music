import { useCallback, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.scss";
import One from "./assets/one.png";
// import * as electron from "electron";
// import electron from "electron";
const electron = require("electron");

/*
*
*     "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "start": "electron-forge start",
    "package": "electron-forge package",
    "make": "electron-forge make" */

function App() {
  const [logList, setLogList] = useState<any[]>([]);

  useEffect(() => {
    console.log(logList);
    // if(logList.length <1){
    //   electron.ipcRenderer.on('msg', (even:any,data:any) => {
    //     console.log('%clogList1', "color: #22E1FF; font-size: 16px", logList);
    //     setLogList([...logList, data])
    //   });
    // }
    const listener = (even: any, data: any) => {
      console.log("%clogList1", "color: #22E1FF; font-size: 16px", logList);
      setLogList([...logList, data]);
    };
    electron.ipcRenderer.on("msg", listener);
    return () => {
      electron.ipcRenderer.removeListener("msg", listener);
    };
    // electron.ipcRenderer.on('msg', listener);
    // return () => {
    //   electron.ipcRenderer.removeListener('msg', listener)
    // }
  }, [logList]);

  console.log("%clogLists", "color: #22E1FF; font-size: 16px", logList);

  return (
    <div className="App">
      <div className="title">代理成功的歌曲列表</div>
      <div className="list">
        {logList.map((each) => (
          <div key={each.data.name}>
            <span>{each.data.name}</span>
            <a href={each.data.url} download="haha">链接</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
