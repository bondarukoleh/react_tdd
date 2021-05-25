import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

export const predicateByType = typeName => {
  return element => {
    return element?.type === typeName
  }
};
export const predicateById = id => element => element?.props?.id === id;
export const predicateByClassName = className => element => element?.props?.className === className;
export const click = element => element.props.onClick();
export const predicateByProp = (propName, value) => element => element.props[propName] === value;

export const childrenOf = element => {
  if (typeof element === 'string') return []
  if (element === null) return []
  const {props: { children }} = element;
  if (!children) return [];
  if (typeof children === 'string') return [children];
  if (Array.isArray(children)) return children;
  return [children];
};

const elementsMatching = (element, matcherFn) => {
  if (matcherFn(element)) {
    return [element];
  }
  return childrenOf(element)
    .reduce((acc, child) => {
      return [
        ...acc,
        ...elementsMatching(child, matcherFn)
      ]
    }, []);
}

export const createShallowRenderer = () => {
  let renderer = new ShallowRenderer();
  return {
    render: component => renderer.render(component),
    child: n => childrenOf(renderer.getRenderOutput())[n],
    elementsMatching: matcherFn => {
      return elementsMatching(renderer.getRenderOutput(), matcherFn)
    },
    elementMatching: matcherFn => {
      return elementsMatching(renderer.getRenderOutput(), matcherFn)[0]
    },
    root: () => renderer.getRenderOutput()
  };
};
