import * as ReactDOM from 'react-dom';
import * as ReactTestUtils from 'react-dom/test-utils';
import {ReactElement} from "react";
import {EventSimulator} from "react-dom/test-utils";

const {act} = ReactTestUtils;

type CreateContainerT = {
  container: HTMLDivElement,
  render: (component: ReactElement) => void
  getFormField: ({formId, name}: {formId: string; name: string}) => HTMLFormControlsCollection,
  labelFor: (formLabel: string) => Element,
  startsAtField: (index: number) => Element,
  getForm: (id: string) => HTMLFormElement
  getElement: (selector: string) => Element
  getElements: (selector: string) => NodeList,
  click: (element: HTMLElement, eventData: {}) => void,
  change: (element: HTMLElement, eventData: {}) => void,
  submit: (element: HTMLElement, eventData: {}) => Promise<void>,
  blur: (element: HTMLElement, eventData: {}) => void,
  asyncRender: (component: ReactElement) => Promise<void>
}

enum EventsT {
  CLICK = 'click',
  CHANGE = 'change',
  SUBMIT = 'submit',
  BLUR = 'blur',
}

export const createContainer = (): CreateContainerT => {
  const container = document.createElement('div');
  const getForm = (id: string): HTMLFormElement => container.querySelector(`form[id="${id}"]`);
  const getFormField = ({formId, name}: {formId: string, name: string}) => getForm(formId).elements[name];
  const labelFor = (formLabel: string): Element => container.querySelector(`label[for="${formLabel}"]`);
  const startsAtField = (index: number) => container.querySelectorAll(`input[name="startsAt"]`)[index] as Element;
  const render = component => {
    act(() => {
      ReactDOM.render(component, container);
    })
  }
  const asyncRender = async component => {
    return act(async () => {
      ReactDOM.render(component, container)
    });
  };
  const getElement = (selector: string) => container.querySelector(selector) as Element;
  const getElements = (selector: string) => container.querySelectorAll(selector) as NodeList;
  const simulateEvent = (eventName: EventsT) => {
    return (element: HTMLElement, eventData: {}): void => {
      return ReactTestUtils.Simulate[eventName](element, eventData)
    }
  };

  const asyncSimulateEvent = (eventName: EventsT)  => {
    return async (element: HTMLElement, eventData: {}) => {
      return act(async () =>
        ReactTestUtils.Simulate[eventName](element, eventData)
      )
    }
  };

  return {
    container,
    getFormField,
    labelFor,
    startsAtField,
    render,
    getForm,
    getElement,
    getElements,
    click: simulateEvent(EventsT.CLICK),
    change: simulateEvent(EventsT.CHANGE),
    submit: asyncSimulateEvent(EventsT.SUBMIT),
    blur: simulateEvent(EventsT.BLUR),
    asyncRender
  }
}

export const withEvent = (name, value) => ({
  target: { name, value }
});
