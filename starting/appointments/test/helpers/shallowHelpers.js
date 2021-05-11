import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

export const predicateByType = typeName => element => element.type === typeName;
export const predicateById = id => element => element.props && element.props.id === id;
export const predicateByClassName = className => element => element.props.className === className;
export const click = element => element.props.onClick();

export const childrenOf = element => {
  if (typeof element === 'string') return []
  const {props:{ children }} = element;
  if (!children) return [];
  if (typeof children === 'string') return [children];
  if (Array.isArray(children)) return children;
  return [children];
};

export const createShallowRenderer = () => {
  let renderer = new ShallowRenderer();
  return {
    render: component => renderer.render(component),
    child: n => childrenOf(renderer.getRenderOutput())[n],
    elementsMatching: matcherFn => elementsMatching(renderer.getRenderOutput(), matcherFn),
    elementMatching: matcherFn => elementsMatching(renderer.getRenderOutput(), matcherFn)[0],
  };
};

export const elementsMatching = (element, matcherFn) => {
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
