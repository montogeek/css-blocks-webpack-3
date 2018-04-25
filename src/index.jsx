import React from 'react';
import ReactDOM from 'react-dom'
import objstr from 'obj-str';
import styles from './button.block.css';

export default function Button({ size = 'medium', inverse, icon, children }) {
  const style = objstr({
    [styles]: true,
    [styles.inverse()]: inverse,
    [styles.size(size)]: true
  });

  return (
    <button className={style}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
}

ReactDOM.render(<Button inverse={true}>Hello CSS Blocks!</Button>, document.getElementById('app'))