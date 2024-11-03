// import * as React from 'react';

// export interface HelloWorldProps {
//     text: string;
// }

// export class HelloWorld extends React.Component<HelloWorldProps> {
//     render() {
//         return <h1>{this.props.text}</h1>;
//     }
// }

import React from 'react';

interface HelloWorldProps {
  text: string;
}

export const HelloWorld: React.FC<HelloWorldProps> = ({ text }) => {
    console.log('HelloWorld component rendered', text);
  return <h1>{text}ssdsfeee</h1>;
};


// Example usage
export default function Component() {
  return (
    <div>
      <HelloWorld text="Hello, Worldddd!" />
    </div>
  );
}