import React from 'react';
import ReactDOM from 'react-dom'
import objstr from 'obj-str';
import styles from './button.block.css';

export default function Button({ size='medium', inverse, icon, children }) {
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

ReactDOM.render(<div>
  <Button size='small'>Hello CSS Blocks World!</Button><br />
  <Button size='medium' inverse={true}>Hello CSS Blocks World!</Button><br />
  <Button size='large'>Hello CSS Blocks World!</Button>
</div>, document.getElementById('app'))