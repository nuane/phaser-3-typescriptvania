// interfaces.ts used as exxample
interface IWords {
  [key: string]: string;
}

interface INumbers {
  [key: string]: number;
}

interface IBooleans {
  [key: string]: boolean;
}

interface IValues {
  [key: string]: string | number;
}

interface IStructures {
  [key: string]: INumbers | IBooleans | IValues;
}

type State = () => void;
interface States {
  idle: State;
  run: State;
  attack: State;
  ...otherStates?: State[];
}

interface SpeechBubbleConfig {
  w: number;
  h: number;
  minDelay: number;
  maxDelay: number;
  quote: string;
}


export {
  States,
  SpeechBubbleConfig
}
