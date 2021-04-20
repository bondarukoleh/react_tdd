import {render} from 'react-dom';
import {ReactElement} from "react";

export const createContainer = (): {container: Element, render: (component: ReactElement) => Element} => {
  const container = document.createElement('div');

  return {
    container,
    render: (component: ReactElement) => render(component, container) as Element
  }
}
