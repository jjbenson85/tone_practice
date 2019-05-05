import React from 'react'
// import Tone from 'tone'
import '../scss/polysynth.scss'


const PolySynthInterface = (props) => {
  // console.log(props)
  // let position = '0:0:0'

  // const [position, setPosition] = useState('0:0:0')
  //
  // useEffect(() => {
  //   position = props.position
  // })

  // Tone.Transport.scheduleRepeat((time)=>{
  //   Tone.Draw.schedule(()=>{
  //     setPosition(Tone.Transport.position.split('.')[0])
  //   }, time+0.01)
  // }, '16n', '0m')
  const {id, handleControlChange} = props
  return(
    <>
      <div className={`inner polysynth-interface-${id}`}>
        <h1>PolySynth</h1>
        <button onClick={()=>handleControlChange(1,'preset')}> Preset1</button>
        <button onClick={()=>handleControlChange(2,'preset')}> Preset2</button>
        <button onClick={()=>handleControlChange(3,'preset')}> Preset3</button>
        <button onClick={()=>handleControlChange(4,'preset')}> Preset4</button>
      </div>
    </>
  )
}

export default PolySynthInterface
