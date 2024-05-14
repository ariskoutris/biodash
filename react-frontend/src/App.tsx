import './App.scss';
import { MainPage } from './pages/mainPage/mainPage';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { postPoints, sendData } from './router/resources/data';


function App() {

  const [data, setData] = useState<any>(false) ;
  const [radarData, setRadarData] = useState<any>(false) ;
  const [lineData, setLineData] = useState<any>(false) ;
  const [barData, setBarData] = useState<any>(false) ;
  const [user, setUser] = useState<any>(false) ;

  // TODO: Set default values for target biometric and duration here

  // here fetch and set the data 
  const getRadar = async (e : any) => {
    const _data = await postPoints(`radar/${e.user_id}/5`);
    console.log(_data)
    setRadarData(_data || true)
  }

  // TODO: Add target and duration parameters as arguments
  const getLine = async (e : any) => {
    const _data = await postPoints(`line/${e.user_id}/Weight/5`);
    console.log(_data)
    setLineData(_data || true)
  }

  // TODO: Add target and duration parameters as arguments
  const getBar = async (e : any) => {
    const metric = e.metric || 'Weight'
    const period = e.period || 5
    const _data = await postPoints(`features/${e.user_id}/${metric}/${period}`);
    console.log(_data)
    setBarData(_data || true)
  }


    // here fetch and set the data 
    const _onImportClick = async (e : any) => {
      e.stopPropagation()
      const _id = await sendData('import')
      setUser(_id || true)
    }


  // Effect to fetch user details when `user` is updated
  useEffect(() => {
    // console.log(user.user_id)
    if (user) {
      getRadar(user)
      getLine(user)
      getBar(user)
    }
  }, [user]);


  // Effect to fetch user details when `user` is updated
  useEffect(() => {
    if (radarData && lineData && barData) {
      setData({
        radar: radarData,
        line: lineData,
        bar: barData
      })
    }
  }, [radarData, lineData, barData]);



  return (
    <div className="App">
      <div className='headerContainer'>
      <div className='headerContainerItem'>
        <img className='headerContainerItem' src={require('./assets/technogym_logo_vector.png')}/> 
        </div>
        <header className="App-header"> TechnoGym Assistant </header>
        <div className='headerContainerItem'>
          <Button onClick={_onImportClick}>
            Import Data
          </Button> 
        </div>

      </div>
      <MainPage data={data}/>
    </div>
  )
}

export default App;
