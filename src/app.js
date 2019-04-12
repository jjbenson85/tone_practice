import React from 'react'
import ReactDOM from 'react-dom'

import Tone from 'tone'

import Monosynth from './components/Monosynth'
import GridSequencer from './components/GridSequencer'

import './scss/style.scss'

class App extends React.Component {

  constructor(){
    super()

    this.state={
      instruments: ['Monosynth', 'Monosynth']
    }
  }


  playSound(){
    Tone.Transport.start()

  }
  stopSound(){
    Tone.Transport.stop()
  }

  render() {
    return (
      <div>Hello World!
        <button onClick={()=>this.playSound()}>PLAY</button>
        <button onClick={()=>this.stopSound()}>STOP</button>
        <div>
          {this.state.instruments.map( (inst,i) => <Monosynth key={i} id={i} />)}
        </div>

      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
