import {CSSProperties, useEffect, useRef, useState} from 'react';
import interact from 'interactjs';

type Partial<T> = {
    [P in keyof T]?: T[P];
}

const initPosition = {
  width: 100,
  height: 100,
  x: 0,
  y: 0,
};

const edgePosition = {
  maxX: 200,
  maxY: 200,
  minX: 0,
  minY: 0,
};

/**
 * HTML要素を動かせるようにする
 * 返り値で取得できるinteractRefと、interactStyleをそれぞれ対象となるHTML要素の
 * refとstyleに指定することで、そのHTML要素のリサイズと移動が可能になる
 * @param {Partial} position - HTML要素の初期座標と大きさ、指定されない場合はinitPositionで指定された値になる。
 * @param {Required} edge - 端のposition
 * @return {interactRef}
 */
export function useInteractJS(
    position: Partial<typeof initPosition> = initPosition,
    edge: Required<typeof edgePosition> = edgePosition,
) {
  const [_position, setPosition] = useState({
    ...initPosition,
    ...position,
  });

  const [isEnabled, setEnable] = useState(true);

  const interactRef = useRef(null);
  let {x, y, width, height} = _position;

  const enable = () => {
    interact((interactRef.current as unknown) as HTMLElement)
        .draggable({
          inertia: false,
        })
        .resizable({
          // resize from all edges and corners
          edges: {left: true, right: true, bottom: true, top: true},
          preserveAspectRatio: false,
          inertia: false,
        })
        .on('dragmove', (event) => {
          x += event.dx;
          y += event.dy;
          // confirm max position
          x = x >= edge.maxX? edge.maxX : x;
          y = y >= edge.maxY? edge.maxY : y;
          // confirm min position
          x = x <= edge.minX? edge.minX : x;
          y = y <= edge.minY? edge.minY : y;
          setPosition({
            width,
            height,
            x,
            y,
          });
        });
    // .on('resizemove', (event) =>{
    //   width = event.rect.width;
    //   height = event.rect.height;
    //   x += event.deltaRect.left;
    //   y += event.deltaRect.top;
    //   setPosition({
    //     x,
    //     y,
    //     width,
    //     height,
    //   });
    // });
  };

  const disable = () => {
    interact((interactRef.current as unknown) as HTMLElement).unset();
  };

  useEffect(() => {
    if (isEnabled) {
      enable();
    } else {
      disable();
    }
    return disable;
  }, [isEnabled]);

  return {
    ref: interactRef,
    style: {
      transform: `translate3D(${_position.x}px, ${_position.y}px, 0)`,
      width: _position.width + 'px',
      height: _position.height + 'px',
      position: 'absolute' as CSSProperties['position'],
    },
    position: _position,
    isEnabled,
    enable: () => setEnable(true),
    disable: () => setEnable(false),
  };
}
