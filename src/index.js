import React from 'react';
import ReactDOM from 'react-dom'
import objstr from 'obj-str';
import styles from './button.css';

console.log(styles)

export default function Button({ size, inverse, icon, children }) {
  const style = objstr({
    [styles]: true,
    [styles.inverse()]: inverse,
    [styles.size(size)]: true
  });
  return (
    <button class={style}>
      {icon && <span class={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}

ReactDOM.render(<Button />, document.getElementById('app'))