import * as ReactDOM from 'react-dom';
import {ReactElement} from "react";

type CreateContainerT = {
  container: HTMLDivElement,
  render: (component: ReactElement) => Element
  getFormField: ({formId, name}: {formId: string; name: string}) => HTMLFormControlsCollection,
  labelFor: (formLabel: string) => Element,
  startsAtField: (index: number) => Element,
  getForm: (id: string) => HTMLFormElement
  getElement: (selector: string) => Element
  getElements: (selector: string) => NodeList
}

export const createContainer = (): CreateContainerT => {
  const container = document.createElement('div');
  const getForm = (id: string): HTMLFormElement => container.querySelector(`form[id="${id}"]`);
  const getFormField = ({formId, name}: {formId: string, name: string}) => getForm(formId).elements[name];
  const labelFor = (formLabel: string): Element => container.querySelector(`label[for="${formLabel}"]`);
  const startsAtField = (index: number) => container.querySelectorAll(`input[name="startsAt"]`)[index] as Element;
  const render = (component: ReactElement) => ReactDOM.render(component, container) as Element
  const getElement = (selector: string) => container.querySelector(selector) as Element;
  const getElements = (selector: string) => container.querySelectorAll(selector) as NodeList;

  return {
    container,
    getFormField,
    labelFor,
    startsAtField,
    render,
    getForm,
    getElement,
    getElements,
  }
}
