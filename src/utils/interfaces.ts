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

//// TODO: used for oreh
type State = () => void;
interface States {
  idle: State;
  run: State;
  attack: State;
  jump?: State;
  ...otherStates?: State[];
}

interface SpeechBubbleConfig {
  quote: string;
  w?: number;
  h?: number;
  minDelay?: number;
  maxDelay?: number;
}

interface JumpConfig {
  s: number;
  h: number;
  t: number;
  amount: number;
  counter: number;
}

interface SwingConfig {
  ox: number;
  oy: number;

  acc: number;
  vel: number;
  angle: number;
  dis: number;
}


export {
  States,
  State,
  SpeechBubbleConfig,
  JumpConfig,
  SwingConfig,
}
